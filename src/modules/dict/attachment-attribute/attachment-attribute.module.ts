import { Module } from '@nestjs/common';
import { AttachmentAttributeService } from './attachment-attribute.service';
import { AttachmentAttributeController } from './attachment-attribute.controller';

@Module({
  controllers: [AttachmentAttributeController],
  providers: [AttachmentAttributeService],
})
export class AttachmentAttributeModule {}
