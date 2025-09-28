import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterDto) {
    console.log('registerDto', registerUserDto);

    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);
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
    const payload = { sub: user._id, role: 'admin' };
    const token = await this.jwtService.signAsync(payload);
    console.log(token);
    return { access_token: token };
  }
}
