import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Poll, PollSection, PollQuestion } from './entities/poll.entity';
import { User } from '../users/entities/user.entity'
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [PollsController],
  imports: [TypeOrmModule.forFeature([Poll, PollSection, PollQuestion, User])],
  providers: [PollsService, UsersService]
})
export class PollsModule {}
