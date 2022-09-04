import { Field, GraphQLISODateTime, Int, ObjectType } from '@nestjs/graphql';
import { UserModel } from '@/user/models/user.model';

@ObjectType()
export class PostModel {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  content: string;

  @Field()
  updatedAt: Date;

  @Field()
  createdAt: Date;

  @Field(() => UserModel)
  user: UserModel;
}
