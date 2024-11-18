// create-dict-attachment-attribute.dto.ts
import { AttachmentType } from '@/common/enum/module.enum';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateDictAttachmentAttributeDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.id)
  type: AttachmentType; // 资源分类，如音频、视频等

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => !o.id)
  name: string; // 属性名称，如"长度"、"比特率"等

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  desc: string; // 属性的补充描述
}
