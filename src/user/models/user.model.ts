import { Field, ID, ObjectType, HideField } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => Number)
  id: number;

  @Field(() => String)
  username: string;

  @Field(() => String)
  email: string;

  @HideField()
  password: string;

  @Field(() => String)
  accessToken: string;
}
