import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, Validate } from 'class-validator';
import { EntityExistsConstraint } from 'src/validators/entity-exists.validator';

import { CreatePollDto } from './create-poll.dto';

export class CreatePollWithUserDto extends CreatePollDto {
  @ApiProperty({ example: 'Some UUID' })
  @IsNotEmpty()
  @IsUUID()
  @Validate(EntityExistsConstraint, ['User'], {
    message: 'User Not Found',
  })
  userId: string;
}
