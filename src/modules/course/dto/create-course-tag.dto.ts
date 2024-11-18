import { CreateDictCourseTagsDto } from '@/modules/dict/course-tags/dto/create-dict-course-tag.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateCourseTagDto {
  @IsInt()
  courseId: number;

  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.tags)
  tagId?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.tagId)
  @Type(() => CreateDictCourseTagsDto)
  @IsArray()
  tags: CreateDictCourseTagsDto[]; // 1.标签不存在(id 或者 name来判断, type) 2.标签已存在
}
