import { Express } from 'express';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail } from "class-validator"
import * as bcrypt from "bcrypt"

/**
 * Avoid using this entity as @JoinColumn and use @Column('uuid') instead due to security reasons
 * When an entity which has this entity as @JoinColumn is sent in response without removing passwordHash then this User.passwordHash value will be leaked
 */
@Entity('users')
export class User implements Express.User {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @Column({ type: 'varchar', length: 300 })
  @IsEmail()
  username: string;

  @Column({ type: 'varchar', length: 300 })
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