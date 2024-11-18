import { ForbiddenException, Injectable } from '@nestjs/common';
import { UserRepository } from '../../user/user.repository';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}
  async signin(username: string, password: string) {
    const user = await this.userRepository.findOne(username);
    if (!user) {
      throw new ForbiddenException('用户不存在');
    }

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或者密码错误');
    }

    const token = await this.jwt.signAsync({
      username: user.username,
    });

    return {
      access_token: token,
    };
  }

  async signup(username: string, password: string) {
    const user = await this.userRepository.findOne(username);

    if (user) {
      throw new ForbiddenException('用户已存在');
    }
    const res = await this.userRepository.create({ username, password });

    // delete res['password'];

    return res;
  }
}
