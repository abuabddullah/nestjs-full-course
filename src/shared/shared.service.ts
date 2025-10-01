import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import appConfig from 'src/config/app.config';

@Injectable()
export class SharedService {
  constructor(private readonly jwtService: JwtService) {}

  async signAccessToken(
    payload: Record<string, any>,
    options?: JwtSignOptions,
  ): Promise<string> {
    return this.jwtService.signAsync(payload, options);
  }

  async verifyToken<T extends object = any>(token: string): Promise<T> {
    return this.jwtService.verifyAsync<T>(token);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, appConfig().bcryptSaltRounds);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
