import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@app/entities';
import { RedisCacheModule } from '@app/redis-cache';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), RedisCacheModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
