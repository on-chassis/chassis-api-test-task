import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id: number;  
}
