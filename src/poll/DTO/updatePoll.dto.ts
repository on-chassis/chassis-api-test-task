import { IsBoolean, IsObject, IsOptional, IsString } from 'class-validator';

export class UpdatePollDTO {
  constructor(
    section?: string,
    questions?: Array<string>,
    isPublic?: boolean,
    user?: { id: number },
  ) {
    if (section) {
      this.section = section;
    }
    if (questions?.length) {
      this.questions = questions;
    }
    if (isPublic !== undefined) {
      this.isPublic = isPublic;
    }
    if (isPublic) {
      this.user = { id: null };
    } else if (user?.id) {
      this.user = user;
    }
  }

  @IsOptional()
  @IsString()
  section: string;

  @IsOptional()
  @IsString({ each: true })
  questions: Array<string>;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsObject()
  user: { id: number };
}
