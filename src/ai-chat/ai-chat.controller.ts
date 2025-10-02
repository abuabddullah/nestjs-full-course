import { Controller, Post, Body } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { sendResponse } from 'src/utils/response.util';

@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiChatService: AiChatService) {}

  @Post()
  async chat(@Body('message') message: string) {
    const response = await this.aiChatService.chat(message);
    return sendResponse('Chat response successfull', response);
  }
}
