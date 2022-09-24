import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
} from 'typeorm';

import { Poll } from '../poll/poll.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'bigint',
  })
  id: number;

  @Column({
    type: 'varchar',
  })
  fullName: string;

  @Column({
    type: 'varchar',
  })
  email: string;

  @Column({
    type: 'varchar',
  })
  password: string;

  @OneToMany(() => Poll, (poll: Poll) => poll.user)
  public polls: Poll[];
}
