import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CourseTagsService } from './course-tags.service';
import { UpdateCourseTagDto } from './dto/update-dict-course-tag.dto';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';
import { CreateDictCourseTagDto } from './dto/create-dict-course-tag.dto';

@Controller('dict/course-tags')
export class CourseTagsController {
  constructor(private readonly courseTagsService: CourseTagsService) {}

  @Post()
  create(@Body() createCourseTagDto: CreateDictCourseTagDto) {
    return this.courseTagsService.create(createCourseTagDto);
  }

  @Get()
  findAll(
    @Query('page', new CustomParseIntPipe({ optional: true })) page: number,
    @Query('limit', new CustomParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.courseTagsService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseTagsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseTagDto: UpdateCourseTagDto,
  ) {
    return this.courseTagsService.update(+id, updateCourseTagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseTagsService.remove(+id);
  }
}
