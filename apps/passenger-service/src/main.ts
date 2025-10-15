import { NestFactory } from '@nestjs/core';
import { PassengerServiceModule } from './passenger-service.module';
import appConfig from '../../../config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(PassengerServiceModule);
  const config = appConfig();
  await app.listen(config.passengerService.port);
  console.log(
    `Passenger Service is running on port ${config.passengerService.port}`,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to start Passenger Service:', err);
  process.exit(1);
});
