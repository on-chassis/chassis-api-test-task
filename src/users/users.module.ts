import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { PollsService } from '../polls/polls.service';

import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Poll, PollQuestion, PollSection } from '../polls/entities/poll.entity';
import { PollRespondent, PollRespondentAnswers } from '../polls/entities/answers.entity';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Poll, PollSection, PollQuestion, PollRespondent,PollRespondentAnswers])],
  providers: [UsersService, PollsService],
  exports: [UsersService],
})
export class UsersModule {}