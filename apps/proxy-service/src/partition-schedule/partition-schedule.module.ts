import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PartitionScheduleService } from './partition-schedule.service';
import { PartitionService } from './partition.service';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([])],
  providers: [PartitionScheduleService, PartitionService],
})
export class PartitionScheduleModule {}
