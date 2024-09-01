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
import { CreatePostDto, PostsFilterDto, UpdatePostDto } from '@app/types';
import { Post as PostEntity } from '@app/entities';

import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { SocketGateway } from '../socket/socket.gateway';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly rabbitService: RabbitmqService,
    private readonly socketGateway: SocketGateway,
  ) {}

  @MessagePattern(Patterns.CREATE_POST_SUCCESS)
  async postCreated(@Payload() post: PostEntity) {
    this.socketGateway.sendNotification(SocketKeys.CREATED_POST, post);
  }

  @MessagePattern(Patterns.UPDATE_POST_SUCCESS)
  async postUpdated(@Payload() post: PostEntity) {
    this.socketGateway.sendNotification(SocketKeys.UPDATED_POST, post);
  }

  @Get('/user/:userId')
  async getPosts(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() filter: PostsFilterDto,
    @Query('page') pageNumber?: number,
  ) {
    return this.rabbitService.sendReadNotification(Patterns.READ_POSTS, {
      userId,
      pageNumber,
      filter,
    });
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.rabbitService.sendWriteNotification(
      Patterns.CREATE_POST,
      createPostDto,
    );
  }

  @Put(':postId')
  async updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.rabbitService.sendWriteNotification(Patterns.UPDATE_POST, {
      postId,
      ...updatePostDto,
    });
  }
}
