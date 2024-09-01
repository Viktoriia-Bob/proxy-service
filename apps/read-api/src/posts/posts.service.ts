import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { Post } from '@app/entities';
import { RedisCacheService } from '@app/redis-cache';
import { PostsFilterDto } from '@app/types';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async findAllByUserId(
    userId: number,
    pageNumber?: number,
    filter?: PostsFilterDto,
  ) {
    if (!pageNumber && !filter) {
      const postsRedisKey = this.redisCacheService.generateRedisKey(
        'posts',
        userId,
      );
      const postsFromCache = this.redisCacheService.get(postsRedisKey);

      if (postsFromCache) return postsFromCache;

      const posts = await this.postsRepository.find({
        where: {
          user: {
            id: userId,
          },
        },
      });
      await this.redisCacheService.set(postsRedisKey, posts);

      return posts;
    }

    const query = this.postsRepository.createQueryBuilder('posts');

    if (filter) {
      if (filter.title) {
        query.andWhere('posts.title like :title', {
          title: `%${filter.title}%`,
        });
      }

      if (filter.content) {
        query.andWhere('posts.content like :content', {
          content: `%${filter.content}%`,
        });
      }

      if (filter.startDate) {
        query.andWhere('posts.createdAt > :startDate', {
          startDate: filter.startDate,
        });
      }

      if (filter.endDate) {
        query.andWhere('posts.createdAt < :endDate', {
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
