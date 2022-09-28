import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Poll, PollSection, PollQuestion } from './entities/poll.entity';
import { User } from '../users/entities/user.entity'
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { UsersService } from '../users/users.service';
import { PollRespondent, PollRespondentAnswers } from './entities/answers.entity';

@Module({
  controllers: [PollsController],
  imports: [TypeOrmModule.forFeature([Poll, PollSection, PollQuestion, User, PollRespondent, PollRespondentAnswers])],
  providers: [PollsService, UsersService]
})
export class PollsModule {}
