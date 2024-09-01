import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Comment } from '@app/entities';
import { RedisCacheService } from '@app/redis-cache';
import { CommentsFilterDto } from '@app/types';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async findAllByPostId(
    postId: number,
    pageNumber?: number,
    filter?: CommentsFilterDto,
  ) {
    if (!pageNumber && !filter) {
      const commentsRedisKey = this.redisCacheService.generateRedisKey(
        'comments',
        postId,
      );
      const commentsFromCache = this.redisCacheService.get(commentsRedisKey);

      if (commentsFromCache) return commentsFromCache;

      const comments = await this.commentsRepository.find({
        where: {
          post: {
            id: postId,
          },
        },
      });
      await this.redisCacheService.set(commentsRedisKey, comments);

      return comments;
    }

    const query = this.commentsRepository.createQueryBuilder('comments');

    if (filter) {
      if (filter.content) {
        query.andWhere('comments.content like :content', {
          name: `%${filter.content}%`,
        });
      }

      if (filter.startDate) {
        query.andWhere('comments.createdAt > :startDate', {
          startDate: filter.startDate,
        });
      }

      if (filter.endDate) {
        query.andWhere('comments.createdAt < :endDate', {
          endDate: filter.endDate,
        });
      }
    }

    if (pageNumber) {
      const itemsNumber =
        +this.configService.getOrThrow<number>('ITEMS_ON_PAGE');

      query.take(itemsNumber);
      query.skip(itemsNumber * (pageNumber - 1));
    }

    return query.getMany();
  }
}
