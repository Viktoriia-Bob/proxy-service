import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RedisCacheService } from '@app/redis-cache';
import { CreateCommentDto, UpdateCommentDto } from '@app/types';
import { Comment } from '@app/entities';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const createdComment = await this.commentsRepository.save({
      post: {
        id: createCommentDto.postId,
      },
      ...createCommentDto,
    });

    await this.updateRedisValues(createCommentDto.postId);

    return createdComment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.commentsRepository.update(id, updateCommentDto);

    const updatedComment = await this.commentsRepository.findOneOrFail({
      where: { id },
      relations: ['post'],
    });

    await this.updateRedisValues(updatedComment.post.id);

    return updatedComment;
  }

  private async updateRedisValues(postId: number) {
    const commentsKey = this.redisCacheService.generateRedisKey(
      'comments',
      postId,
    );

    const comments = await this.commentsRepository.find({
      where: {
        post: {
          id: postId,
        },
      },
    });

    await this.redisCacheService.set(commentsKey, comments);
  }
}
