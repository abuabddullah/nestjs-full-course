import { Test, TestingModule } from '@nestjs/testing';
import { PassengerServiceController } from './passenger-service.controller';
import { PassengerServiceService } from './passenger-service.service';

describe('PassengerServiceController', () => {
  let passengerServiceController: PassengerServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PassengerServiceController],
      providers: [PassengerServiceService],
    }).compile();

    passengerServiceController = app.get<PassengerServiceController>(PassengerServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(passengerServiceController.getHello()).toBe('Hello World!');
    });
  });
});
