import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/users.entity';

@Entity('poll')
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  section: string;

  @Column({
    type: 'varchar',
    array: true,
    default: [],
  })
  questions: Array<string>;

  @Column({
    type: 'boolean',
    default: 0,
  })
  isPublic: boolean;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user: User) => user.polls)
  public user: User;
}
