import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entities';
import { RedisCacheModule } from '@app/redis-cache';

@Module({
  imports: [TypeOrmModule.forFeature([User]), RedisCacheModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
