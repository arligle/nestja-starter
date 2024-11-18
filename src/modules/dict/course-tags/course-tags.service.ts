import { Inject, Injectable } from '@nestjs/common';
import { UpdateCourseTagDto } from './dto/update-dict-course-tag.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';
import { CreateDictCourseTagDto } from './dto/create-dict-course-tag.dto';

@Injectable()
export class CourseTagsService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  async create(createCourseTagDto: CreateDictCourseTagDto) {
    const { typeId, type, ...restData } = createCourseTagDto;

    const whereCond = typeId ? { id: typeId } : { name: type.name };
    let typeData = type;
    if (typeId) {
      typeData = await this.prismaClient.dictCourseType.findUnique({
        where: { id: typeId },
      });
    }
    const courseType = typeData
      ? {
          CourseType: {
            connectOrCreate: {
              where: { ...whereCond },
              create: typeData,
            },
          },
        }
      : {};
    return this.prismaClient.dictCourseTag.create({
      data: {
        ...restData,
        ...courseType,
      },
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    if (limit === -1) {
      return this.prismaClient.dictCourseTag.findMany({});
    }

    const skip = (page - 1) * limit;
    return this.prismaClient.dictCourseTag.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.dictCourseTag.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCourseTagDto: UpdateCourseTagDto) {
    return this.prismaClient.dictCourseTag.update({
      where: {
        id,
      },
      data: updateCourseTagDto,
    });
  }

  remove(id: number) {
    return this.prismaClient.dictCourseTag.delete({
      where: {
        id,
      },
    });
  }
}
