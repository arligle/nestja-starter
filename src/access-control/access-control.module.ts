import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { PermissionModule } from './permission/permission.module';
import { PolicyModule } from './policy/policy.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [AuthModule, RoleModule, PermissionModule, PolicyModule, MenuModule],
})
export class AccessControlModule {}
