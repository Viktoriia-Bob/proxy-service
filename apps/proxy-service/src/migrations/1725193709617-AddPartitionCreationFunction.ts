import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartitionCreationFunction1725193709617
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION create_request_log_partition() RETURNS void AS $$
      DECLARE
        start_time timestamp;
        end_time timestamp;
        partition_name text;
      BEGIN
        start_time := date_trunc('minute', now());
        end_time := start_time + interval '10 minutes';
        partition_name := 'request_logs_' || to_char(start_time, 'YYYYMMDDHH24MI');

        EXECUTE format('CREATE TABLE IF NOT EXISTS %I PARTITION OF request_logs FOR VALUES FROM (%L) TO (%L)', partition_name, start_time, end_time);
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS create_request_log_partition;
    `);
  }
}
