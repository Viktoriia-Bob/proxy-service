import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Comment } from '@app/entities';
import { RedisCacheModule } from '@app/redis-cache';

import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), RedisCacheModule],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
