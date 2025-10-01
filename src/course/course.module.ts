import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { User, UserSchema } from '../user/schemas/user.schema';
import { UserModule } from '../user/user.module';
import { CourseAlreadyEnrolledPipe } from './pipes/course-already-enrolled.pipes';
import { CourseExistsPipe } from './pipes/course-exist.pipes';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseAlreadyEnrolledPipe, CourseExistsPipe],
})
export class CourseModule {}
