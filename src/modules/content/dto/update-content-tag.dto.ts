import { PartialType } from '@nestjs/mapped-types';
import { CreateContentTagDto } from './create-content-tag.dto';

export class UpdateContentTagDto extends PartialType(CreateContentTagDto) {}
