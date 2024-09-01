import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  generateRedisKey(type: 'users'): string;
  generateRedisKey(type: 'posts' | 'comments', ownerId: number): string;
  generateRedisKey(
    type: 'users' | 'posts' | 'comments',
    ownerId?: number,
  ): string {
    if (type === 'users') {
      return 'users';
    } else if (type === 'posts' && ownerId) {
      return `posts_for_user_${ownerId}`;
    } else if (type === 'comments' && ownerId) {
      return `comments_for_post_${ownerId}`;
    }
  }

  get(key: string): any {
    console.log('GET');
    return this.cacheManager.get(key);
  }

  set(key: string, value: any) {
    console.log('SET');
    return this.cacheManager.set(key, value);
  }
}
