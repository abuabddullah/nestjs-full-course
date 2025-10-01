import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query as NestQuery,
  Req,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/user/user.types';
import { RolesGuard } from 'src/auth/roles.guard';
import { sendResponse } from 'src/utils/response.util';
import { EnrollDto } from './dto/enroll-course.dto';
import { CourseExistsPipe } from './pipes/course-exist.pipes';
import { IJWTPayload } from 'src/auth/auth.interface';
import { Request as ExpressRequest } from 'express';
import { CourseAlreadyEnrolledPipe } from './pipes/course-already-enrolled.pipes';

@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  async create(@Body() createCourseDto: CreateCourseDto) {
    const result = await this.courseService.create(createCourseDto);
    return sendResponse('Course created successfully', result);
  }

  @Get()
  async findAll(@NestQuery() query: Record<string, any>) {
    const result = await this.courseService.findAll(query);
    return sendResponse('Courses retrieved successfully', result);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.courseService.findOne(id);
    return sendResponse('Course retrieved successfully', result);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const result = await this.courseService.update(id, updateCourseDto);
    return sendResponse('Course updated successfully', result);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const result = await this.courseService.remove(id);
    return sendResponse('Course deleted successfully', result);
  }

  // use CourseExistsPipe
  @Post('enroll/:courseId')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Student)
  async enroll(
    @Param('courseId', CourseExistsPipe, CourseAlreadyEnrolledPipe)
    courseId: string,
    @Body() enrollDto: EnrollDto,
    @Req() req: ExpressRequest & { user: IJWTPayload }, // use @Req()
  ) {
    const userId = req.user.id;
    const result = await this.courseService.enroll(courseId, enrollDto, userId);
    return sendResponse('Course enrolled successfully', result);
  }
}
