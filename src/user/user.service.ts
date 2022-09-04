import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { from } from 'rxjs';
import { UserRegisterInput } from '@/auth/dto/user-register.input';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  create(userData: UserRegisterInput) {
    return from(
      this.prismaService.user.create({
        data: {
          ...userData,
        },
      }),
    );
  }

  getProfile(email: string) {
    return this.findUserByEmail(email);
  }
  findUserByEmail(email: string) {
    return from(this.prismaService.user.findUnique({ where: { email } }));
  }
  findUniqueBy(email: string, username: string) {
    return from(
      this.prismaService.user.findFirst({
        where: { OR: [{ username }, { email }] },
      }),
    );
  }
}
