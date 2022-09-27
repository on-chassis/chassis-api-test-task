import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/poll/question.entity';
import { Section } from 'src/poll/section.entity';

import { Poll } from '../poll/poll.entity';
import { PollModule } from '../poll/poll.module';
import { PollService } from '../poll/poll.service';
import { AnswerController } from './answer.controller';
import { Answer } from './answer.entity';
import { AnswerService } from './answer.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Answer, Poll, Section, Question]),
    PollModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService, PollService],
})
export class AnswerModule {}
