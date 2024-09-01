import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '@app/entities';
import { CreateUserDto, UpdateUserDto } from '@app/types';
import { RedisCacheService } from '@app/redis-cache';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private readonly redisCacheService: RedisCacheService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = await this.usersRepository.save(createUserDto);

    await this.updateRedisValues();

    return createdUser;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update(id, updateUserDto);

    await this.updateRedisValues();

    return this.usersRepository.findOneOrFail({ where: { id } });
  }

  private async updateRedisValues() {
    const usersKey = this.redisCacheService.generateRedisKey('users');

    const users = await this.usersRepository.find();

    await this.redisCacheService.set(usersKey, users);
  }
}
