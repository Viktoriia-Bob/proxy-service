import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from '@app/entities';
import { RedisCacheModule } from '@app/redis-cache';

import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), RedisCacheModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
