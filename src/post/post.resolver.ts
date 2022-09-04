import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { PostModel } from '@/post/model/post.model';
import { PostCreateInput } from '@/post/dto/post-create.input';
import { GetUserDecorator } from '@/common/decorators/get-user.decorator';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';
import { PostUpdateInput } from '@/post/dto/post-update.input';

@UseGuards(JwtAuthGuard)
@Resolver((of) => PostModel)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => PostModel)
  createPost(
    @Args('createPost') post: PostCreateInput,
    @GetUserDecorator('id') userId: number,
  ) {
    return this.postService.create(post, userId);
  }

  @Mutation(() => PostModel)
  updatePost(
    @Args('updatePost') post: PostUpdateInput,
    @GetUserDecorator('id') userId: number,
  ) {
    return this.postService.update(post, userId);
  }
  @Mutation(() => PostModel)
  deletePost(
    @Args('postId') id: number,
    @GetUserDecorator('id') userId: number,
  ) {
    return this.postService.delete(id, userId);
  }
  @Query(() => PostModel)
  getPostById(
    @Args('postId') id: number,
    @GetUserDecorator('id') userId: number,
  ) {
    return this.postService.getPostById(id, userId);
  }
}
