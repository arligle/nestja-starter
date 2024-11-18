import { UserRepository } from '@/user/user.repository';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: UserRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. 获取请求对象
    const req = context.switchToHttp().getRequest();
    console.log('🚀 ~ AdminGuard ~ req:', req.user);
    if (req.user) {
      const { username } = req.user;
      const user = await this.userService.findOne(username);
      // req -> headers -> jsonwebtoken -> payload
      // 2. 获取请求对象中的用户信 加入逻辑判断 -> 角色判断 -> 权限判断
      console.log('🚀 ~ AdminGuard ~ user:', user);
    }
    return true;
  }
}
