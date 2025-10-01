import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';
import { QueryBuilder } from 'src/utils/query-builder';
import { EnrollDto } from './dto/enroll-course.dto';
import { User } from 'src/user/schemas/user.schema';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    console.log(
      '🚀 ~ CourseService ~ create ~ createCourseDto:',
      createCourseDto,
    );
    try {
      return await this.courseModel.create({
        name: createCourseDto.name,
        description: createCourseDto.description,
        level: createCourseDto.level,
        price: createCourseDto.price,
      });
    } catch (err: unknown) {
      console.log('🚀 ~ CourseService ~ create ~ err:', err);
      const e = err as { code?: number };

      const DUPLICATE_KEY_CODE = 11000;
      if (e.code === DUPLICATE_KEY_CODE) {
        throw new ConflictException('Course name is already taken.');
      }

      throw err;
    }
  }

  async findAll(query: Record<string, any>) {
    const courseQuery = new QueryBuilder(this.courseModel.find(), query)
      .search(['name', 'description', 'level'])
      .filter()
      .sort()
      .paginate()
      .fields();

    const result = await courseQuery.modelQuery;
    const meta = await courseQuery.countTotal();

    return { meta, result };
  }

  async findOne(id: string) {
    return await this.courseModel.findOne({ _id: id });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    return await this.courseModel.findOneAndUpdate(
      { _id: id },
      updateCourseDto,
    );
  }

  async remove(id: string) {
    return await this.courseModel.deleteOne({ _id: id });
  }

  async enroll(courseId: string, enrollDto: EnrollDto, userId: string) {
    return await this.userModel.findOneAndUpdate(
      { _id: userId },
      { $push: { enrolledCourses: courseId } },
      { new: true },
    );
  }
}
