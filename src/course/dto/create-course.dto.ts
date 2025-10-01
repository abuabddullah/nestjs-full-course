import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name must be at least 3 characters long' })
  @MaxLength(100, { message: 'Name must be at most 100 characters long' })
  name: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  @MinLength(10, { message: 'Description must be at least 10 characters long' })
  @MaxLength(1000, {
    message: 'Description must be at most 1000 characters long',
  })
  description: string;

  @IsNotEmpty({ message: 'Level is required' })
  @IsString({ message: 'Level must be a string' })
  @MinLength(3, { message: 'Level must be at least 3 characters long' })
  @MaxLength(50, { message: 'Level must be at most 50 characters long' })
  level: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsNumber()
  @Min(0, { message: 'Price must be at least 0' })
  price: number;
}
