import { IsNotEmpty, IsUUID } from 'class-validator';

import { CreatePollDto } from './create-poll.dto';

export class CreatePollWithUserDto extends CreatePollDto {
  @IsNotEmpty()
  @IsUUID()
  userId: string;
}
