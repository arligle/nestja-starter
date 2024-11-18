import { CreateDictCourseTagsDto } from '@/modules/dict/course-tags/dto/create-dict-course-tag.dto';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateContentTagDto {
  @IsInt()
  contentId: number;

  @IsInt()
  @IsOptional()
  @ValidateIf((o) => !o.tags)
  tagId?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.tagId)
  @Type(() => CreateDictCourseTagsDto)
  @IsArray()
  tags?: CreateDictCourseTagsDto[];
}
