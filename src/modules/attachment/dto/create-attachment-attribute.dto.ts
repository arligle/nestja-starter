// create-attachment-attribute.dto.ts
import {
  IsInt,
  IsString,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { CreateDictAttachmentAttributeDto } from '../../dict/attachment-attribute/dto/create-dict-attachment-attribute.dto';
import { Type } from 'class-transformer';

export class CreateAttachmentAttributeDto {
  @IsOptional()
  @IsInt()
  attachmentId?: number; // 对应Attachment的ID

  @IsOptional()
  @IsInt()
  attributeId?: number; // 对应DictAttachmentAttribute的ID

  @IsString()
  value: string; // 该属性的值

  @IsString()
  @IsOptional()
  desc?: string; // 补充描述

  @Type(() => CreateDictAttachmentAttributeDto)
  @ValidateIf((o) => !o.attributeId)
  @ValidateNested({ each: true })
  @IsOptional()
  dict?: CreateDictAttachmentAttributeDto;
}
