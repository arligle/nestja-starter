// create-course-type.dto.ts
import { IsNotEmpty, IsString, IsInt, IsOptional } from 'class-validator';

export class CreateDictCourseTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string; // 分类名称

  @IsOptional()
  @IsInt()
  order: number = 100; // 排序，默认为100

  @IsOptional()
  @IsInt()
  status: number = 0; // 是否禁用，0-未禁用，1-已禁用，默认为未禁用
}
