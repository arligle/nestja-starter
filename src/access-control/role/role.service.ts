import { Inject, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class RoleService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  async create(createRoleDto: CreateRoleDto) {
    return await this.prismaClient.$transaction(
      async (prisma: PrismaClient) => {
        const { permissions, policies, menus, ...restData } = createRoleDto;

        const rolePermissions = {
          create: (permissions || []).map((permission) => ({
            Permission: {
              connectOrCreate: {
                where: {
                  name: permission.name,
                },
                create: {
                  ...permission,
                },
              },
            },
          })),
        };

        const roleMenus = {
          create: (menus || []).map((menu) => {
            const whereCond = menu?.id ? { id: menu.id } : { name: menu.name };
            return {
              Menu: {
                connect: {
                  ...whereCond,
                },
              },
            };
          }),
        };

        const rolePolicies = {
          create: (policies || []).map((policy) => {
            let whereCond;
            if (policy.id) {
              whereCond = { id: policy.id };
            } else {
              const encode = Buffer.from(JSON.stringify(policy)).toString(
                'base64',
              );
              whereCond = { encode };
              policy.encode = encode;
            }
            return {
              Policy: {
                connectOrCreate: {
                  where: whereCond,
                  create: {
                    ...policy,
                  },
                },
              },
            };
          }),
        };

        return prisma.role.create({
          data: {
            ...restData,
            RolePermissions: rolePermissions,
            RolePolicy: rolePolicies,
            RoleMenu: roleMenus,
          },
        });
      },
    );
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prismaClient.role.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.role.findUnique({
      where: { id },
      include: {
        RolePermissions: {
          include: {
            Permission: true,
          },
        },
      },
    });
  }

  findAllByIds(ids: number[]) {
    return this.prismaClient.role.findMany({
      where: {
        id: {
          in: ids,
        },
      },
      include: {
        RolePermissions: {
          include: {
            Permission: true,
          },
        },
        RolePolicy: {
          include: {
            Policy: true,
          },
        },
      },
    });
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { permissions, policies, menus, ...restData } = updateRoleDto;

      const data: any = {};

      if (policies && policies.length > 0) {
        const createArr = [];
        for (const policy of policies) {
          let whereCond;
          let data = policy;
          if (policy.id) {
            whereCond = { id: policy.id };
            const policyData = await this.prismaClient.policy.findUnique({
              where: { id: policy.id },
            });
            data = policyData;
          } else {
            const encode = Buffer.from(JSON.stringify(policy)).toString(
              'base64',
            );
            whereCond = { encode };
            policy.encode = encode;
          }
          createArr.push({
            Policy: {
              connectOrCreate: {
                where: whereCond,
                create: {
                  ...data,
                },
              },
            },
          });
        }

        // role Policies更新
        const rolePolicies = {
          deleteMany: {},
          create: createArr,
        };

        data.RolePolicy = rolePolicies;
      }

      // 判断一下是否有传rolePermissions
      if (permissions) {
        const rolePermissions = {
          deleteMany: {},
          create: (permissions || []).map((permission) => ({
            Permission: {
              connectOrCreate: {
                where: {
                  name: permission.name,
                },
                create: {
                  ...permission,
                },
              },
            },
          })),
        };
        data.RolePermissions = rolePermissions;
      }

      if (menus) {
        const roleMenus = {
          deleteMany: {},
          create: (menus || []).map((menu) => {
            const whereCond = menu?.id ? { id: menu.id } : { name: menu.name };
            return {
              Menu: {
                connect: {
                  ...whereCond,
                },
              },
            };
          }),
        };

        data.RoleMenu = roleMenus;
      }

      const updateRole = await prisma.role.update({
        where: { id },
        data: {
          ...restData,
          ...data,
        },
        include: {
          RolePermissions: {
            include: {
              Permission: true,
            },
          },
          RolePolicy: {
            include: {
              Policy: true,
            },
          },
          RoleMenu: {
            include: {
              Menu: true,
            },
          },
        },
      });

      return updateRole;
    });
  }

  remove(id: number) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      // 删除Role相关的关联表的数据
      await prisma.role.update({
        where: { id },
        data: {
          RolePermissions: {
            deleteMany: {},
          },
          RolePolicy: {
            deleteMany: {},
          },
          RoleMenu: {
            deleteMany: {},
          },
        },
      });
      // 删除Role
      return prisma.role.delete({ where: { id } });
    });
  }
}
