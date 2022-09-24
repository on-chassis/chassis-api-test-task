import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePollDTO {
  constructor(section: string, questions: Array<string>) {
    this.section = section;
    this.questions = questions;
  }

  @IsNotEmpty()
  @IsString()
  section: string;

  @IsNotEmpty()
  @IsString({ each: true })
  questions: Array<string>;
}
