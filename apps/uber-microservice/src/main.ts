import { NestFactory } from '@nestjs/core';
import appConfig from '../../../config/app.config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = appConfig();
  await app.listen(config.app.port);
  console.log(`Main Application is running on port ${config.app.port}`);
}
bootstrap().catch((err) => {
  console.error('Failed to start Main Application:', err);
  process.exit(1);
});
