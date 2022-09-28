import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Poll, PollQuestion } from './poll.entity';

@Entity('poll_respondents')
export class PollRespondent {
  @PrimaryGeneratedColumn('uuid')
  id: string;  

  @ManyToOne(() => Poll, (poll) => poll.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  poll: Poll
}

@Entity('poll_respondent_answers')
export class PollRespondentAnswers {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  
  @ManyToOne(() => PollQuestion, (pollQuestion) => pollQuestion.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  question: PollQuestion

  @ManyToOne(() => PollRespondent, (pollRespondent) => pollRespondent.id, { cascade: false, onDelete: 'CASCADE' })
  @JoinColumn()
  respondent: PollRespondent

  @Column({ type: 'varchar' })
  text: string;
}
