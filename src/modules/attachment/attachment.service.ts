import { Inject, Injectable } from '@nestjs/common';
import { CreateAttachmentDto } from './dto/create-attachment.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { Prisma, PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class AttachmentService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  create(createAttachmentDto: CreateAttachmentDto) {
    const { attributes, ...restData } = createAttachmentDto;
    const createArr = [];

    // 如果用户传递了attributes
    // 循环attributes
    if (attributes && attributes instanceof Array && attributes.length > 0) {
      for (const attribute of attributes) {
        const dictObj = {};

        const { dict, ...restAttrData } = attribute;

        // 判断是否有传递dict属性 -> type name 是否存在于dict表中
        let whereCond: any;

        // Attachment -> attributes -> where dict -> 关联
        // Attachment -> attributes -> where dict -> 不存储，创建
        // 如果存在，则并联创建对应的attachmentAttribute
        if (dict) {
          const { id, name, type } = dict;
          if (id) {
            whereCond = {
              id,
            };
          } else {
            whereCond = {
              // 复合字段查询，对应schema中的@unique
              type_name: {
                name,
                type,
              },
            };
          }
          dictObj['DictAttribute'] = {
            connectOrCreate: {
              where: whereCond,
              // 如果不存在，则先创建dict表属性，再创建对应的attachmentAttribute
              create: dict,
            },
          };
        }

        createArr.push({
          ...restAttrData,
          ...dictObj,
        });
      }
    }

    return this.prismaClient.attachment.create({
      data: {
        ...restData,
        AttachmentAttribute: {
          create: createArr,
        },
      } as Prisma.AttachmentUncheckedCreateInput,
      include: {
        AttachmentAttribute: true,
      },
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    return this.prismaClient.attachment.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        AttachmentAttribute: true,
      },
    });
  }

  findOne(id: number) {
    return this.prismaClient.attachment.findUnique({
      where: {
        id,
      },
      include: {
        AttachmentAttribute: {
          include: {
            DictAttribute: true,
          },
        },
      },
    });
  }

  update(id: number, updateAttachmentDto: UpdateAttachmentDto) {
    return this.prismaClient.attachment.update({
      where: {
        id,
      },
      data: updateAttachmentDto,
    });
  }

  remove(id: number) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      // 删除关联关系
      await prisma.attachmentAttribute.deleteMany({
        where: {
          attachmentId: id,
        },
      });
      // 删除附件
      return prisma.attachment.delete({
        where: {
          id,
        },
      });
    });
  }
}
