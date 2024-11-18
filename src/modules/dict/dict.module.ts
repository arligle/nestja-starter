import { Module } from '@nestjs/common';
import { CourseTypesModule } from './course-types/course-types.module';
import { CourseTagsModule } from './course-tags/course-tags.module';
import { AttachmentAttributeModule } from './attachment-attribute/attachment-attribute.module';

@Module({
  imports: [CourseTypesModule, CourseTagsModule, AttachmentAttributeModule],
  controllers: [],
  providers: [],
})
export class DictModule {}
