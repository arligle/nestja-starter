import { Inject, Injectable } from '@nestjs/common';
import { CreateDictCourseTypeDto } from './dto/create-dict-course-type.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';
import { UpdateDictCourseTypeDto } from './dto/update-dict-course-type.dto';

@Injectable()
export class CourseTypesService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  create(createCourseTypeDto: CreateDictCourseTypeDto) {
    return this.prismaClient.dictCourseType.create({
      data: createCourseTypeDto,
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    if (limit === -1) {
      return this.prismaClient.dictCourseType.findMany();
    }

    const skip = (page - 1) * limit;
    return this.prismaClient.dictCourseType.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.dictCourseType.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateCourseTypeDto: UpdateDictCourseTypeDto) {
    return this.prismaClient.dictCourseType.update({
      where: {
        id,
      },
      data: updateCourseTypeDto,
    });
  }

  remove(id: number) {
    return this.prismaClient.dictCourseType.delete({
      where: {
        id,
      },
    });
  }
}
