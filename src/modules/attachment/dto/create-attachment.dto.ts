import { AttachmentType, OssType } from '@/common/enum/module.enum';
import { CreateAttachmentAttributeDto } from '@/modules/attachment/dto/create-attachment-attribute.dto';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsOptional,
  IsString,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';

export class CreateAttachmentDto {
  @IsEnum(AttachmentType)
  @IsOptional()
  type?: AttachmentType; // 分类，例如：text, image, audio, video

  @IsString()
  @IsOptional()
  location?: string; // 存储路径

  @IsString()
  @IsOptional()
  name?: string; // 资源名称

  @IsString()
  @IsOptional()
  ossType?: OssType; // OSS类型

  @IsInt()
  @IsNotEmpty()
  userId: number; // 作者ID

  @IsInt()
  @IsOptional()
  status: number = 0; // 是否禁用，默认未禁用

  @IsString()
  @IsOptional()
  desc?: string; // 补充描述

  @Type(() => CreateAttachmentAttributeDto)
  @ValidateNested({ each: true })
  @IsOptional()
  attributes: CreateAttachmentAttributeDto[];
}
