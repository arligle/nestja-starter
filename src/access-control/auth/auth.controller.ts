import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { PublicUserDto } from './dto/public-user.dto';
import { Serialize } from '@/common/decorators/serialize.decorator';
// import { SerializeInterceptor } from '@/common/interceptors/serialize.interceptor';

@Controller('auth')
// @UseInterceptors(SerializeInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: SigninUserDto) {
    console.log('🚀 ~ AuthController ~ signin ~ dto:', dto);
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  // @UseInterceptors(ClassSerializerInterceptor)
  @Serialize(PublicUserDto)
  async signup(
    @Body(CreateUserPipe) dto: SigninUserDto,
  ): Promise<PublicUserDto> {
    // console.log('🚀 ~ AuthController ~ signup ~ dto:', dto);
    const { username, password } = dto;
    const user = await this.authService.signup(username, password);
    // return new PublicUserDto({ ...user });
    // user.test = {
    //   roles: [1, 2, 3],
    //   date: '2024-01-01',
    // };
    return user;
    // return dto;
  }
}
