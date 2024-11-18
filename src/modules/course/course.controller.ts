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
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseTagDto } from './dto/create-course-tag.dto';
import { UpdateCourseTagDto } from './dto/update-course-tag.dto';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  @Post('tags')
  createTag(@Body() dto: CreateCourseTagDto) {
    return this.courseService.createTag(dto);
  }

  @Patch('tags')
  updateTag(@Body() dto: UpdateCourseTagDto) {
    return this.courseService.updateTag(dto);
  }

  @Get('tags')
  findAllTag(@Query('courseId', new CustomParseIntPipe()) courseId: number) {
    return this.courseService.findAllTag(courseId);
  }

  @Delete(':courseId/tags')
  deleteTag(
    @Param('courseId') courseId: string,
    @Query('tagId') tagId: string,
  ) {
    return this.courseService.deleteTag(+courseId, +tagId);
  }

  @Post()
  create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  findAll(
    @Query('page', new CustomParseIntPipe({ optional: true })) page: number,
    @Query('limit', new CustomParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.courseService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
