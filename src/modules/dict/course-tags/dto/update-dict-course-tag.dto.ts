import { PartialType } from '@nestjs/mapped-types';
import { CreateDictCourseTagDto } from './create-dict-course-tag.dto';

export class UpdateCourseTagDto extends PartialType(CreateDictCourseTagDto) {}
