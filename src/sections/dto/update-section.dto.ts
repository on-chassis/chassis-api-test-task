import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  MinLength,
  IsUUID,
  IsNumber,
  Validate,
} from 'class-validator';
import { EntityExistsConstraint } from 'src/validators/entity-exists.validator';

import { CreateSectionDto } from './create-section.dto';

export class UpdateSectionDto extends PartialType(CreateSectionDto) {
  @IsOptional()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name?: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description?: string;

  @IsOptional()
  @IsUUID()
  @Validate(EntityExistsConstraint, ['Poll'], {
    message: 'Poll Not Found',
  })
  pollId?: string;

  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
