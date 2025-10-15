import { Module } from '@nestjs/common';
import { RiderController } from './rider.controller';
import { RiderService } from './rider.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RiderSchema, Rider } from './schemas/rider.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Rider.name, schema: RiderSchema }]),
  ],
  controllers: [RiderController],
  providers: [RiderService],
})
export class RiderModule {}
