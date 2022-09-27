import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Poll } from '../poll/poll.entity';
import { Answer } from './answer.entity';
import { ReceivedAnswerDTO } from './DTO/receivedAnswer.dto';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(Answer)
    private answersRepository: Repository<Answer>,
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
  ) {}

  async saveAnswers(data: ReceivedAnswerDTO): Promise<void> {
    const answersData = data.answers.map((answer) => {
      return {
        answer: answer.text,
        question: { id: answer.questionId },
      };
    });

    try {
      await this.answersRepository.save(answersData);
    } catch (e) {
      throw new ForbiddenException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async find(pollId: number): Promise<Poll> {
    try {
      const poll = await this.pollsRepository
        .createQueryBuilder('poll')
        .innerJoin('poll.sections', 'section', 'section.pollId = poll.id')
        .innerJoin(
          'section.questions',
          'question',
          'question.sectionId = section.id',
        )
        .innerJoin(
          'question.answers',
          'answer',
          'answer.questionId = question.id',
        )
        .select(['poll', 'section', 'question', 'answer'])
        .where({ id: pollId, isPublic: true })
        .getOne();

      if (!poll) {
        throw new NotFoundException(
          `Answers for the poll with id ${pollId} were not found!`,
        );
      }
      return poll;
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw e;
      }
      throw new ForbiddenException(
        'Something went wrong. Please try again later.',
      );
    }
  }
}
