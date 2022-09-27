import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Answer } from '../answer/answer.entity';
import { Section } from './section.entity';

@Entity('question')
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'varchar' })
  text: string;

  @JoinColumn({ name: 'sectionId' })
  @ManyToOne(() => Section, (section: Section) => section.questions)
  public section: Section;

  @OneToMany(() => Answer, (answer: Answer) => answer.question)
  public answers: Answer[];
}
