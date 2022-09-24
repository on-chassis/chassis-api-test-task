import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreatePollDTO } from './DTO/createPoll.dto';
import { UpdatePollDTO } from './DTO/updatePoll.dto';
import { Poll } from './poll.entity';
import { checkPollExistanceAndAccess } from './poll.helpers';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private pollsRepository: Repository<Poll>,
  ) {}

  async find(userId: string = null): Promise<Poll[]> {
    const criteria: any = { isPublic: true };
    if (userId) {
      criteria.isPublic = false;
      criteria.user = { id: userId };
    }
    const polls = await this.pollsRepository.find({
      loadRelationIds: true,
      where: criteria,
    });

    return polls.filter(
      (poll: Poll) => poll.isPublic || poll.user.toString() === userId,
    );
  }

  async findOne(id: string, userId: string): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      loadRelationIds: true,
      where: { id },
    });
    checkPollExistanceAndAccess(poll, id, userId);

    return poll;
  }

  async createPoll(pollData: CreatePollDTO, userId: string): Promise<Poll> {
    const cleanData = {
      ...pollData,
      user: { id: parseInt(userId) },
    };

    try {
      const poll = await this.pollsRepository.save(cleanData);
      return poll;
    } catch (e) {
      throw new ForbiddenException(
        'Something went wrong. Please try again later.',
      );
    }
  }

  async updatePoll(
    id: string,
    details: UpdatePollDTO,
    userId: string,
  ): Promise<Poll | void> {
    try {
      const poll = await this.findOne(id, userId);

      const cleanData = new UpdatePollDTO(
        details.section,
        details.questions,
        details.isPublic,
      );

      if (poll.isPublic) {
        const newPollData = new CreatePollDTO(
          details.section || poll.section,
          details.questions || poll.questions,
        );
        return await this.createPoll(newPollData as CreatePollDTO, userId);
      }

      await this.pollsRepository.update(id, cleanData);
    } catch (e: any) {
      throw new ForbiddenException(e?.message);
    }
  }
}
