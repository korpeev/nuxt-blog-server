import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { PostCreateInput } from '@/post/dto/post-create.input';
import { combineAll, from, map, merge, switchMap, take, takeLast } from 'rxjs';
import { PostUpdateInput } from '@/post/dto/post-update.input';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  create(post: PostCreateInput, userId: number) {
    return from(
      this.prismaService.post.create({
        data: {
          ...post,
          userId,
        },
        include: {
          user: true,
        },
      }),
    );
  }
  update(updatePost: PostUpdateInput, userId: number) {
    return this.checkPostByUserId(updatePost.id, userId).pipe(
      switchMap((post) =>
        from(
          this.prismaService.post.update({
            where: {
              id: updatePost.id,
            },
            data: {
              ...updatePost,
            },
            include: {
              user: true,
            },
          }),
        ),
      ),
    );
  }
  delete(postId: number, userId: number) {
    const deleteLikes$ = from(
      this.prismaService.like.deleteMany({
        where: {
          AND: {
            postId,
            userId,
          },
        },
      }),
    );
    const deleteComments$ = from(
      this.prismaService.comment.deleteMany({
        where: {
          AND: {
            postId,
            userId,
          },
        },
      }),
    );
    return merge(
      this.checkPostByUserId(postId, userId),
      deleteLikes$,
      deleteComments$,
      from(
        this.prismaService.post.delete({
          where: { id: postId },
          include: {
            user: true,
          },
        }),
      ),
    );
  }
  getPostById(id: number, userId: number) {
    return this.checkPostByUserId(id, userId);
  }

  //helper methods

  checkPostByUserId(postId: number, userId) {
    return this.findPostById(postId).pipe(
      map((post) => {
        if (!post) throw new BadRequestException();
        if (post.userId !== userId) throw new NotAcceptableException();
        return post;
      }),
    );
  }

  findPostById(id: number) {
    return from(
      this.prismaService.post.findUnique({
        where: { id },
        include: { user: true },
      }),
    );
  }
}
