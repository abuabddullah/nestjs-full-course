import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/user/user.types';

export class RegisterDto {
  @IsString()
  fname: string;

  @IsString()
  lname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsEnum(Role, { message: 'Invalid role' })
  @IsOptional()
  role?: string;
}
