import { Body, Controller, Post } from '@nestjs/common';
import { AlimAiService } from './alim-ai.service';

@Controller('alim-ai')
export class AlimAiController {
  constructor(private readonly alimAiService: AlimAiService) {}

  @Post()
  async chat(@Body('message') message: string) {
    const response = await this.alimAiService.chat(message);
    return { response };
  }
}
