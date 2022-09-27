import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreatePollDTO } from './DTO/createPoll.dto';
import { UpdatePollDTO } from './DTO/updatePoll.dto';
import { Poll } from './poll.entity';
import { SectionDbData, QuestionDbData } from './poll.types';
import { Question } from './question.entity';
import { Section } from './section.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async find(userId: string = null): Promise<Poll[]> {
    const criteria: any = { isPublic: true };
    if (userId) {
      criteria.isPublic = false;
      criteria.user = { id: userId };
    }
    const polls = await this.pollsRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.user', 'user', 'poll.user.id = user.id')
      .innerJoin('poll.sections', 'section', 'section.pollId = poll.id')
      .innerJoin(
        'section.questions',
        'question',
        'question.sectionId = section.id',
      )
      .select(['poll', 'section', 'question', 'user.id'])
      .where(criteria)
      .getMany();

    return polls.filter(
      (poll: Poll) => poll.isPublic || poll.user.id.toString() === userId,
    );
  }

  async findOne(id: number, userId: number): Promise<Poll> {
    const poll = await this.pollsRepository
      .createQueryBuilder('poll')
      .leftJoin('poll.user', 'user', 'poll.user.id = user.id')
      .innerJoin('poll.sections', 'section', 'section.pollId = poll.id')
      .innerJoin(
        'section.questions',
        'question',
        'question.sectionId = section.id',
      )
      .select(['poll', 'section', 'question', 'user.id'])
      .where({ id })
      .getOne();

    if (!poll || (!poll.isPublic && poll.user?.id !== userId)) {
      throw new NotFoundException(`Poll with id ${id} doesn't exist!`);
    }

    return poll;
  }

  async createQuestions(
    pollData: CreatePollDTO | UpdatePollDTO,
    sections: Array<Section>,
  ): Promise<void> {
    const questionsData: Array<QuestionDbData> = [];
    const createdSections: { [key: string]: number } = {};

    sections.forEach((section) => {
      createdSections[section.name] = section.id;
    });
    pollData.sections.forEach((section) => {
      section.questions.forEach((question) => {
        questionsData.push({
          section: { id: createdSections[section.name] },
          text: question,
        });
      });
    });
    await this.questionsRepository.save(questionsData);
  }

  async createPoll(pollData: CreatePollDTO, userId: number): Promise<Poll> {
    try {
      const poll = await this.pollsRepository.save({ user: { id: userId } });

      const sectionsData: Array<SectionDbData> = [];

      pollData.sections.forEach((sectionObj) => {
        sectionsData.push({ poll: { id: poll.id }, name: sectionObj.name });
      });

      const sections = await this.sectionsRepository.save(sectionsData);

      await this.createQuestions(pollData, sections);
      return poll;
    } catch (e) {
      throw new ForbiddenException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async updatePoll(
    id: number,
    pollData: UpdatePollDTO,
    userId: number,
  ): Promise<Poll | void> {
    try {
      const poll: Poll = await this.findOne(id, userId);
      if (poll.isPublic) {
        return await this.createPoll(pollData as CreatePollDTO, userId);
      }

      const sectionsData: Array<SectionDbData> = [];
      const questionsData: Array<QuestionDbData> = [];
      const sectionIds: Array<number> = [];

      pollData.sections.forEach((sectionObj) => {
        sectionIds.push(sectionObj.id);
        sectionsData.push({
          name: sectionObj.name,
          id: sectionObj.id,
        });
      });
      for (let i = 0; i < sectionsData.length; i++) {
        await this.sectionsRepository.update(sectionsData[i].id, {
          name: sectionsData[i].name,
        });
      }

      await this.questionsRepository.delete({
        section: { id: In(sectionIds) },
      });

      pollData.sections.forEach((section) => {
        section.questions.forEach((question) => {
          questionsData.push({
            section: { id: section.id },
            text: question,
          });
        });
      });

      await this.questionsRepository.save(questionsData);
    } catch (e: any) {
      throw new ForbiddenException(e?.message);
    }
  }

  async makePollAsPublic(pollId: number, userId: number): Promise<void> {
    try {
      const poll: Poll = await this.findOne(pollId, userId);
      if (!poll) {
        throw new ForbiddenException(`Poll with ${pollId} cannot be found!`);
      }

      await this.pollsRepository.update(pollId, {
        isPublic: true,
        user: { id: null },
      });
    } catch (e) {
      throw new ForbiddenException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
