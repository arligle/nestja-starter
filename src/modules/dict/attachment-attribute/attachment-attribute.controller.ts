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
import { AttachmentAttributeService } from './attachment-attribute.service';
import { CreateDictAttachmentAttributeDto } from './dto/create-dict-attachment-attribute.dto';
import { UpdateDictAttachmentAttributeDto } from './dto/update-dict-attachment-attribute.dto';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';

type IAttributesDtoType =
  | CreateDictAttachmentAttributeDto[]
  | CreateDictAttachmentAttributeDto;

@Controller('dict/attachment-attribute')
export class AttachmentAttributeController {
  constructor(
    private readonly attachmentAttributeService: AttachmentAttributeService,
  ) {}

  @Post()
  create(@Body() dto: IAttributesDtoType) {
    if (Array.isArray(dto)) {
      return this.attachmentAttributeService.createMany(dto);
    }
    return this.attachmentAttributeService.create(dto);
  }

  @Get()
  findAll(
    @Query('page', new CustomParseIntPipe({ optional: true })) page: number,
    @Query('limit', new CustomParseIntPipe({ optional: true })) limit: number,
  ) {
    return this.attachmentAttributeService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attachmentAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateDictAttachmentAttributeDto,
  ) {
    return this.attachmentAttributeService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attachmentAttributeService.remove(+id);
  }
}
