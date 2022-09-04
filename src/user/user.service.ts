import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { UserRegisterInput } from '@/user/dto/user-register.input';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';
import { UserModel } from '@/user/models/user.model';
import { compare, hash } from 'bcryptjs';
import { UserLoginInput } from '@/user/dto/user-login.input';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  register(userData: UserRegisterInput) {
    const user$ = this.findUserByEmail(userData.email).pipe(
      switchMap((user) => {
        if (user) throw new BadRequestException('user already exist');
        return this.genHash(userData.password);
      }),
      map((hashedPassword) =>
        this.prismaService.user.create({
          data: {
            ...userData,
            password: hashedPassword,
          },
        }),
      ),
    );
    return user$;
  }

  login(userData: UserLoginInput) {
    return this.findUserByEmail(userData.email).pipe(
      map((user) => {
        if (!user) throw new BadRequestException('User not found');
        this.hasEqual(userData.password, user.password).subscribe((isEqual) => {
          if (!isEqual) throw new BadRequestException('Invalid credentials');
        });
        return user;
      }),
    );
  }

  getProfile(email: string) {
    return this.findUserByEmail(email);
  }
  private findUserByEmail(email: string) {
    return from(this.prismaService.user.findUnique({ where: { email } }));
  }

  private genHash(data: string) {
    return from(hash(data, 8));
  }
  private hasEqual(data: string, hash: string) {
    return from(compare(data, hash));
  }
}
