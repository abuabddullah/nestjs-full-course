import { Controller, Get, Post } from '@nestjs/common';
import { RiderCoordinatesService } from './rider-coordinates.service';
import { CreateCoordinatesDTO } from './dto/create-coordinates.dto';
import { Body } from '@nestjs/common';

@Controller('rider-coordinates')
export class RiderCoordinatesController {
  constructor(
    private readonly riderCoordinatesService: RiderCoordinatesService,
  ) {}

  @Post()
  async create(@Body() createCoordinatesDto: CreateCoordinatesDTO) {
    return await this.riderCoordinatesService.create(createCoordinatesDto);
  }

  @Get()
  async findAll() {
    return await this.riderCoordinatesService.findAll();
  }
}
