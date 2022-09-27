import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PollController } from './poll.controller';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';
import { Question } from './question.entity';
import { Section } from './section.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Question, Section])],
  controllers: [PollController],
  providers: [PollService, JwtService],
})
export class PollModule {}
