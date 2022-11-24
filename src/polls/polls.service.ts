import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateQuestionDto } from 'src/questions/dto/create-question.dto';
import { QuestionsService } from 'src/questions/questions.service';
import { CreateSectionDto } from 'src/sections/dto/create-section.dto';
import { Section } from 'src/sections/entities/section.entity';
import { SectionsService } from 'src/sections/sections.service';
import { UserCreatedEvent } from 'src/users/events/user-created.event';
import { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { CreatePollWithUserDto } from './dto/create-poll-with-user.dto';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
    private sectionsService: SectionsService,
    private questionsService: QuestionsService,
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

  findAllByUserId(userId: string, full = false) {
    return this.pollsRepository.find({
      where: {
        userId,
      },
      relations: (full && ['sections', 'sections.questions']) || [],
    });
  }

  findPublicByUserId(userId: string, full = false) {
    return this.pollsRepository.find({
      where: {
        userId,
        nonPublic: false,
      },
      relations: (full && ['sections', 'sections.questions']) || [],
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

  @OnEvent('user.created')
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    // handle and process "UserCreatedEvent" event

    // TODO: Implement transactions: https://docs.nestjs.com/techniques/database#typeorm-transactions
    const newPoll: CreatePollWithUserDto = {
      name: `Poll #1: ${event.payload.email}`,
      nonPublic: false,
      userId: event.userId,
    };

    const poll: Poll = await this.create(newPoll);

    const sections: { name: string; orderBy: number; questions: string[] }[] = [
      {
        name: 'Company info',
        orderBy: 1,
        questions: [
          "What's your company name?",
          'How many people in a company?',
        ],
      },
      {
        name: 'Personal info',
        orderBy: 2,
        questions: ['What is your name?', 'How old are you?'],
      },
    ];

    for (const s of sections) {
      const newSection: CreateSectionDto = {
        name: s.name,
        pollId: poll.id,
        orderBy: s.orderBy,
      };

      const section: Section = await this.sectionsService.create(newSection);

      for (const orderBy in s.questions) {
        const newQuestion: CreateQuestionDto = {
          name: s.questions[orderBy],
          sectionId: section.id,
          orderBy: +orderBy + 1,
        };

        await this.questionsService.create(newQuestion);
      }
    }
  }
}
