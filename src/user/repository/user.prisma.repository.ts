import { Inject, Injectable } from '@nestjs/common';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { UserAdapter } from '../user.interface';
import { PrismaClient } from 'prisma/clients/postgresql';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

@Injectable()
export class UserPrismaRepository implements UserAdapter {
  constructor(
    @Inject(PRISMA_DATABASE) private prismaClient: PrismaClient,
    private configService: ConfigService,
  ) {}
  findAll(page: number = 1, limit: number = 10): Promise<any[]> {
    const skip = (page - 1) * limit;
    return this.prismaClient.user.findMany({ skip, take: limit });
  }

  findOne(username: string): Promise<any> {
    return this.prismaClient.user.findUnique({
      where: { username },
      include: {
        UserRole: {
          include: {
            Role: {
              include: {
                RolePermissions: true,
              },
            },
          },
        },
      },
    });
  }

  async create(userObj: any): Promise<any> {
    // 读取默认角色信息
    const DEFAULT_ROLE_ID = +this.configService.get('ROLE_ID');
    // 判断角色信息是否在数据库中
    // 写入角色与用户关系表，并创建用户
    return await this.prismaClient.$transaction(
      async (prisma: PrismaClient) => {
        const roleIds =
          userObj && userObj['roleIds'] ? userObj.roleIds : [DEFAULT_ROLE_ID];
        const validRoleIds = [];

        for (const roleId of roleIds) {
          const role = await prisma.role.findUnique({ where: { id: roleId } });
          if (role) {
            validRoleIds.push(roleId);
          }
        }
        if (validRoleIds.length === 0) {
          validRoleIds.push(DEFAULT_ROLE_ID);
        }
        delete userObj['roleIds'];

        return prisma.user.create({
          data: {
            ...userObj,
            UserRole: {
              createMany: {
                data: validRoleIds.map((roleId) => ({ roleId })),
              },
            },
          },
          include: {
            UserRole: true,
          },
        });
      },
    );
  }
  async update(userObj: any): Promise<any> {
    return await this.prismaClient.$transaction(
      async (prisma: PrismaClient) => {
        const { id, username, password, roles, ...rest } = userObj;
        // 更新的where条件
        const whereCond = id ? { id } : { username };
        let updateData: any = {};
        if (password) {
          const newHashPass = await argon2.hash(password);
          updateData.password = newHashPass;
        }
        updateData = { ...updateData, ...rest };

        const roleIds = [];

        // 角色 权限的更新，放置在前
        await Promise.all(
          roles.map(async (role) => {
            roleIds.push(role.id);
            const { permissions, ...restRole } = role;
            await prisma.role.update({
              where: { id: role.id },
              data: {
                ...restRole,
                RolePermissions: {
                  deleteMany: {},
                  create: (permissions || []).map((permission) => ({
                    permission: {
                      connectOrCreate: {
                        where: {
                          name: permission.name,
                        },
                        create: permission,
                      },
                    },
                  })),
                },
              },
            });
          }),
        );

        // 用户 角色更新
        const updatedUser = await prisma.user.update({
          where: whereCond,
          data: {
            ...updateData,
            UserRole: {
              deleteMany: {},
              create: roleIds.map((roleId) => ({ roleId })),
            },
          },
          include: {
            UserRole: true,
          },
        });

        return updatedUser;
      },
    );
  }
  delete(id: string): Promise<any> {
    return this.prismaClient.user.delete({ where: { id: parseInt(id) } });
  }
}
