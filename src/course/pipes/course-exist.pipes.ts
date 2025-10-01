import {
  ArgumentMetadata,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { CourseService } from 'src/course/course.service';

@Injectable()
export class CourseExistsPipe implements PipeTransform {
  constructor(private readonly courseService: CourseService) {}

  async transform(value: any, metadata: ArgumentMetadata): Promise<any> {
    const course = await this.courseService.findOne(value);
    if (!course) {
      throw new NotFoundException(`Course with ID ${value} not found`);
    }
    return value;
  }
}
