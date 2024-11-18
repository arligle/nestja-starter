import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('course/:courseId/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  create(
    @Param('courseId', ParseIntPipe) courseId: number,
    @Body() dto: CreateContentDto,
  ) {
    return this.contentService.create(courseId, dto);
  }

  @Get()
  findAll(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.contentService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContentDto: UpdateContentDto) {
    return this.contentService.update(+id, updateContentDto);
  }

  @Delete(':id')
  removeOne(@Param('id') id: string) {
    return this.contentService.removeOne(+id);
  }

  @Delete()
  remove(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.contentService.remove(courseId);
  }
}
