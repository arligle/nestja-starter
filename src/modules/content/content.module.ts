import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { AttachmentModule } from '../attachment/attachment.module';

@Module({
  imports: [AttachmentModule],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
