import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
  MinLength,
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreateSectionDto {
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description?: string;

  @IsOptional()
  @IsUUID()
  pollId?: string;

  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
