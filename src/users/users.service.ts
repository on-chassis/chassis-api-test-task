import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt"

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

import { User, UnsafeUser } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(UnsafeUser) private readonly repo: Repository<UnsafeUser>) { }

  async findOneBy(user: FindUserDto): Promise<User | undefined> {
    const entity = await this.repo.findOne(user);
    if (entity) {
      const { passwordHash, ...safeUser } = entity;
      return safeUser;
    }
  }

  async checkPassword(username: string, password: string): Promise<Boolean> {
    const entity = await this.repo.findOne({ username });
    return bcrypt.compare(password, entity.passwordHash);
  }

  async create(createUserDto: CreateUserDto) {
    return this.repo.insert({
      username: createUserDto.username,
      passwordHash: await bcrypt.hash(createUserDto.password, 10),
      name: createUserDto.name,
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const update: Partial<UnsafeUser> = {};
    if (updateUserDto.username) update.username = updateUserDto.username;
    if (updateUserDto.password) update.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
    if (updateUserDto.name) update.name = updateUserDto.name;
    return this.repo.update({ id }, update);
  }
}
