// import { IsNotEmpty, IsString } from 'class-validator';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { SigninUserDto } from './signin-user.dto';

export class PublicUserDto extends SigninUserDto {
  @Expose()
  id: string;

  @Expose()
  username: string;

  @Exclude()
  password: string;

  @Transform(({ value }) => {
    return value.map((item) => item.roleId);
  })
  @Expose({ name: 'UserRole' })
  roles: any;
}
