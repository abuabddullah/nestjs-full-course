import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import appConfig from 'src/config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorators
      forbidNonWhitelisted: true,
      transform: true, // automatically transforms payloads to be objects typed according to their dto claases
      disableErrorMessages: false,
    }),
  );
  app.enableCors({
    // origin: [`http://10.10.7.79:3000`], // adjust to your frontend origin(s)
    origin: '*', // adjust to your frontend origin(s)
    credentials: true,
  });
  // Read host/IP from config (src/config/app.config.ts -> ip_address)
  const ip_address = appConfig().ip_address;
  const host = ip_address ?? '0.0.0.0';
  const port = Number(process.env.PORT ?? 3050);

  await app.listen(port, host);
}
bootstrap();
