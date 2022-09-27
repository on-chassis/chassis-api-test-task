import { Entity, Column, PrimaryGeneratedColumn, OneToMany, JoinColumn, OneToOne, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn('uuid')
  id: string;  

  @OneToOne(() => User, (user) => user.id, { cascade: false })
  private creator: User

  @Column({ type: 'bit' })
  public: boolean;

  @Column({ type: 'bit' })
  default: boolean;

  @OneToMany(() => PollSection, (pollSection) => pollSection.poll, { cascade: true })
  @JoinColumn({ name: 'name' })
  sections: PollSection[];

  @OneToOne(() => Poll, (child) => child.id, { cascade: false })
  @JoinColumn({ name: 'overwrittenBy' })
  readonly child: Poll;

  @Column({ type: 'varchar' })
  title: string;

  setCreator(user: User) { this.creator = user; }
}

@Entity('poll_sections')
export class PollSection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Poll, (poll) => poll.id, { cascade: false })
  @JoinColumn()
  readonly poll: Poll;

  @Column({ type: 'varchar' })
  title: string;

  @OneToMany(() => PollQuestion, (pollQuestion) => pollQuestion.section, { cascade: true })
  @JoinColumn({ name: 'questionId' })
  questions: PollQuestion[];

  @Column({ type: 'int' })
  orderNumber: number;
}

@Entity('poll_questions')
export class PollQuestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => PollSection, (pollSection) => pollSection.id, { cascade: false })
  @JoinColumn()
  readonly section: PollSection;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'int' })
  orderNumber: number;
}
