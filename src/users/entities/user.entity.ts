import { Factory } from 'nestjs-seeder';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  BeforeInsert,
} from 'typeorm';

import { Poll } from '../../polls/entities/poll.entity';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Factory((faker) => faker.internet.email())
  @Column({ unique: true, nullable: false })
  email: string;

  @Factory('password')
  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Poll, (poll) => poll.user, { cascade: true })
  polls: Poll[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  async emitCreatedEvent() {
    // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
  }
}
