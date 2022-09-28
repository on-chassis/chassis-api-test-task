import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePollDto } from './dto/create-poll.dto';
import { Poll, PollSection, PollQuestion } from './entities/poll.entity';
import { UpdatePollDto } from './dto/update-poll.dto';
import { User } from '../users/entities/user.entity';
import * as _ from 'lodash';
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

  async update(id: string, updatePollDto: UpdatePollDto, creator: User) {
    const poll = await this.pollRepo.findOneOrFail({ where: { id }, relations: ['creator', 'sections', 'sections.questions'] });
    if (poll._public) {
      const oldPollData = this.sanitize(poll);
      const newPoll = await this.create(oldPollData, creator);
      await this.unsafePollUpdate(newPoll.id, updatePollDto);
      await this.changePollPublic(newPoll.id, 1);
      await this.overwrite(id, newPoll.id);
      return this.pollRepo.findOne({ id: newPoll.id }, {
        relations: ['creator', 'sections', 'sections.questions']
      });
    } else {
      await this.unsafePollUpdate(id, updatePollDto);
      return this.pollRepo.findOne({ id }, {
        relations: ['creator', 'sections', 'sections.questions']
      });
    }
  }

  private async overwrite(originalPollId: string, newPollVersionId: string) {
    const newPollVersion = await this.pollRepo.findOneOrFail({ where: { id: newPollVersionId } });
    await this.pollRepo.update({ id: originalPollId }, { child: newPollVersion });
  }

  async checkOwnership(id: string, user: User) {
    await this.pollRepo.findOneOrFail({ where: { id, creator:user } });
  }

  private async unsafePollUpdate(id: string, updatePollDto: UpdatePollDto) {
    const poll = await this.pollRepo.findOneOrFail({ id });
    poll.title = updatePollDto.title || poll.title;
    await this.pollRepo.update({ id }, poll);
    const pollModel = await this.pollRepo.findOneOrFail({ id });
    for (let i = 0; i < updatePollDto.sections.length; i++) {
      await this.pollSectionsRepo.delete({ poll: pollModel });
      const section = new PollSection();
      section.poll = pollModel;
      section.orderNumber = i;
      section.title = updatePollDto.sections[i].title || poll.sections[i].title;
      const sectionResult = await this.pollSectionsRepo.insert(section);
      const sectionId: string = sectionResult.generatedMaps[0].id;
      const sectionModel = await this.pollSectionsRepo.findOneOrFail({ id: sectionId });
      for (let j = 0; j < updatePollDto.sections[i].questions.length; j++) {
        const question = new PollQuestion();
        question.section = sectionModel;
        question.orderNumber = j;
        question.text = updatePollDto.sections[i].questions[j].text || poll.sections[i].questions[j].text;
        await this.pollQuestionsRepo.insert(question);
      }
    }
    return this.pollRepo.findOne({ id }, {
      relations: ['creator', 'sections', 'sections.questions']
    });
  }

  async prepopulateDefaultPolls(user: User) {
    const defaultPolls = await this.pollRepo.find({ where: { _default: 1 }, relations: ['creator', 'sections', 'sections.questions'] });
    for (let i = 0; i < defaultPolls.length; i++) {
      const poll = this.sanitize(defaultPolls[i]);
      const newPoll = await this.create(poll, user);
      if (newPoll._public != defaultPolls[i]._public) {
        await this.changePollPublic(newPoll.id, defaultPolls[i]._public);
      }
    }
  }

  async changePollPublic(id: string, _public: number) {
    await this.pollRepo.update({ id }, { _public });

    return this.pollRepo.findOne({ id }, {
      relations: ['creator', 'sections', 'sections.questions']
    });
  }

  sanitize(poll: Poll): CreatePollDto {
    return {
      title: poll.title,
      sections: poll.sections.map((section) => ({
        title: section.title,
        questions: section.questions.map((question) => ({
          text: question.text,
        }))
      }))
    };
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }
}
