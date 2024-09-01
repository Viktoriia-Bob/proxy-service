import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestLog } from '@app/entities';

import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { SocketModule } from './socket/socket.module';
import { RequestLogModule } from './request-log/request-log.module';
import { PartitionScheduleModule } from './partition-schedule/partition-schedule.module';
import { PartitionService } from './partition-schedule/partition.service';

import { LoggingMiddleware } from './logging.middleware';

import { CreateRequestLogsPartitionedTable1725193658463 } from './migrations/1725193658463-CreateRequestLogsPartitionedTable';
import { AddPartitionCreationFunction1725193709617 } from './migrations/1725193709617-AddPartitionCreationFunction';
import { AddPartitionCleanupFunction1725193747174 } from './migrations/1725193747174-AddPartitionCleanupFunction';

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
        entities: [RequestLog],
        migrations: [
          CreateRequestLogsPartitionedTable1725193658463,
          AddPartitionCreationFunction1725193709617,
          AddPartitionCleanupFunction1725193747174,
        ],
        synchronize: false,
        migrationsRun: true,
        logging: true,
      }),
    }),
    UsersModule,
    PostsModule,
    CommentsModule,
    RabbitmqModule,
    SocketModule,
    RequestLogModule,
    PartitionScheduleModule,
  ],
  providers: [PartitionService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
