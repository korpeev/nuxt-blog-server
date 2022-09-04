import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserModel } from '@/user/models/user.model';
import { UserRegisterInput } from '@/auth/dto/user-register.input';
import { UserLoginInput } from '@/auth/dto/user-login.input';
import { AuthService } from '@/auth/auth.service';

@Resolver((of) => UserModel)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}
  @Mutation(() => UserModel)
  register(@Args('userData') userData: UserRegisterInput) {
    return this.authService.register(userData);
  }

  @Mutation(() => UserModel)
  login(@Args('userData') userData: UserLoginInput) {
    return this.authService.login(userData);
  }
}
