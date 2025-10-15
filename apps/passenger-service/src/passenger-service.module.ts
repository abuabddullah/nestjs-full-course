import { Module } from '@nestjs/common';
import { PassengerServiceController } from './passenger-service.controller';
import { PassengerServiceService } from './passenger-service.service';
import appConfig from '../../../config/app.config';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(appConfig().passengerService.mongoUri),
  ],
  controllers: [PassengerServiceController],
  providers: [PassengerServiceService],
})
export class PassengerServiceModule {}
