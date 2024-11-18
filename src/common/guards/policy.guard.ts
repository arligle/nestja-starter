import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import {
  CaslAbilityService,
  IPolicy,
} from '@/access-control/policy/casl-ability.service';
import { PERMISSION_KEY } from '../decorators/role-permission.decorator';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { PermissionService } from '../../access-control/permission/permission.service';
import { UserRepository } from '../../user/user.repository';
import { RoleService } from '../../access-control/role/role.service';
import { SharedService } from '../../modules/shared/shared.service';
import { User } from '@/user/user.entity';
import { plainToInstance } from 'class-transformer';

const mapSubjectToClass = (subject: string) => {
  switch (subject.toLowerCase()) {
    case 'user':
      return User;
    default:
      return subject;
  }
};

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private caslAbilityService: CaslAbilityService,
    private reflector: Reflector,
    private configService: ConfigService,
    private permissionService: PermissionService,
    private userRepository: UserRepository,
    private roleService: RoleService,
    private sharedService: SharedService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 通过caslAbilityService获取用户已有权限的实例
    // 通过ability实例上的can cannot来判断用户是 否有对应的权限
    // 接口权限 -> Polity进行关联 读取数据库中的接口关联的Policy与上面的ability之间进行逻辑判断，从而对数据库实现数据权限控制
    const classPermission = this.reflector.get(
      PERMISSION_KEY,
      context.getClass(),
    );
    const handlerPermission = this.reflector.get(
      PERMISSION_KEY,
      context.getHandler(),
    );
    const cls =
      classPermission instanceof Array
        ? classPermission.join('')
        : classPermission;
    const handler =
      handlerPermission instanceof Array
        ? handlerPermission.join('')
        : handlerPermission;
    // 1. Guard -> 装饰器handler&class permission name
    const right = `${cls}:${handler}`;
    const req = context.switchToHttp().getRequest();
    const { username } = req.user;
    if (!username) {
      return false;
    }

    // 2. permission -> Policy 需要访问接口的数据权限
    const permissionPolicy = await this.permissionService.findByName(right);

    // 3. Policy -> subjects -> 缩小RolePolicy的查询范围
    const subjects = permissionPolicy.PermissionPolicy.map((policy) => {
      return policy.Policy.subject;
    });
    // 4. username -> User -> Role -> Policy & subjects 用户已分配接口权限
    const user = await this.userRepository.findOne(username);
    const roleIds = user.UserRole.map((role) => role.roleId);
    // 判断是否是白名单
    // 如果是whitelist中的用户对应的roleId，直接返回true
    const whitelist = this.configService.get('ROLE_ID_WHITELIST');
    if (whitelist) {
      const whitelistArr = whitelist.split(',');
      // 判断whitelistArr中包含roleIds中的数据，则返回true
      if (whitelistArr.some((o) => roleIds.includes(+o))) {
        return true;
      }
    }

    const rolePolicy = await this.roleService.findAllByIds(roleIds);

    const rolePolicyFilterBySubjects = rolePolicy.reduce((acc, cur) => {
      const rolePolicy = cur.RolePolicy.filter((policy) => {
        return subjects.includes(policy.Policy.subject);
      });
      acc.push(...rolePolicy);
      return acc;
    }, []);

    const policies: IPolicy[] = rolePolicyFilterBySubjects.map((o) => o.Policy);
    user.RolePolicy = rolePolicy;
    delete user.password;
    user.policies = policies;
    user.roleIds = roleIds;
    user.permissions = user.UserRole.reduce((acc, cur) => {
      return [...acc, ...cur.Role.RolePermissions];
    }, []);
    const abilities = await this.caslAbilityService.buildAbility(policies, [
      user,
      req,
      this.reflector,
    ]);

    if (policies.length === 0) {
      // 接口不需要任何数据权限控制
      return true;
    }

    let allPermissionsGranted = true;
    const tempPermissionsPolicy = [...permissionPolicy.PermissionPolicy];

    for (const policy of tempPermissionsPolicy) {
      const { action, subject, fields } = policy.Policy;

      let permissionGranted = false;

      for (const ability of abilities) {
        // map -> {string->subject: function(user)}
        const data = await this.sharedService.getSubject(subject, user);
        const subjectTemp = mapSubjectToClass(subject);
        const subjectObj =
          typeof subjectTemp === 'string'
            ? subjectTemp
            : plainToInstance(subjectTemp, data);

        if (fields) {
          if (fields instanceof Array && fields.length > 0) {
            permissionGranted = fields.every((field) =>
              ability.can(action, subjectObj, field + ''),
            );
          } else if (fields['data']) {
            permissionGranted = fields['data'].every((field) =>
              ability.can(action, subjectObj, field + ''),
            );
          }
        } else {
          permissionGranted = ability.can(action, subjectObj);
        }

        if (permissionGranted) {
          break;
        }
      }

      if (permissionGranted) {
        const index = tempPermissionsPolicy.indexOf(policy);
        if (index > -1) {
          tempPermissionsPolicy.splice(index, 1);
        }
      }
    }

    if (tempPermissionsPolicy.length !== 0) {
      allPermissionsGranted = false;
    }

    // console.log('🚀 ~ PolicyGuard ~ canActivate ~ flag:', flag);
    return allPermissionsGranted;
  }
}
