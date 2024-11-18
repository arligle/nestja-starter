import { PartialType } from '@nestjs/mapped-types';
import { CreateDictCourseTypeDto } from './create-dict-course-type.dto';

export class UpdateDictCourseTypeDto extends PartialType(
  CreateDictCourseTypeDto,
) {}
