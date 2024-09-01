import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';
import { PostsFilterDto } from '@app/types';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @MessagePattern(Patterns.READ_POSTS)
  async getAllPostsForUser(
    @Payload()
    {
      userId,
      pageNumber,
      filter,
    }: {
      userId: number;
      pageNumber?: number;
      filter?: PostsFilterDto;
    },
  ) {
    const result = await this.postsService.findAllByUserId(
      userId,
      pageNumber,
      filter,
    );

    this.logger.log(`Getting posts for user ${userId}:`, result);
  }
}
