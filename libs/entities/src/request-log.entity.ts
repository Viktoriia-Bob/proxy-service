import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('request_logs')
export class RequestLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  method: string;

  @Column()
  url: string;

  @Column('text')
  headers: string;

  @Column('text')
  body: string;

  @CreateDateColumn()
  createdAt: Date;
}
