import { createHash } from 'crypto';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDTO } from './DTO/createUser.dto';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOne(criteria: unknown): Promise<User> {
    const user = await this.usersRepository.findOne({ where: criteria });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  async create(user: CreateUserDTO): Promise<any> {
    user.password = createHash('md5').update(user.password).digest('hex');

    const result = await this.usersRepository.save(user);

    delete result.password;
    return result;
  }

  async update(id: string, details: Partial<User>): Promise<void> {
    if (details.password) {
      details.password = createHash('md5')
        .update(details.password)
        .digest('hex');
    }

    try {
      const user = await this.usersRepository.findOne(id);
      if (!user) {
        throw new NotFoundException(`User with id ${id} doesn't exist!`);
      }
      await this.usersRepository.update(id, details);
    } catch (e: any) {
      throw new ForbiddenException(e?.message);
    }
  }
}
