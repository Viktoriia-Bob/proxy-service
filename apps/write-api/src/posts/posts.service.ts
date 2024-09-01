import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from '@app/entities';
import { Repository } from 'typeorm';
import { CreatePostDto } from '@app/types/create-post.dto';
import { UpdatePostDto } from '@app/types/update-post.dto';
import { RedisCacheService } from '@app/redis-cache';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const createdPost = await this.postsRepository.save({
      user: {
        id: createPostDto.userId,
      },
      ...createPostDto,
    });

    await this.updateRedisValues(createPostDto.userId);

    return createdPost;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.postsRepository.update(id, updatePostDto);

    const updatedPost = await this.postsRepository.findOneOrFail({
      where: { id },
      relations: ['user'],
    });

    await this.updateRedisValues(updatedPost.user.id);

    return updatedPost;
  }

  private async updateRedisValues(userId: number) {
    const postsKey = this.redisCacheService.generateRedisKey('posts', userId);

    const posts = await this.postsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    await this.redisCacheService.set(postsKey, posts);
  }
}
