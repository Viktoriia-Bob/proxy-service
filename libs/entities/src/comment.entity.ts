import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { Post } from './post.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => Post, post => post.comments, { onDelete: 'CASCADE' })
	post: Post;

	@ManyToOne(() => User, user => user.comments, { onDelete: 'CASCADE' })
	user: User;

	@Column()
	content: string;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;
}