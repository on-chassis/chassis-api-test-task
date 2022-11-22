import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create(createUserDto),
    );
  }

  findMany(where: FindOptionsWhere<User>) {
    return this.usersRepository.find({
      where,
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findById(id: string) {
    return this.usersRepository.findOneBy({
      id,
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.save(
      this.usersRepository.create({
        id,
        ...updateUserDto,
      }),
    );
  }

  remove(id: string) {
    return this.usersRepository.delete(id);
  }
}
