import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRequestLogsPartitionedTable1725193658463
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE request_logs (
        id serial,
        method varchar(10),
        url text,
        headers jsonb,
        body jsonb,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        PRIMARY KEY (id, "createdAt")
      ) PARTITION BY RANGE ("createdAt");
    `);

    const now = new Date();
    const next10Min = new Date(now.getTime() + 10 * 60000);
    const partitionName = `request_logs_${now.toISOString().replace(/[-:.TZ]/g, '')}`;

    await queryRunner.query(`
      CREATE TABLE ${partitionName} PARTITION OF request_logs
      FOR VALUES FROM ('${now.toISOString()}') TO ('${next10Min.toISOString()}');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS request_logs CASCADE;
    `);
  }
}
