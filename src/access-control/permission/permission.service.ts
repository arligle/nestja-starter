import { Inject, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class PermissionService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  async create(createPermissionDto: CreatePermissionDto) {
    return await this.prismaClient.$transaction(
      async (prisma: PrismaClient) => {
        const { policies, ...restData } = createPermissionDto;

        const permissionPolicy = {
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
        return prisma.permission.create({
          data: {
            ...restData,
            PermissionPolicy: permissionPolicy,
          },
        });
      },
    );
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prismaClient.permission.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.permission.findUnique({ where: { id } });
  }

  findByName(name: string) {
    return this.prismaClient.permission.findUnique({
      where: {
        name,
      },
      include: {
        PermissionPolicy: {
          include: {
            Policy: true,
          },
        },
      },
    });
  }

  update(id: number, updatePermissionDto: UpdatePermissionDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const { policies, ...restData } = updatePermissionDto;

      const updatePermission = await prisma.permission.update({
        where: { id },
        data: {
          ...restData,
          PermissionPolicy: {
            deleteMany: {},
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
          },
        },
        include: {
          PermissionPolicy: {
            include: {
              Policy: true,
            },
          },
        },
      });

      return updatePermission;
    });
  }

  remove(id: number) {
    return this.prismaClient.permission.delete({ where: { id } });
  }
}
