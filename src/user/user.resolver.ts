import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserModel } from '@/user/models/user.model';
import { UserRegisterInput } from '@/user/dto/user-register.input';
import { UserLoginInput } from '@/user/dto/user-login.input';

@Resolver((of) => UserModel)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => UserModel)
  register(@Args('userData') userData: UserRegisterInput) {
    return this.userService.register(userData);
  }

  @Mutation(() => UserModel)
  login(@Args('userData') userData: UserLoginInput) {
    return this.userService.login(userData);
  }

  @Query(() => UserModel)
  getProfile(@Args('email') email: string) {
    return this.userService.getProfile(email);
  }
}
