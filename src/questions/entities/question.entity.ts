import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from 'typeorm';

import { Section } from '../../sections/entities/section.entity';

@Entity()
export class Question extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'uuid' })
  sectionId: string;

  @Column({ nullable: false, default: 0, type: 'smallint' })
  orderBy: number;

  @ManyToOne(() => Section, (section) => section.id, {
    cascade: false,
    onDelete: 'CASCADE',
  })
  section: Section;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
