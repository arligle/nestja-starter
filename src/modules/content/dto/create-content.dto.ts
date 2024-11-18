// create-content.dto.ts
import { AttachmentType } from '@/common/enum/module.enum';
import { CreateAttachmentDto } from '@/modules/attachment/dto/create-attachment.dto';
import { CreateDictCourseTagsDto } from '@/modules/dict/course-tags/dto/create-dict-course-tag.dto';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateContentDto {
  @IsOptional()
  @IsInt()
  courseId?: number; // 对应的课程ID

  @IsNotEmpty()
  @IsString()
  title: string; // 标题

  @IsOptional()
  @IsString()
  type?: AttachmentType; // 内容类型，如'text', 'video', 'link', 'audio'

  @IsOptional()
  @IsInt()
  order: number = 1000; // 在课程中的顺序

  @IsOptional()
  @IsInt()
  pid?: number; // 上级内容ID，用于表示内容的层级结构

  @IsOptional()
  @IsInt()
  status: number = 1; // 是否开放，1-已开放，0-未开放，默认为开放

  @IsNotEmpty()
  @IsInt()
  authorId: number; // 作者ID

  @IsOptional()
  @IsArray()
  @Type(() => CreateDictCourseTagsDto)
  @ValidateNested({ each: true })
  tags?: CreateDictCourseTagsDto[]; // 标签ID数组，用于关联课程内容的标签

  @IsOptional()
  @IsArray()
  @Type(() => CreateAttachmentDto)
  @ValidateNested({ each: true })
  attachments?: CreateAttachmentDto[];
}
