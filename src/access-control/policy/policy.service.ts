import { Inject, Injectable } from '@nestjs/common';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PrismaClient } from 'prisma/clients/postgresql';
import { PRISMA_DATABASE } from '@/database/databse.constants';

@Injectable()
export class PolicyService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}
  create(createPolicyDto: CreatePolicyDto) {
    const encode = Buffer.from(JSON.stringify(createPolicyDto)).toString(
      'base64',
    );
    const data = { ...createPolicyDto, encode };
    return this.prismaClient.policy.create({ data });
  }

  findAll(page: number = 1, limit: number = 10) {
    return this.prismaClient.policy.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  findOne(policyId: number) {
    return this.prismaClient.policy.findUnique({ where: { id: policyId } });
  }

  update(id: number, updatePolicyDto: UpdatePolicyDto) {
    const encode = Buffer.from(JSON.stringify(updatePolicyDto)).toString(
      'base64',
    );
    const data = { ...updatePolicyDto, encode };
    return this.prismaClient.policy.update({
      where: { id },
      data: data,
    });
  }

  remove(id: number) {
    return this.prismaClient.policy.delete({ where: { id } });
  }
}
