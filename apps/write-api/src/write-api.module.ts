import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Post, User, Comment } from '@app/entities';

import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { UsersModule } from './users/users.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';

import { InitDatabase1725105562367 } from './migrations/1725105562367-InitDatabase';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow<string>('PG_HOST'),
        port: +configService.getOrThrow<number>('PG_PORT'),
        username: configService.getOrThrow<string>('PG_USERNAME'),
        password: configService.getOrThrow<string>('PG_PASSWORD'),
        database: configService.getOrThrow<string>('PG_DATABASE'),
        entities: [User, Post, Comment],
        migrations: [InitDatabase1725105562367],
        synchronize: false,
        migrationsRun: true,
        logging: true,
      }),
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    RabbitmqModule,
  ],
})
export class WriteApiModule {}
