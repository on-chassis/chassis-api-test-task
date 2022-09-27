import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Poll } from './poll.entity';
import { Question } from './question.entity';

@Entity('section')
export class Section extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @JoinColumn({ name: 'pollId' })
  @ManyToOne(() => Poll, (poll: Poll) => poll.sections)
  public poll: Poll;

  @OneToMany(() => Question, (question: Question) => question.section)
  public questions: Question[];
}
