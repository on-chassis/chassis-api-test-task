import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

import { Section } from '../poll.types';

export class UpdatePollDTO {
  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    type: 'Array of section objects',
    example: [
      {
        id: '22',
        name: 'Personal',
        questions: [
          {
            id: '35',
            text: 'name?',
          },
          {
            id: '36',
            text: 'age?',
          },
        ],
      },
      {
        id: '23',
        name: 'Company',
        questions: [
          {
            id: '37',
            text: 'company name?',
          },
          {
            id: '38',
            text: 'salary?',
          },
        ],
      },
    ],
  })
  sections: Array<Section>;
}
