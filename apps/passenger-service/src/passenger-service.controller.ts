import { Controller, Get } from '@nestjs/common';
import { PassengerServiceService } from './passenger-service.service';

@Controller()
export class PassengerServiceController {
  constructor(private readonly passengerServiceService: PassengerServiceService) {}

  @Get()
  getHello(): string {
    return this.passengerServiceService.getHello();
  }
}
