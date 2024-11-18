import { PartialType } from '@nestjs/mapped-types';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UpdateUserDto } from './update-user.dto';
import { IsArray } from 'class-validator';

export class PublicUpdateUserDto extends PartialType(UpdateUserDto) {
  @Exclude()
  password?: string;

  @IsArray()
  @Expose({ name: 'UserRole' })
  @Transform(({ value }) => value.map((item) => item.roleId))
  roleIds: number[];
}
