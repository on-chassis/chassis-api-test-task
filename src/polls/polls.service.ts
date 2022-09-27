import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePollDto } from './dto/create-poll.dto';
import { Poll, PollSection, PollQuestion } from './entities/poll.entity';
import { UpdatePollDto } from './dto/update-poll.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PollsService {
  constructor(@InjectRepository(Poll) private readonly repo: Repository<Poll>) { }

  async create(createPollDto: CreatePollDto, creator: User) {
    const poll = new Poll();
    poll.default = false;
    poll.public = false;
    poll.setCreator(creator);
    poll.sections = [];
    for (let i = 0; i < createPollDto.sections.length; i++) {
      const section = new PollSection();
      section.orderNumber = i;
      section.title = createPollDto.sections[i].title;
      section.questions = [];
      for (let j = 0; j < createPollDto.sections[i].questions.length; j++) {
        const question = new PollQuestion();
        question.orderNumber = j;
        question.text = createPollDto.sections[i].questions[j].text;
        section.questions.push(question);
      }
      poll.sections.push(section)
    }
    await this.repo.insert(poll);
  }

  findAll() {
    return `This action returns all polls`;
  }

  findOne(id: number) {
    return `This action returns a #${id} poll`;
  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
