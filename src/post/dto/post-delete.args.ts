import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';

@ArgsType()
export class PostDeleteArgs {
  @Field(() => Number)
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
