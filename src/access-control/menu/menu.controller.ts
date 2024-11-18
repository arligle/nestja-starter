import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { CustomParseIntPipe } from '@/common/pipes/custom-parse-int.pipe';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  create(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.create(createMenuDto);
  }

  @Get()
  findAll(
    @Query('page', new CustomParseIntPipe({ optional: true })) page: number,
    @Query('limit', new CustomParseIntPipe({ optional: true })) limit: number,
    @Query('args')
    args: any,
  ) {
    let parsedArgs;
    if (args) {
      try {
        parsedArgs = JSON.parse(args);
      } catch (error) {
        throw new BadRequestException('args: 无效的JSON数据格式');
      }
    }
    return this.menuService.findAll(page, limit, parsedArgs);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.menuService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.update(+id, updateMenuDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.menuService.remove(+id);
  }
}
