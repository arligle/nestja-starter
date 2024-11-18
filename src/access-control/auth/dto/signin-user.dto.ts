// import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  // IsNumber,
  IsString,
  Length,
} from 'class-validator';

export class SigninUserDto {
  @IsString()
  @IsNotEmpty()
  @Length(5, 20, {
    message: '用户名长度必须是大于5小于20位的字符',
  })
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 32, {
    message: ({ constraints }) => {
      return `密码长度必须是大于${constraints[0]}小于${constraints[1]}位的字符，不能是特殊字符打头`;
    },
  })
  password: string;
}
