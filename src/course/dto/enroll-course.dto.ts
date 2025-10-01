import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class EnrollDto {
  @IsNotEmpty({ message: 'message is required' })
  @IsString({ message: 'message must be a string' })
  @MinLength(10, { message: 'message must be at least 10 characters' })
  @MaxLength(255, { message: 'message must be at most 255 characters' })
  message: string;
}
