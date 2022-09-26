import { Express } from 'express';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from "class-validator"

@Entity('users')
export class UnsafeUser implements Express.User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 300 })
  @IsEmail()
  username: string;

  @Column({ type: 'varchar', length: 300 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;
}

export interface User extends Express.User {}

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      name: string;
    }
  }
}