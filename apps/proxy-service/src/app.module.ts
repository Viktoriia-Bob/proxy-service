import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    PostsModule,
    CommentsModule,
    RabbitmqModule,
    SocketModule,
  ],
})
export class AppModule {}
