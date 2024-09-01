import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@app/entities';
import { RedisCacheModule } from '@app/redis-cache';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), RedisCacheModule, ConfigModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
