import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { ChatGroq } from '@langchain/groq';
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from '@langchain/langgraph';
import { ToolNode } from '@langchain/langgraph/prebuilt';
import { TavilySearch } from '@langchain/tavily';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import appConfig from 'src/config/app.config';

@Injectable()
export class AlimAiService {
  private readonly logger = new Logger(AlimAiService.name);
  private app: any;
  private readonly systemPrompt: string;

  constructor(private readonly configService: ConfigService) {
    const aiConfig = appConfig().ai;
    const groqApiKey = aiConfig.groqApiKey;

    if (!groqApiKey) {
      this.logger.warn(
        'AI_GROQ_API_KEY is not set. Groq calls will fail unless provided.',
      );
    }

    // Use system prompt from config if available, otherwise use default prompt below
    const configured = (aiConfig as any)?.systemPrompt;
    this.systemPrompt =
      typeof configured === 'string' && configured.trim().length > 0
        ? configured
        : `You are a dedicated Research Assistant to a Salafi scholar and expert Islamic writer. Your role is to support them in Islamic research, writing, and teaching by providing precise, evidence-based responses rooted strictly in the Quran, Sahih Hadith, and the understanding of the Salaf as-Salih. You NEVER give personal opinions, interpretations, or fatwas—only references and summaries from authentic sources. Always respond in a respectful, humble, and scholarly tone, starting with "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ" and ending with "وَاللَّهُ أَعْلَمُ" (Allah knows best).

Role Prompting Guidelines:
- Identity: research assistant to the Scholar; focus on beginner-to-advanced Islamic knowledge; write simply in Bengali unless specified otherwise.
- Response style: Provide Quran and Sahih Hadith references only. Make Quran/Hadith links use these sites: https://ihadis.com/ for Hadith and https://www.hadithbd.com/ for Quran/Hadith. Attach Hadith references as footnotes. If citing Salafi scholars, provide minimal sourced links.
- Prohibitions: Avoid weak narrations, bid'ah, shirk, and modern reinterpretations. For controversial queries, prioritize Quran and Sahih Hadith only. Alos if anyone directly asks you about your opinion you just politely reply,"I am not an Alim, I can help you by researching only. Plz ask to your closest knowlegble Alim for the opinion."

- Formatting: Wrap the entire response in a div tags. Use HTML for formatting:  for bold text replace ** with <b> tags,  for italics replace * with <i> tags,
 for line breaks replace \n with </br>, and  for paragraphs. Do not use Markdown or plain text formatting.

Operational rules:
- Output must be concise and in Bengali by default.
- Do NOT reveal any internal chain-of-thought or reasoning steps. Produce the final answer only.
- If the user asks for justification, provide only references (Quran/ Sahih Hadith / named Salafi source links).
- If the user's question is not Islamic or outside scope, politely redirect to the scholar's focus.

(End of system prompt.)`;

    // Tools and LLM initialization (same as before)
    const tavilyWebsearchTool = new TavilySearch({
      maxResults: 3,
      topic: 'general',
    });

    const tools = [tavilyWebsearchTool];
    const toolNode = new ToolNode(tools);

    const llm = new ChatGroq({
      model: 'openai/gpt-oss-120b',
      temperature: 0,
      maxRetries: 2,
      apiKey: groqApiKey,
    }).bindTools(tools);

    async function callModel(state: any) {
      const response = await llm.invoke(state.messages);
      return { messages: [response] };
    }

    function shouldContinue(state: any) {
      const lastMessage = state.messages[state.messages.length - 1];
      if (lastMessage?.tool_calls && lastMessage.tool_calls.length > 0) {
        return 'tools';
      }
      return '__end__';
    }

    const workflow = new StateGraph(MessagesAnnotation)
      .addNode('agent', callModel)
      .addNode('tools', toolNode)
      .addEdge('__start__', 'agent')
      .addEdge('tools', 'agent')
      .addConditionalEdges('agent', shouldContinue);

    this.app = workflow.compile({ checkpointer: new MemorySaver() });
  }

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async invokeWithRetry(payload: any, options: any, maxAttempts = 3) {
    let attempt = 0;
    while (true) {
      attempt++;
      try {
        return await this.app.invoke(payload, options);
      } catch (err: any) {
        const isRateLimit =
          err?.status === 429 ||
          err?.error?.code === 'rate_limit_exceeded' ||
          err?.error?.type === 'tokens';

        if (!isRateLimit || attempt >= maxAttempts) {
          throw err;
        }

        const retryAfterHeader =
          err?.headers?.['retry-after'] ?? err?.error?.retry_after ?? null;
        let waitSeconds = 2 ** attempt;
        if (retryAfterHeader) {
          const parsed = Number(retryAfterHeader);
          if (!Number.isNaN(parsed) && parsed > 0) {
            waitSeconds = Math.ceil(parsed);
          }
        }

        this.logger.warn(
          `Rate-limited by Groq (attempt ${attempt}/${maxAttempts}). Waiting ${waitSeconds}s before retrying...`,
        );

        await this.sleep(waitSeconds * 1000);
      }
    }
  }

  /**
   * chat(userInput, systemOverride?)
   * - userInput: user message (string)
   * - systemOverride: optional string to override the configured system prompt for this call
   *
   * Returns the assistant final message (string).
   */
  async chat(userInput: string, systemOverride?: string): Promise<string> {
    if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
      throw new InternalServerErrorException('User input is required');
    }

    const systemMessage =
      systemOverride && systemOverride.trim().length > 0
        ? systemOverride
        : this.systemPrompt;

    // Build messages: system first, then user
    const messages = [
      new SystemMessage(systemMessage),
      new HumanMessage(userInput),
    ];

    try {
      const finalState = await this.invokeWithRetry(
        { messages },
        { configurable: { thread_id: '1' } },
        3,
      );

      const lastMessage =
        finalState?.messages?.[finalState.messages.length - 1];
      const content =
        (lastMessage &&
          (lastMessage.content ?? lastMessage.text ?? lastMessage.message)) ||
        '';

      return String(content);
    } catch (err: any) {
      const isRateLimit =
        err?.status === 429 ||
        err?.error?.code === 'rate_limit_exceeded' ||
        err?.error?.type === 'tokens';
      if (isRateLimit) {
        const retryAfter = err?.headers?.['retry-after'] ?? null;
        const waitText = retryAfter
          ? `Try again after ${retryAfter} seconds.`
          : 'Please try again later.';
        const message =
          err?.error?.error?.message ??
          err?.message ??
          `Rate limit exceeded. ${waitText}`;

        this.logger.warn(`Rate limit from Groq: ${message}`);
        throw new HttpException(message, HttpStatus.TOO_MANY_REQUESTS);
      }

      this.logger.error('LLM invocation failed', err);
      throw new InternalServerErrorException('AI service error');
    }
  }
}
