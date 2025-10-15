import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import appConfig from '../../../config/app.config';
import { RiderServiceModule } from './rider-service.module';

async function bootstrap() {
  const app = await NestFactory.create(RiderServiceModule);
  const config = appConfig();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto claases
      disableErrorMessages: false,
    }),
  );
  await app.listen(config.riderService.port);
  console.log(`Rider Service is running on port ${config.riderService.port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to start Rider Service:', err);
  process.exit(1);
});
