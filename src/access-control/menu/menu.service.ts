import { Inject, Injectable } from '@nestjs/common';
import { CreateMenuDto, Meta } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class MenuService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}

  async createNested(
    dto: CreateMenuDto,
    prismaClient: PrismaClient,
    parentId?: number,
  ) {
    const { meta, children, ...restData } = dto;
    const parent = await prismaClient.menu.create({
      data: {
        parentId,
        ...restData,
        Meta: {
          create: meta,
        },
      },
    });

    if (children && children.length) {
      const childData = await Promise.all(
        children.map((child) =>
          this.createNested(child, prismaClient, parent.id),
        ),
      );
      // TODO find->include
      parent['children'] = childData;
    }

    return parent;
  }
  async create(createMenuDto: CreateMenuDto) {
    const data = await this.createNested(createMenuDto, this.prismaClient);
    // tenantId -> menu -> 前端Menu不多 -> 一次性查询所有的menu
    return this.prismaClient.menu.findUnique({
      where: {
        id: data.id,
      },
      include: {
        Meta: true,
        children: {
          include: {
            Meta: true,
            children: true,
          },
        },
      },
    });
  }

  findAll(page: number = 1, limit: number = 10, args?: any) {
    const skip = (page - 1) * limit;

    let pagination: any = {
      skip,
      take: limit,
    };
    if (limit === -1) {
      pagination = {};
    }

    const includeArg = {
      Meta: true,
      children: {
        include: {
          Meta: true,
          children: true,
        },
      },
      ...(args || {}),
    };
    return this.prismaClient.menu.findMany({
      ...pagination,
      include: includeArg,
    });
  }

  findOne(id: number) {
    return this.prismaClient.menu.findUnique({
      where: {
        id: id,
      },
      include: {
        Meta: true,
        children: {
          include: {
            Meta: true,
            children: true,
          },
        },
      },
    });
  }

  async update(id: number, updateMenuDto: UpdateMenuDto) {
    // menu -> children
    const { children, meta, ...restData } = updateMenuDto;
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      await prisma.menu.update({
        where: {
          id: id,
        },
        data: {
          ...restData,
          Meta: {
            update: meta,
          },
        },
      });

      // 判断是否传入的数据有children
      if (children && children.length > 0) {
        // 可能有新增，可能有删除
        const menuIds = (await this.collectMenuIds(id)).filter((o) => o !== id);

        await prisma.meta.deleteMany({
          where: {
            menuId: {
              in: menuIds,
            },
          },
        });

        await prisma.menu.deleteMany({
          where: {
            id: {
              in: menuIds,
            },
          },
        });
        await Promise.all(
          children.map((child) => {
            return this.createNested(child, prisma, id);
          }),
        );
      }

      return prisma.menu.findUnique({
        where: {
          id: id,
        },
        include: {
          Meta: true,
          children: {
            include: {
              Meta: true,
              children: true,
            },
          },
        },
      });
    });
  }

  async collectMenuIds(id) {
    const idsToDelete = [];
    idsToDelete.push(id);
    const menu = await this.prismaClient.menu.findUnique({
      where: {
        id: id,
      },
      include: {
        children: true,
      },
    });

    if (menu.children) {
      const childMenuIds = await Promise.all(
        menu.children.map((child) => this.collectMenuIds(child.id)),
      );

      for (const childIds of childMenuIds) {
        idsToDelete.push(...childIds);
      }
    }

    return idsToDelete;
  }

  async remove(id: number) {
    const idsToDelete = await this.collectMenuIds(id);

    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      // 删除关联表Meta数据
      await prisma.meta.deleteMany({
        where: {
          menuId: {
            in: idsToDelete,
          },
        },
      });
      // 删除Menu中的children数据
      const res = await prisma.menu.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
      return res;
    });
  }
}
