import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsInt()
  userId: number;

  @IsOptional()
  @IsInt()
  pid?: number;
}

export class CreateCourseCommentDto extends CreateCommentDto {
  @IsInt()
  courseId: number;

  @IsOptional()
  @IsArray()
  @Type(() => CreateCommentDto)
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.content)
  comments: CreateCommentDto[];
}

export class CreateContentCommentDto extends CreateCommentDto {
  @IsInt()
  contentId: number;

  @IsOptional()
  @IsArray()
  @Type(() => CreateCommentDto)
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.content)
  comments: CreateCommentDto[];
}

// 扩展上面的CreateCourseCommentDto和CreateContentCommentDto
export class MixedCreateCommentDto extends CreateCommentDto {
  @IsInt()
  @ValidateIf((o) => !o.contentId)
  courseId?: number;

  @IsInt()
  @ValidateIf((o) => !o.courseId)
  contentId?: number;

  @IsOptional()
  @IsArray()
  @Type(() => CreateCommentDto)
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.content)
  comments: CreateCommentDto[];
}
