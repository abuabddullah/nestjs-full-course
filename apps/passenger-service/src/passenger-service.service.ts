import { Injectable } from '@nestjs/common';

@Injectable()
export class PassengerServiceService {
  getHello(): string {
    return 'Hello World! passenger-service';
  }
}
