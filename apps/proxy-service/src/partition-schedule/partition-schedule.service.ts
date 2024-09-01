import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PartitionService } from './partition.service';

@Injectable()
export class PartitionScheduleService {
  private readonly logger = new Logger(PartitionScheduleService.name);

  constructor(private readonly partitionService: PartitionService) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCreatePartitions() {
    this.logger.log('Running partition creation task...');

    await this.partitionService.createNextPartitions();

    this.logger.log('Partition creation task completed.');
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanupPartitions() {
    this.logger.log('Running partition cleanup task...');

    await this.partitionService.cleanupOldPartitions();

    this.logger.log('Partition cleanup task completed.');
  }
}
