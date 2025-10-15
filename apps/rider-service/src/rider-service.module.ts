import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import appConfig from '../../../config/app.config';
import { RiderServiceController } from './rider-service.controller';
import { RiderServiceService } from './rider-service.service';
import { RiderCoordinatesModule } from './rider-coordinates/rider-coordinates.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(appConfig().riderService.mongoUri),
    RiderCoordinatesModule,
  ],
  controllers: [RiderServiceController],
  providers: [RiderServiceService],
})
export class RiderServiceModule {}
