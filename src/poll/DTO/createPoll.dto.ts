import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

import { Section } from '../poll.types';

export class CreatePollDTO {
  constructor(sections: Array<Section>) {
    this.sections = sections;
  }

  @IsNotEmpty()
  @IsObject({ each: true })
  @ApiProperty({
    isArray: true,
    example: [
      {
        name: 'Personal',
        questions: ['name?', 'age?'],
      },
      {
        name: 'Company',
        questions: ['company name?', 'salary?'],
      },
    ],
  })
  sections: Array<Section>;
}
