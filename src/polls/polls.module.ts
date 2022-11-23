import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from 'src/questions/questions.module';
import { SectionsModule } from 'src/sections/sections.module';
import { EntityExistsConstraint } from 'src/validators/entity-exists.validator';

import { Poll } from './entities/poll.entity';
import { PollsController } from './polls.controller';
import { PollsService } from './polls.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll]), SectionsModule, QuestionsModule],
  controllers: [PollsController],
  providers: [PollsService, EntityExistsConstraint],
  exports: [PollsService],
})
export class PollsModule {}
