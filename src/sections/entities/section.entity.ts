import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Poll } from '../../polls/entities/poll.entity';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'uuid' })
  pollId: string;

  @Column({ nullable: false, default: 0, type: 'smallint' })
  orderBy: number;

  @OneToMany(() => Question, (question) => question.section, { cascade: true })
  questions: Question[];

  @ManyToOne(() => Poll, (poll) => poll.id, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  poll: Poll;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
