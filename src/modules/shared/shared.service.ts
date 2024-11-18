import { HttpException, Inject, Injectable } from '@nestjs/common';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';
import { CreateDictCourseTagsDto } from '../dict/course-tags/dto/create-dict-course-tag.dto';

interface CreateTagDto {
  linkedId: number;
  tagId?: number;
  tags?: CreateDictCourseTagsDto[];
}

@Injectable()
export class SharedService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}

  getSubject(subject: string, user: any, args?: any) {
    return this.prismaClient[subject.toLowerCase()].findUnique({
      where: { id: user.id },
      ...(args || {}),
    });
  }

  // 课程与内容部分创建标签的逻辑
  async createTagGeneric(
    dto: CreateTagDto,
    prismaInstance: PrismaClient,
    model: string,
    connectField: string,
  ) {
    if (!['contentTag', 'courseTag'].includes(model)) {
      throw new HttpException('参数错误', 400);
    }

    const { tags, tagId, linkedId } = dto;

    if (tagId) {
      return (prismaInstance || this.prismaClient)[model].create({
        data: {
          tagId,
          [connectField]: linkedId,
        },
      });
    } else if (tags && tags instanceof Array && tags.length) {
      return (prismaInstance || this.prismaClient).$transaction(
        async (prisma: PrismaClient) => {
          const tagIds = tags.filter((o) => o.id).map((o) => o.id);
          let withoutIdTags = tags.filter((o) => !o.id);

          const withoutIdTagNames = withoutIdTags.map((o) => o.name);
          const existTags = await prisma.dictCourseTag.findMany({
            where: {
              name: {
                in: withoutIdTagNames,
              },
            },
          });

          if (existTags && existTags.length) {
            tagIds.push(...existTags.map((o) => o.id));
            const tagsArr = withoutIdTags.filter(
              (o) => !existTags.find((e) => e.name === o.name),
            );
            withoutIdTags = tagsArr;
          }

          const res: any = {};

          if (tagIds.length > 0) {
            res['exist'] = await prisma[model].createMany({
              data: tagIds.map((o) => ({
                tagId: o,
                [connectField]: linkedId,
              })),
            });
          }

          if (withoutIdTags.length > 0) {
            const newTags = await Promise.all(
              withoutIdTags.map((tag) => {
                const { type, ...restTagData } = tag;
                let tagType = {};
                if (type) {
                  tagType = {
                    CourseType: {
                      connectOrCreate: {
                        where: { name: type.name },
                        create: { ...type },
                      },
                    },
                  };
                }

                return prisma.dictCourseTag.create({
                  data: {
                    ...restTagData,
                    ...tagType,
                  },
                });
              }),
            );

            res['create'] = await prisma[model].createMany({
              data: newTags.map((o) => ({
                tagId: o.id,
                [connectField]: linkedId,
              })),
            });
          }
          return res;
        },
      );
    }
  }

  deleteTagGeneric(
    linkedId: number,
    tagId: number,
    prismaInstance: PrismaClient,
    model: string,
    connectField: string,
  ) {
    // TODO 加入model条件判断
    if (tagId) {
      return prismaInstance[model].delete({
        where: {
          [`${connectField}_tagId`]: {
            // 假设联合主键命名约定为 `XXX_tagId`
            [connectField]: linkedId,
            tagId: tagId,
          },
        },
      });
    } else {
      return prismaInstance[model].deleteMany({
        where: {
          [connectField]: linkedId,
        },
      });
    }
  }
}
