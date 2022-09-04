import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserModule } from '@/user/user.module';
import { AuthService } from '@/auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [UserModule, JwtModule.register({})],
  providers: [AuthResolver, AuthService, JwtService],
})
export class AuthModule {}
