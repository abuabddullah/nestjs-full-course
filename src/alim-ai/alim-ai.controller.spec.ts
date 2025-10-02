import { Test, TestingModule } from '@nestjs/testing';
import { AlimAiController } from './alim-ai.controller';

describe('AlimAiController', () => {
  let controller: AlimAiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlimAiController],
    }).compile();

    controller = module.get<AlimAiController>(AlimAiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
