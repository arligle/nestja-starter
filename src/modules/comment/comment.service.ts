import { Inject, Injectable } from '@nestjs/common';
import {
  CreateCourseCommentDto,
  MixedCreateCommentDto,
} from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PRISMA_DATABASE } from '@/database/databse.constants';
import { PrismaClient } from 'prisma/clients/postgresql';

@Injectable()
export class CommentService {
  constructor(@Inject(PRISMA_DATABASE) private prismaClient: PrismaClient) {}

  hands(id: number) {
    return this.prismaClient.comment.update({
      where: {
        id,
      },
      data: {
        hands: {
          increment: 1,
        },
      },
    });
  }

  genericCreate(dto, model: string, field: string) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      // 创建comments
      const { comments, linkedId, ...restData } = dto;
      if (comments && comments.length) {
        // 先创建comments
        const res = await Promise.all(
          comments.map((comment) =>
            prisma.comment.create({
              data: comment,
            }),
          ),
        );
        return await prisma[model].createMany({
          data: res.map((comment) => ({
            [field]: linkedId,
            commentId: comment.id,
          })),
        });
      } else {
        if (restData['content']) {
          const comment = await prisma.comment.create({
            data: restData as any,
          });
          return await prisma[model].create({
            data: {
              [field]: linkedId,
              commentId: comment.id,
            },
          });
        }

        throw new Error('content内容不能为空');
      }
    });
  }

  create(dto: MixedCreateCommentDto) {
    const { courseId, contentId } = dto;
    if (courseId) {
      return this.genericCreate(
        { linkedId: dto.courseId, ...dto },
        'courseComment',
        'courseId',
      );
    } else if (contentId) {
      return this.genericCreate(
        { linkedId: dto.contentId, ...dto },
        'contentComment',
        'contentId',
      );
    }
    throw new Error('courseId, contentId不能为空');
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return this.prismaClient.comment.update({
      where: {
        id,
      },
      data: updateCommentDto,
    });
  }

  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const comments = await this.prismaClient.comment.findMany({
      where: {
        pid: null,
      },
      skip,
      take: limit,
    });

    const commentsWithNested = await Promise.all(
      comments.map((comment) => this.fetchAllNestedComments(comment.id)),
    );
    return commentsWithNested;
  }

  findOne(id: number) {
    return this.fetchAllNestedComments(id);
  }

  async fetchAllNestedComments(
    commentId: number,
    prismaInstance?: PrismaClient,
  ): Promise<any> {
    const comment = await (
      prismaInstance || this.prismaClient
    ).comment.findUnique({
      where: { id: commentId },
      include: {
        children: true,
      },
    });

    if (comment && comment.children) {
      // 并行查询所有子评论的嵌套子评论
      const childrenWithNested = await Promise.all(
        comment.children.map((child) => this.fetchAllNestedComments(child.id)),
      );
      // 将递归查询结果赋值给子评论数组
      comment.children = childrenWithNested;
    }
    return comment;
  }

  remove(id: number) {
    return this.prismaClient.$transaction(async (prisma: PrismaClient) => {
      // 查询所有的评论及子评论
      const comments = await this.fetchAllNestedComments(id, prisma);

      await prisma.comment.deleteMany({
        where: {
          id: {
            in: comments.map((comment) => comment.id),
          },
        },
      });
    });
  }
}
