import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserLoginInput } from '@/auth/dto/user-login.input';
import { from, map, switchMap } from 'rxjs';
import { compare, hash } from 'bcryptjs';
import { UserRegisterInput } from '@/auth/dto/user-register.input';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  register(userData: UserRegisterInput) {
    return this.userService
      .findUniqueBy(userData.email, userData.username)
      .pipe(
        switchMap((user) => {
          if (user) throw new BadRequestException('user already exist');
          return this.genHash(userData.password).pipe(
            switchMap((hashedPassword) =>
              this.userService.create({
                ...userData,
                password: hashedPassword,
              }),
            ),
            map((user) => ({
              ...user,
              accessToken: this.jwtService.sign(
                { sub: user.id, email: user.email },
                {
                  expiresIn: '1d',
                  secret: this.configService.get<string>('JWT-SECRET'),
                },
              ),
            })),
          );
        }),
      );
  }

  login(userData: UserLoginInput) {
    return this.validateUser(userData.email, userData.password).pipe(
      map((user) => ({
        ...user,
        accessToken: this.jwtService.sign(
          { sub: user.id, email: user.email },
          {
            expiresIn: '1d',
            secret: this.configService.get<string>('JWT-SECRET'),
          },
        ),
      })),
    );
  }

  validateUser(email: string, password: string) {
    return this.userService.findUserByEmail(email).pipe(
      switchMap((user) => {
        if (!user) throw new BadRequestException('User not found');
        return this.hasEqual(password, user.password).pipe(
          map((isEqual) => {
            if (!isEqual)
              throw new UnauthorizedException('Invalid credentials');
            return user;
          }),
        );
      }),
    );
  }
  private hasEqual(data: string, hash: string) {
    return from(compare(data, hash));
  }
  private genHash(data: string) {
    return from(hash(data, 8));
  }
}
