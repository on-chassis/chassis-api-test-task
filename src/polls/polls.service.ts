import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePollDto } from './dto/create-poll.dto';
import { Poll, PollSection, PollQuestion } from './entities/poll.entity';
import { UpdatePollDto } from './dto/update-poll.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll) private readonly pollRepo: Repository<Poll>,
    @InjectRepository(PollSection) private readonly pollSectionsRepo: Repository<PollSection>,
    @InjectRepository(PollQuestion) private readonly pollQuestionsRepo: Repository<PollQuestion>,
  ) { }

  async create(createPollDto: CreatePollDto, creator: User) {
    const poll = new Poll();
    poll._default = 0;
    poll._public = 0;
    poll.setCreator(creator);
    poll.title = createPollDto.title;
    const pollResult = await this.pollRepo.insert(poll);
    const pollId: string = pollResult.generatedMaps[0].id;
    const pollModel = await this.pollRepo.findOneOrFail({ id: pollId });
    for (let i = 0; i < createPollDto.sections.length; i++) {
      const section = new PollSection();
      section.poll = pollModel;
      section.orderNumber = i;
      section.title = createPollDto.sections[i].title;
      const sectionResult = await this.pollSectionsRepo.insert(section);
      const sectionId: string = sectionResult.generatedMaps[0].id;
      const sectionModel = await this.pollSectionsRepo.findOneOrFail({ id: sectionId });
      for (let j = 0; j < createPollDto.sections[i].questions.length; j++) {
        const question = new PollQuestion();
        question.section = sectionModel;
        question.orderNumber = j;
        question.text = createPollDto.sections[i].questions[j].text;
        await this.pollQuestionsRepo.insert(question);
      }
    }

    return this.pollRepo.findOne({ id: pollId }, {
      relations: ['creator', 'sections', 'sections.questions']
    });
  }

  async findAll(owner: User) {
    const result = await this.pollRepo.find({ creator: owner, child: null });
    return result;
  }

  findOne(id: number) {
    return `This action returns a #${id} poll`;
  }

  async update(id: string, createPollDto: CreatePollDto, creator: User) {
    const poll = await this.pollRepo.findOneOrFail({ id });
    poll.title = createPollDto.title;
    await this.pollRepo.update({ id }, poll);
    const pollModel = await this.pollRepo.findOneOrFail({ id });
    for (let i = 0; i < createPollDto.sections.length; i++) {
      await this.pollSectionsRepo.delete({ poll: pollModel });
      const section = new PollSection();
      section.poll = pollModel;
      section.orderNumber = i;
      section.title = createPollDto.sections[i].title;
      const sectionResult = await this.pollSectionsRepo.insert(section);
      const sectionId: string = sectionResult.generatedMaps[0].id;
      const sectionModel = await this.pollSectionsRepo.findOneOrFail({ id: sectionId });
      for (let j = 0; j < createPollDto.sections[i].questions.length; j++) {
        const question = new PollQuestion();
        question.section = sectionModel;
        question.orderNumber = j;
        question.text = createPollDto.sections[i].questions[j].text;
        await this.pollQuestionsRepo.insert(question);
      }
    }
    return this.pollRepo.findOne({ id }, {
      relations: ['creator', 'sections', 'sections.questions']
    });
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
