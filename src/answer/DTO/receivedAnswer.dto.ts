import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

import { Answer } from '../answer.type';

export class ReceivedAnswerDTO {
  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    type: 'Array of answer objects',
    example: [
      {
        questionId: 37,
        text: 'APPLE LTD',
      },
      {
        questionId: 38,
        text: '$250.000',
      },
    ],
  })
  answers: Array<Answer>;
}
