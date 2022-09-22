import { ForbiddenException } from '@nestjs/common';

import { User } from './users.entity';

export const checkIfUserInteractsWithHisProfile = (
  userId: string,
  id: string,
): void => {
  if (userId !== id) {
    throw new ForbiddenException("You cannot modify other user's data!");
  }
};

export const checkIfDataIsEmpty = (data: Partial<User>): void => {
  if (!data || !Object.keys(data).length) {
    throw new ForbiddenException('Updatable data is empty!');
  }
};
