import { Inject, Injectable } from '@nestjs/common';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';
import { CreateContentTagDto } from './dto/create-content-tag.dto';
import { UpdateContentTagDto } from './dto/update-content-tag.dto';
import { AttachmentService } from '../attachment/attachment.service';

@Injectable()
export class ContentService {
  constructor(
    @Inject(PRISMA_DATABASE) private prismaClient: PrismaClient,
    private attachmentService: AttachmentService,
  ) {}
  createTag(dto: CreateContentTagDto, prismaInstance?: PrismaClient) {
    const { contentId, tags, tagId } = dto;

    if (tagId) {
      return (prismaInstance || this.prismaClient).contentTag.create({
        data: {
          tagId,
          contentId,
        },
      });
    } else if (tags && tags instanceof Array && tags.length) {
      // 事务处理tags的存入
      return (prismaInstance || this.prismaClient).$transaction(
        async (prisma: PrismaClient) => {
          // tags: [{id: 1}, {id: 2}] -> 已知tagId，批量设置course关联表
          const tagIds = tags.filter((o) => o.id).map((o) => o.id);
          let withoutIdTags = tags.filter((o) => !o.id);

          // tags: [{name: 'xxx'}, {name: 'xxx1'}]
          const withoutIdTagNames = withoutIdTags.map((o) => o.name);
          const existTags = await prisma.dictCourseTag.findMany({
            where: {
              name: {
                in: withoutIdTagNames,
              },
            },
          });

          if (existTags && existTags.length) {
            // 往已知id的数据推送查询出来同name的tagId数据
            tagIds.push(...existTags.map((o) => o.id));

            // 有设置了name，但是没有设置id的情况
            const tagsArr = withoutIdTags.filter(
              (o) => !existTags.find((e) => e.name === o.name),
            );
            // 重新设置需要新增的tag数据
            withoutIdTags = tagsArr;
          }
          const res: any = {};

          if (tagIds.length > 0) {
            // 直接批量创建已知tagId与courseId的情况
            res['exist'] = await prisma.contentTag.createMany({
              data: tagIds.map((o) => ({
                tagId: o,
                contentId,
              })),
            });
          }

          if (withoutIdTags.length > 0) {
            // 需要创建的情况 -> dictType
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

            res['create'] = await prisma.contentTag.createMany({
              data: newTags.map((o) => ({
                tagId: o.id,
                contentId,
              })),
            });
          }

          return res;
        },
      );
    }
  }

  updateTag(dto: UpdateContentTagDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      await prisma.contentTag.deleteMany({
        where: {
          contentId: dto.contentId,
        },
      });
      return this.createTag(dto as CreateContentTagDto, prisma);
    });
  }

  create(courseId: number, createContentDto: CreateContentDto) {
    const { attachments, tags, ...restData } = createContentDto;
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const content = await prisma.courseContent.create({
        data: {
          ...restData,
          courseId,
        },
      });

      if (tags && tags instanceof Array && tags.length > 0) {
        const dto: CreateContentTagDto = {
          contentId: content.id,
          tags,
        };
        await this.createTag(dto, prisma);
        return prisma.courseContent.findUnique({
          where: {
            id: content.id,
          },
          include: {
            Tags: {
              include: {
                Tag: true,
              },
            },
          },
        });
      }

      // 只处理attachments传递，不考虑子属性传递
      if (
        attachments &&
        attachments instanceof Array &&
        attachments.length > 0
      ) {
        const res = await Promise.all(
          attachments.map((attachment) => {
            return this.attachmentService.create(attachment);
          }),
        );

        // 批量创建
        await prisma.contentAttachment.createMany({
          data: res.map((o) => ({
            contentId: content.id,
            attachmentId: o.id,
          })),
        });

        return prisma.courseContent.findUnique({
          where: {
            id: content.id,
          },
          include: {
            Attachments: true,
          },
        });
      }
      return content;
    });
  }

  findAll(courseId: number, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prismaClient.courseContent.findMany({
      skip,
      take: limit,
      where: {
        courseId,
      },
    });
  }

  findOne(id: number) {
    return this.prismaClient.courseContent.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateContentDto: UpdateContentDto) {
    // 删除无用的属性
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { tags, attachments, ...restData } = updateContentDto;

    return this.prismaClient.courseContent.update({
      where: {
        id,
      },
      data: restData,
    });
  }

  removeOne(id: number) {
    return this.prismaClient.courseContent.delete({
      where: {
        id,
      },
    });
  }

  // remove All Contents of the id Course
  remove(id: number) {
    return this.prismaClient.courseContent.deleteMany({
      where: {
        courseId: id,
      },
    });
  }
}
