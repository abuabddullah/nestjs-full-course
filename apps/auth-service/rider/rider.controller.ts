import { Body, Controller, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CreateRiderDTO } from './dto/create-rider.dto';
import { RiderService } from './rider.service';

@Controller('rider')
export class RiderController {
  constructor(private readonly riderService: RiderService) {}

  @Post()
  async createRider(@Body() createRiderDTO: CreateRiderDTO) {
    return this.riderService.createRider(createRiderDTO);
  }

  /* // for http connection ⬇️⬇️⬇️
  @Get(':id')
  async getRiderById(@Param('id') id: string) {
    return this.riderService.getRiderById(id);
  } */

  // for microservice TCP connection ⬇️⬇️⬇️
  @MessagePattern({ cmd: 'get-rider' })
  async getRiderById(data: any) {
    return this.riderService.getRiderById(data.id);
  }
}
