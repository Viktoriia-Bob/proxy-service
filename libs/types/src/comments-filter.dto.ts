import { IsDate, IsOptional, IsString } from 'class-validator';

export class CommentsFilterDto {
  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDate()
  startDate?: Date;

  @IsOptional()
  @IsDate()
  endDate?: Date;
}
