import { PartialType } from '@nestjs/mapped-types';
import { CreateDictAttachmentAttributeDto } from './create-dict-attachment-attribute.dto';

export class UpdateDictAttachmentAttributeDto extends PartialType(
  CreateDictAttachmentAttributeDto,
) {}
