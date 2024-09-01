import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';
import { CreateCommentDto, UpdateCommentDto } from '@app/types';

import { CommentsService } from './comments.service';

@Controller('comments')
export class CommentsController {
  private readonly logger = new Logger(CommentsController.name);

  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern(Patterns.CREATE_COMMENTS)
  async createComment(@Payload() data: CreateCommentDto) {
    const createdComment = await this.commentsService.create(data);

    this.logger.log('Created comment:', createdComment);
  }

  @MessagePattern(Patterns.UPDATE_COMMENTS)
  async updateComment(
    @Payload() data: UpdateCommentDto & { commentId: number },
  ) {
    await this.commentsService.update(data.commentId, {
      content: data.content,
    });

    this.logger.log(`Updated comment ${data.commentId}`);
  }
}
