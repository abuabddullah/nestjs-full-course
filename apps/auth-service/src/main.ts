import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import appConfig from '../../../config/app.config';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // const app = await NestFactory.create(AuthServiceModule);
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthServiceModule,
    {
      transport: Transport.TCP,
    },
  );
  const config = appConfig();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto claases
      disableErrorMessages: false,
    }),
  );
  // await app.listen(config.authService.port);

  await app.listen();
  console.log(`Auth Service is running on port ${config.authService.port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to start Auth Service:', err);
  process.exit(1);
});
