import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { User } from '../users/users.entity';
import { Section } from './section.entity';

@Entity('poll')
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'boolean',
    default: 0,
  })
  isPublic: boolean;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user: User) => user.polls)
  public user: User;

  @OneToMany(() => Section, (section: Section) => section.poll)
  public sections: Section[];
}
