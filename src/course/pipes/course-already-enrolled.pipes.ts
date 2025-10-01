import {
  Injectable,
  PipeTransform,
  Inject,
  Scope,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';

@Injectable({ scope: Scope.REQUEST })
export class CourseAlreadyEnrolledPipe
  implements PipeTransform<string, Promise<string>>
{
  constructor(
    private readonly userService: UserService,
    @Inject(REQUEST) private readonly req: Request & { user: { id: string } },
  ) {}

  async transform(courseId: string): Promise<string> {
    const userId = this.req.user?.id;
    if (!userId) throw new UnauthorizedException();

    const user = await this.userService.getUserById(userId);
    if (!user) throw new NotFoundException(`User with ID ${userId} not found`);

    const courseObjectId = new Types.ObjectId(courseId);
    const alreadyEnrolled = (user.enrolledCourses || []).some((id: any) =>
      new Types.ObjectId(id).equals(courseObjectId),
    );

    if (alreadyEnrolled) {
      throw new ConflictException(
        `Course with ID ${courseId} is already enrolled`,
      );
    }

    return courseId; // keep the original param type for the controller
  }
}
