import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { EntityExistsConstraint } from 'src/validators/entity-exists.validator';

import { CreatePollDto } from './create-poll.dto';

export class CreatePollWithUserDto extends CreatePollDto {
  @IsNotEmpty()
  @IsUUID()
  @Validate(EntityExistsConstraint, ['User'], {
    message: 'User Not Found',
  })
  userId: string;
}
