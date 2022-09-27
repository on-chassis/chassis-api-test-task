import { Express } from 'express';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from "class-validator"
import * as bcrypt from "bcrypt"

@Entity('users')
export class User implements Express.User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 300 })
  @IsEmail()
  username: string;

  @Column({ type: 'varchar', length: 300, select: false })
  private passwordHash: string;

  @Column({ type: 'varchar', length: 300 })
  name: string;

  async checkPassword(password: string) { const result = await bcrypt.compare(password, this.passwordHash); return result; }

  async setPassword(newPassword: string) { this.passwordHash = await bcrypt.hash(newPassword, 10) }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      name: string;
    }
  }
}