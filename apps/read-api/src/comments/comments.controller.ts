import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';
import { CommentsFilterDto } from '@app/types';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsService.name);

  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern(Patterns.READ_COMMENTS)
  async getCommentsForPost(
    @Payload()
    {
      postId,
      pageNumber,
      filter,
    }: {
      postId: number;
      pageNumber?: number;
      filter?: CommentsFilterDto;
    },
  ) {
    const result = await this.commentsService.findAllByPostId(
      postId,
      pageNumber,
      filter,
    );

    this.logger.log(`Get all comments for post ${postId}:`, result);
  }
}
