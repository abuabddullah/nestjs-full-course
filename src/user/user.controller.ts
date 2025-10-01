import { Controller, Get, Param, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { sendResponse } from 'src/utils/response.util';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getAllUsers(@Query() query: Record<string, any>) {
    const result = await this.userService.getAllUsers(query);
    return sendResponse('Users retrieved successfully', result);
  }

  @Get('unpaginated')
  async getAllUsersUnpaginated() {
    const result = await this.userService.getAllUsersUnpaginated();
    return sendResponse('Users retrieved successfully', result);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const result = await this.userService.getUserById(id);
    return sendResponse('User retrieved successfully', result);
  }
}
