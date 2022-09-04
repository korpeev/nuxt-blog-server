import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/common/types';
import { UserService } from '@/user/user.service';
import { tap } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT-SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const expTimestamp = payload.exp * 1000;
    if (expTimestamp < Date.now())
      throw new UnauthorizedException('token expired');

    return this.userService
      .findUserByEmail(payload.email)
      .pipe(tap((user) => delete user.password));
  }
}
