import { Args, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from '@/user/models/user.model';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/common/guards/jwt.guard';

@Resolver((of) => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Query(() => UserModel)
  getProfile(@Args('email') email: string) {
    return this.userService.getProfile(email);
  }
}
