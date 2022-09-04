import { Field, InputType } from '@nestjs/graphql';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class PostUpdateInput {
  @Field(() => Number)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  title: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  content: string;
}
