// create-course-tag.dto.ts
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateDictCourseTypeDto } from '../../course-types/dto/create-dict-course-type.dto';

export class CreateDictCourseTagDto {
  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.id)
  name: string; // 标签名称

  @IsOptional()
  @IsInt()
  @ValidateIf((o) => !o.id)
  typeId?: number; // 分类ID，对应dict_course_types表

  @IsOptional()
  @IsInt()
  @ValidateIf((o) => !o.id)
  order: number = 1000; // 排序，默认为1000

  @IsOptional()
  @IsInt()
  @ValidateIf((o) => !o.id)
  status: number = 0; // 是否禁用，0-未禁用，1-已禁用，默认为未禁用

  @Type(() => CreateDictCourseTypeDto)
  @IsOptional()
  @ValidateIf((o) => !o.typeId || !o.id)
  @ValidateNested({ each: true })
  type?: CreateDictCourseTypeDto;
}

export class CreateDictCourseTagsDto extends CreateDictCourseTagDto {
  @IsOptional()
  @IsInt()
  id?: number;
}
