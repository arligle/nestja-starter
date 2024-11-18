import { Inject, Injectable } from '@nestjs/common';
import { CreateDictAttachmentAttributeDto } from './dto/create-dict-attachment-attribute.dto';
import { UpdateDictAttachmentAttributeDto } from './dto/update-dict-attachment-attribute.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class AttachmentAttributeService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  create(dto: CreateDictAttachmentAttributeDto) {
    return this.prismaClient.dictAttachmentAttribute.create({
      data: dto,
    });
  }

  createMany(dto: CreateDictAttachmentAttributeDto[]) {
    return this.prismaClient.dictAttachmentAttribute.createMany({
      data: dto,
    });
  }

  findAll(page: number = 1, limit: number = 10) {
    if (limit === -1) {
      return this.prismaClient.dictAttachmentAttribute.findMany();
    }

    const skip = (page - 1) * limit;
    return this.prismaClient.dictAttachmentAttribute.findMany({
      skip,
      take: limit,
    });
  }

  findOne(id: number) {
    return this.prismaClient.dictAttachmentAttribute.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, dto: UpdateDictAttachmentAttributeDto) {
    return this.prismaClient.dictAttachmentAttribute.update({
      where: {
        id,
      },
      data: dto,
    });
  }

  remove(id: number) {
    return this.prismaClient.dictAttachmentAttribute.delete({
      where: {
        id,
      },
    });
  }
}
