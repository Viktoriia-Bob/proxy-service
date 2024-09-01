import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartitionCleanupFunction1725193747174
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION cleanup_old_partitions() RETURNS void AS $$
      DECLARE
        partition RECORD;
        cutoff_time timestamp := now() - interval '1 day';
      BEGIN
        FOR partition IN
        SELECT tablename FROM pg_tables
        WHERE tablename LIKE 'request_logs_%' 
        AND tablename < 'request_logs_' || to_char(cutoff_time, 'YYYYMMDDHH24MI')
        LOOP
          EXECUTE 'DROP TABLE IF EXISTS ' || partition.tablename;
        END LOOP;
      END;
      $$ LANGUAGE plpgsql;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS cleanup_old_partitions;
    `);
  }
}
