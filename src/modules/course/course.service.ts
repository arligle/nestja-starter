import { Inject, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';
import { CreateCourseTagDto } from './dto/create-course-tag.dto';
import { UpdateCourseTagDto } from './dto/update-course-tag.dto';

@Injectable()
export class CourseService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  createTag(dto: CreateCourseTagDto, prismaInstance?: PrismaClient) {
    // 1.数据结构是怎样的？
    // 2.怎样去存放这些数据？
    const { tags, tagId, courseId } = dto;

    if (tagId) {
      return (prismaInstance || this.prismaClient).courseTag.create({
        data: {
          tagId,
          courseId,
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
            res['exist'] = await prisma.courseTag.createMany({
              data: tagIds.map((o) => ({
                tagId: o,
                courseId,
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

            res['create'] = await prisma.courseTag.createMany({
              data: newTags.map((o) => ({
                tagId: o.id,
                courseId,
              })),
            });
          }

          return res;
        },
      );
    }
  }

  updateTag(dto: UpdateCourseTagDto) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      await prisma.courseTag.deleteMany({
        where: {
          courseId: dto.courseId,
        },
      });
      return this.createTag(dto as CreateCourseTagDto, prisma);
    });
  }

  findAllTag(courseId: number) {
    return this.prismaClient.courseTag.findMany({
      where: {
        courseId,
      },
      include: {
        Tag: {
          include: {
            CourseType: true,
          },
        },
      },
    });
  }

  deleteTag(courseId: number, tagId: number) {
    if (tagId) {
      // 只删除一条数据
      return this.prismaClient.courseTag.delete({
        where: {
          courseId_tagId: {
            courseId: courseId,
            tagId: tagId,
          },
        },
      });
    } else {
      // 删除所有courseId的tag
      return this.prismaClient.courseTag.deleteMany({
        where: {
          courseId,
        },
      });
    }
  }

  create(createCourseDto: CreateCourseDto) {
    const { tags, ...restData } = createCourseDto;
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      const course = await prisma.course.create({
        data: {
          ...restData,
        },
      });

      if (tags && tags instanceof Array && tags.length > 0) {
        const dto: CreateCourseTagDto = {
          courseId: course.id,
          tags,
        };
        await this.createTag(dto, prisma);
        return prisma.course.findUnique({
          where: {
            id: course.id,
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

      return course;
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return this.prismaClient.course.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.course.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return this.prismaClient.course.update({
      where: {
        id,
      },
      data: updateCourseDto,
    });
  }

  remove(id: number) {
    return this.prismaClient.course.delete({
      where: {
        id,
      },
    });
  }
}
