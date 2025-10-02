// src/ai-chat/ai-chat.service.ts
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
export class AiChatService {
  private readonly logger = new Logger(AiChatService.name);
  private app: any;

  constructor(private readonly configService: ConfigService) {
    const groqApiKey = appConfig().ai.groqApiKey;

    if (!groqApiKey) {
      this.logger.warn(
        'AI_GROQ_API_KEY is not set. Groq calls will fail unless provided.',
      );
    }

    const tavilyWebsearchTool = new TavilySearch({
      maxResults: 3,
      topic: 'general',
      includeImages: true,
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

  /**
   * Invoke the workflow with retry on rate-limit (respects retry-after header when present).
   */
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
          // Not a rate limit or out of retries -> rethrow so caller can handle/log
          throw err;
        }

        // Respect retry-after header if present (seconds). Fallback to exponential backoff.
        const retryAfterHeader =
          err?.headers?.['retry-after'] ?? err?.error?.retry_after ?? null;
        let waitSeconds = 2 ** attempt; // fallback exponential backoff (2,4,8...)
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
        // loop to retry
      }
    }
  }

  /**
   * Send user input to the compiled workflow and return the assistant text.
   */
  async chat(userInput: string): Promise<string> {
    if (!userInput || typeof userInput !== 'string' || !userInput.trim()) {
      throw new InternalServerErrorException('User input is required');
    }

    try {
      // Use invokeWithRetry which handles rate-limit waiting/retries
      const finalState = await this.invokeWithRetry(
        { messages: [{ role: 'user', content: userInput }] },
        { configurable: { thread_id: '1' } },
        3, // maxAttempts
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
        // Build friendly message and surface as 429 HTTP
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
