import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @IsUUID()
  sectionId?: string;

  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
