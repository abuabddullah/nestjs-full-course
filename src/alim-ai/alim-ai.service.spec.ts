import { Test, TestingModule } from '@nestjs/testing';
import { AlimAiService } from './alim-ai.service';

describe('AlimAiService', () => {
  let service: AlimAiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlimAiService],
    }).compile();

    service = module.get<AlimAiService>(AlimAiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
