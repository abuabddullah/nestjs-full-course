import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/registerUser.dto';
import { AuthGuard } from './auth.guard';
import { UserService } from 'src/user/user.service';
import { Request as ExpressRequest } from 'express';
import { IJWTPayload } from './auth.interface';
import { sendResponse } from 'src/utils/response.util';

@Controller('auth') // /auth/register
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() registerUserDto: RegisterDto) {
    const token = await this.authService.registerUser(registerUserDto);
    return sendResponse('User registered successfully', token);
  }

  @Post('login')
  async login(@Body() loginUserDto: Partial<RegisterDto>) {
    // todo: implement this ✅ done
    /**
     * 1. Receive email and password
     * 2. Match the email and password
     * 3. Generate JWT token
     */

    const token = await this.authService.loginUser(loginUserDto);
    return sendResponse('User logged in successfully', token);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(
    @Req() req: ExpressRequest & { user: IJWTPayload }, // use @Req()
  ) {
    const userId = req.user.id;

    const user = await this.userService.getUserById(userId);

    return sendResponse('User profile retrieved successfully', user);
  }
}
