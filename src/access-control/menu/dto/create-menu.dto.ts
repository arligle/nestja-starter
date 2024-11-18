import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class Meta {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  layout?: string;

  @IsOptional()
  @IsInt()
  order?: number;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsBoolean()
  hideMenu?: boolean;

  @IsOptional()
  @IsBoolean()
  disabled?: boolean;
}

export class CreateMenuDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @ValidateIf((o) => !o.id)
  name: string;

  @IsString()
  @ValidateIf((o) => !o.id)
  path: string;

  @IsString()
  @IsOptional()
  @ValidateIf((o) => !o.id)
  component: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  redirect: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  fullPath: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  alias: string;

  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.id)
  label: string;

  @IsOptional()
  @Type(() => Meta)
  @ValidateNested({ each: true })
  @ValidateIf((o) => !o.id)
  meta: Meta;

  @IsOptional()
  @Type(() => CreateMenuDto)
  @ValidateIf((o) => !o.id)
  children: CreateMenuDto[];
}
