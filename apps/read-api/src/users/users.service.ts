import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { User } from '@app/entities';
import { RedisCacheService } from '@app/redis-cache';
import { UserFilterDto } from '@app/types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly redisCacheService: RedisCacheService,
    private readonly configService: ConfigService,
  ) {}

  async findAll(pageNumber?: number, filter?: UserFilterDto) {
    if (!pageNumber && !filter) {
      const usersRedisKey = this.redisCacheService.generateRedisKey('users');
      const usersFromCache = this.redisCacheService.get(usersRedisKey);

      if (usersFromCache) return usersFromCache;

      const users = await this.usersRepository.find();
      await this.redisCacheService.set(usersRedisKey, users);

      return users;
    }

    const query = this.usersRepository.createQueryBuilder('users');

    if (filter) {
      if (filter.name) {
        query.andWhere('users.name like :name', { name: `%${filter.name}%` });
      }

      if (filter.email) {
        query.andWhere('users.email = :email', { email: filter.email });
      }

      if (filter.startDate) {
        query.andWhere('users.createdAt > :startDate', {
          startDate: filter.startDate,
        });
      }

      if (filter.endDate) {
        query.andWhere('users.createdAt < :endDate', {
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
