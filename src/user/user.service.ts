import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { QueryBuilder } from 'src/utils/query-builder';
import { SharedService } from 'src/shared/shared.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly sharedService: SharedService,
  ) {}

  async createUser(registerUserDto: RegisterDto) {
    try {
      return await this.userModel.create({
        fname: registerUserDto.fname,
        lname: registerUserDto.lname,
        email: registerUserDto.email,
        password: registerUserDto.password,
      });
    } catch (err: unknown) {
      const e = err as { code?: number };

      const DUPLICATE_KEY_CODE = 11000;
      if (e.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException('Email is already taken.');
      }

      throw err;
    }
  }

  async loginUser(loginUserDto: Partial<RegisterDto>) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const isMatch = await this.sharedService.comparePassword(
      loginUserDto.password!,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getAllUsers(query: Record<string, any>) {
    const userQuery = new QueryBuilder(this.userModel.find(), query)
      .search(['fname', 'lname', 'email'])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await userQuery.modelQuery;
    const meta = await userQuery.countTotal();

    return { meta, result };
  }

  async getAllUsersUnpaginated() {
    return this.userModel.find().exec();
  }

  async getUserById(id: string) {
    return await this.userModel
      .findOne({ _id: id })
      .populate('enrolledCourses');
  }
}
