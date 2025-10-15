import { Injectable } from '@nestjs/common';
import { CreateRiderDTO } from './dto/create-rider.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Rider } from './schemas/rider.schema';
import { Model } from 'mongoose';

@Injectable()
export class RiderService {
  constructor(
    @InjectModel(Rider.name)
    private readonly riderModel: Model<Rider>,
  ) {}

  async getRiderById(id: string) {
    return await this.riderModel.findById(id);
  }
  async createRider(createRiderDTO: CreateRiderDTO) {
    return await this.riderModel.create(createRiderDTO);
  }
}
