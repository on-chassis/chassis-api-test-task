import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { Section } from '../../sections/entities/section.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Poll extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @Column({ nullable: false, default: false })
  nonPublic: boolean;

  @OneToMany(() => Section, (section) => section.poll, { cascade: true })
  sections: Section[];

  @ManyToOne(() => User, (user) => user.id, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
