import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';

@Injectable()
export class PartitionService {
  constructor(@InjectConnection() private connection: Connection) {}

  async createNextPartitions() {
    await this.connection.query(`SELECT create_request_log_partition()`);

    // Call it twice to create partitions for the next two 10-minute intervals
    await this.connection.query(`SELECT create_request_log_partition()`);
  }

  async cleanupOldPartitions() {
    // Cleanup logic to drop old partitions (older than one day)
    const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago

    await this.connection.query(`
      DO $$ 
      DECLARE 
          partition RECORD;
      BEGIN 
          FOR partition IN 
          SELECT tablename FROM pg_tables 
          WHERE tablename LIKE 'request_logs_%' 
          AND tablename < 'request_logs_' || to_char('${cutoffTime}', 'YYYYMMDDHH24MI')
          LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || partition.tablename;
          END LOOP;
      END $$;
    `);
  }
}
