import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import appConfig from '../../../config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  const config = appConfig();
  await app.listen(config.authService.port);
  console.log(`Auth Service is running on port ${config.authService.port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to start Auth Service:', err);
  process.exit(1);
});
