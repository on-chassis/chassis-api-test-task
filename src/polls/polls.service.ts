import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
  ) {}

  create(createPollDto: CreatePollDto) {
    return this.pollsRepository.save(
      this.pollsRepository.create(createPollDto),
    );
  }

  findMany(where: FindOptionsWhere<Poll>) {
    return this.pollsRepository.find({
      where,
    });
  }

  findAll() {
    return this.pollsRepository.find();
  }

  findById(id: string) {
    return this.pollsRepository.findOneBy({
      id,
    });
  }

  update(id: string, updatePollDto: UpdatePollDto) {
    return this.pollsRepository.save(
      this.pollsRepository.create({
        id,
        ...updatePollDto,
      }),
    );
  }

  remove(id: string) {
    return this.pollsRepository.delete(id);
  }
}
