import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { PrismaService } from '@/prisma/prisma.service';
import { JwtStrategy } from '@/common/strategies/jwt.startegy';
import { UserService } from '@/user/user.service';

@Module({
  providers: [
    PostResolver,
    PostService,
    PrismaService,
    JwtStrategy,
    UserService,
  ],
})
export class PostModule {}
