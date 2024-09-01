import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1725105562367 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
        );

          CREATE TABLE posts (
            id SERIAL PRIMARY KEY,
            "userId" INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
          );

          CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            "postId" INT REFERENCES posts(id) ON DELETE CASCADE,
            "userId" INT REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
          );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE comments;
            DROP TABLE posts;
            DROP TABLE users;
        `);
  }
}
