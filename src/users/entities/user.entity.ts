import * as bcrypt from 'bcrypt';
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
  BeforeUpdate,
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
  @Column({ nullable: false, select: false })
  password: string;

  @OneToMany(() => Poll, (poll) => poll.user, { cascade: true })
  polls: Poll[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();

      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
