import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { Patterns } from '@app/enums';
import { CreatePostDto, UpdatePostDto } from '@app/types';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  private readonly logger = new Logger(PostsController.name);

  constructor(private readonly postsService: PostsService) {}

  @MessagePattern(Patterns.CREATE_POST)
  async createPost(@Payload() data: CreatePostDto) {
    const createdPost = await this.postsService.create(data);

    this.logger.log('Created post:', createdPost);
  }

  @MessagePattern(Patterns.UPDATE_POST)
  async updatePost(@Payload() data: UpdatePostDto & { postId: number }) {
    await this.postsService.update(data.postId, {
      content: data.content,
      title: data.title,
    });

    this.logger.log(`Updated post ${data.postId}`);
  }
}
