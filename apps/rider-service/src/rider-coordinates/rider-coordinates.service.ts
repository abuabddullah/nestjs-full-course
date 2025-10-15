import { Injectable } from '@nestjs/common';
import { CreateCoordinatesDTO } from './dto/create-coordinates.dto';

@Injectable()
export class RiderCoordinatesService {
  private riderCoordinates: CreateCoordinatesDTO[] = [];

  async create(createCoordinatesDto: CreateCoordinatesDTO) {
    return this.riderCoordinates.push(createCoordinatesDto);
  }
  async findAll() {
    return this.riderCoordinates;
  }
}
