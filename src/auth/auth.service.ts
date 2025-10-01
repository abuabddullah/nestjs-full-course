import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import { JwtService } from '@nestjs/jwt';
import { IJWTPayload } from './auth.interface';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly sharedService: SharedService,
  ) {}

  async registerUser(registerUserDto: RegisterDto) {

    const hash = await this.sharedService.hashPassword(
      registerUserDto.password,
    );
    // Logic for user register
    /**
     * 1. v check if email already exists
     * 2. v hash the password
     * 3. v store the user into db
     * 4. generate jwt token
     * 5. send token in response
     */

    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    // todo: remove role admin from here. only for test.
    const payload: IJWTPayload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    // const token = await this.jwtService.signAsync(payload);
    const token = await this.sharedService.signAccessToken(payload);
    return { accessToken: token };
  }

  async loginUser(loginUserDto: Partial<RegisterDto>) {
    const user = await this.userService.loginUser(loginUserDto);
    // todo: remove role admin from here. only for test.
    const payload: IJWTPayload = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    const token = await this.sharedService.signAccessToken(payload);
    return { accessToken: token };
  }
}
