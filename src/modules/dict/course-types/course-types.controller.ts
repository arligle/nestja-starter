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
import { CourseTypesService } from './course-types.service';
import { CreateDictCourseTypeDto } from './dto/create-dict-course-type.dto';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';
import { UpdateDictCourseTypeDto } from './dto/update-dict-course-type.dto';

@Controller('dict/course-types')
export class CourseTypesController {
  constructor(private readonly courseTypesService: CourseTypesService) {}

  @Post()
  create(@Body() createCourseTypeDto: CreateDictCourseTypeDto) {
    return this.courseTypesService.create(createCourseTypeDto);
  }

  @Get()
  findAll(
    @Query('page', new CustomParseIntPipe({ optional: true })) page: number,
    @Query('limit', new CustomParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.courseTypesService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseTypesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCourseTypeDto: UpdateDictCourseTypeDto,
  ) {
    return this.courseTypesService.update(+id, updateCourseTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseTypesService.remove(+id);
  }
}
