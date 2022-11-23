import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
  ) {}

  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository
      .save(this.usersRepository.create(createUserDto))
      .then((u: User) => {
        const userCreatedEvent = new UserCreatedEvent();
        userCreatedEvent.userId = u.id;
        userCreatedEvent.payload = u;

        this.eventEmitter.emit('user.created', userCreatedEvent);

        return u;
      });

    return user;
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

  findByEmail(email: string) {
    return this.usersRepository.findOneBy({
      email,
    });
  }

  findForSignInExposedPW(email: string) {
    const user = this.usersRepository
      .createQueryBuilder()
      .select('User.id')
      .addSelect('User.password')
      .addSelect('User.email')
      .where('User.email = :email', { email })
      .getOne();

    return user;
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
