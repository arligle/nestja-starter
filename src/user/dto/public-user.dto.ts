// import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Transform } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

export class PublicUserDto extends CreateUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Transform(({ value }) => {
    return value.map((item) => ({
      id: item.Role.id,
      permissions: item.Role.RolePermissions,
    }));
  })
  @Expose({ name: 'UserRole' })
  roles: any;
}
