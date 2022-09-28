import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { PollsService } from '../polls/polls.service';

import { UsersController } from './users.controller';

import { User } from './entities/user.entity';
import { Poll, PollQuestion, PollSection } from '../polls/entities/poll.entity';

@Module({
  controllers: [UsersController],
  imports: [TypeOrmModule.forFeature([User, Poll, PollSection, PollQuestion])],
  providers: [UsersService, PollsService],
  exports: [UsersService],
})
export class UsersModule {}