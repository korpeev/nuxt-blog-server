import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtStrategy } from '@/common/strategies/jwt.startegy';

@Module({
  providers: [UserResolver, UserService, PrismaService, JwtStrategy],
  exports: [PrismaService, UserService],
})
export class UserModule {}
