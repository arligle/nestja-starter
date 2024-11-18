import { PartialType } from '@nestjs/mapped-types';
import { CreateAttachmentDto } from './create-attachment.dto';
import { Expose, Transform } from 'class-transformer';

export class PublicAttachmentDto extends PartialType(CreateAttachmentDto) {
  @Expose({ name: 'AttachmentAttribute' })
  @Transform(({ value }) =>
    value?.map((o) => ({
      id: o.attributeId,
      value: o.value,
      desc: o.desc,
      dict: o.DictAttribute,
    })),
  )
  attributes: any[];
}
