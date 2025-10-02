import { Module } from '@nestjs/common';
import { AlimAiService } from './alim-ai.service';
import { AlimAiController } from './alim-ai.controller';

@Module({
  providers: [AlimAiService],
  controllers: [AlimAiController]
})
export class AlimAiModule {}
