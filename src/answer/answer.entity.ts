import { Question } from 'src/poll/question.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('answer')
export class Answer extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  answer: string;

  @JoinColumn({ name: 'questionId' })
  @ManyToOne(() => Question, (question: Question) => question.answers)
  public question: Question;
}
