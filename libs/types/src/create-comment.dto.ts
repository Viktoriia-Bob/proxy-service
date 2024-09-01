import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsInt()
  postId: number;

  @IsNotEmpty()
  @IsString()
  content: string;
}
