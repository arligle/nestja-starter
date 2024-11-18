import { PartialType } from '@nestjs/mapped-types';
import { CreateMenuDto } from './create-menu.dto';
import { IsInt } from 'class-validator';

export class UpdateMenuDto extends PartialType(CreateMenuDto) {
  @IsInt()
  id: number;
}
