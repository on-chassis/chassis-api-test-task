import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUserDto } from './dto/find-user.dto';

import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) { }

  async findOneBy(user: FindUserDto): Promise<Express.User | undefined> {
    const entity = await this.repo.findOne(user);
    if (entity) {
      return {
        id: entity.id,
        username: entity.username,
        name: entity.name,
      }
    }
  }

  async checkPassword(username: string, password: string): Promise<Boolean> {
    const user = await this.repo.createQueryBuilder("user").addSelect('user.passwordHash').where("user.username = :username", { username }).getOneOrFail();
    return user.checkPassword(password);
  }

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.username = createUserDto.username;
    user.name = createUserDto.name;
    await user.setPassword(createUserDto.password);
    return this.repo.insert(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOneOrFail({ id });
    if (updateUserDto.username) user.username = updateUserDto.username;
    if (updateUserDto.password) await user.setPassword(updateUserDto.password);
    if (updateUserDto.name) user.name = updateUserDto.name;
    return this.repo.update({ id }, user);
  }
}
