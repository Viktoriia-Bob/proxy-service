import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RequestLog } from '@app/entities';

import { RequestLogService } from './request-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([RequestLog])],
  providers: [RequestLogService],
  exports: [RequestLogService],
})
export class RequestLogModule {}
