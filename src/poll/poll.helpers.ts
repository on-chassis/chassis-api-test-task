import { NotFoundException } from '@nestjs/common';

import { Poll } from './poll.entity';

export const checkPollExistanceAndAccess = async (
  poll: Poll,
  pollId: string,
  userId: string,
): Promise<void> => {
  if (!poll || (!poll.isPublic && poll.user?.toString() !== userId)) {
    throw new NotFoundException(`Poll with id ${pollId} doesn't exist!`);
  }
};
