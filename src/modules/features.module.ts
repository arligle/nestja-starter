import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { CourseModule } from './course/course.module';
import { ContentModule } from './content/content.module';
import { CommentModule } from './comment/comment.module';
import { AttachmentModule } from './attachment/attachment.module';
import { DictModule } from './dict/dict.module';
import { TransactionModule } from './transaction/transaction.module';
import { StudyModule } from './study/study.module';

@Module({
  imports: [SharedModule, CourseModule, ContentModule, CommentModule, AttachmentModule, DictModule, TransactionModule, StudyModule],
})
export class FeaturesModule {}
