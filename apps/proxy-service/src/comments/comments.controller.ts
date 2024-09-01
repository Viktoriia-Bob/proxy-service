import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns, SocketKeys } from '@app/enums';
import {
  CommentsFilterDto,
  CreateCommentDto,
  UpdateCommentDto,
} from '@app/types';
import { Comment } from '@app/entities';

import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly rabbitService: RabbitmqService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @MessagePattern(Patterns.CREATE_COMMENT_SUCCESS)
  async commentCreated(@Payload() comment: Comment) {
    this.socketGateway.sendNotification(SocketKeys.CREATED_COMMENT, comment);
  }

  @MessagePattern(Patterns.UPDATE_COMMENT_SUCCESS)
  async commentUpdated(@Payload() comment: Comment) {
    this.socketGateway.sendNotification(SocketKeys.UPDATED_COMMENT, comment);
  }

  @Get('/post/:postId')
  async getComment(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() filter: CommentsFilterDto,
    @Query('page') pageNumber?: number,
  ) {
    return this.rabbitService.sendReadNotification(Patterns.READ_COMMENTS, {
      postId,
      pageNumber,
      filter,
    });
  }

  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto) {
    return this.rabbitService.sendWriteNotification(
      Patterns.CREATE_COMMENTS,
      createCommentDto,
    );
  }

  @Put(':commentId')
  async updateComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.rabbitService.sendWriteNotification(Patterns.UPDATE_COMMENTS, {
      commentId,
      ...updateCommentDto,
    });
  }
}
