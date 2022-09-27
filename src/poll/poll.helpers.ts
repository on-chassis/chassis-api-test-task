import { ForbiddenException } from '@nestjs/common';

import { CreatePollDTO } from './DTO/createPoll.dto';

export const validatePollData = (
  pollData: CreatePollDTO,
  isUpdate = false,
): void => {
  if (!pollData.sections?.length) {
    throw new ForbiddenException('Minimum 1 section is required!');
  }
  for (let i = 0; i < pollData.sections.length; i++) {
    if (!pollData.sections[i].name) {
      throw new ForbiddenException('Every section must have a name!');
    }
    if (isUpdate && !pollData.sections[i].id) {
      throw new ForbiddenException(
        '"id" property for every section is required!',
      );
    }
    if (!pollData.sections[i].questions?.length) {
      throw new ForbiddenException(
        'Minimum 1 question is required per section!',
      );
    }
  }
};
