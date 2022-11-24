import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsOptional,
  MinLength,
  IsUUID,
  IsNumber,
  Validate,
} from 'class-validator';
import { EntityExistsConstraint } from 'src/validators/entity-exists.validator';
import {
  EntityCheckNode,
  OwnerValidConstraint,
} from 'src/validators/owner-valid.validator';

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
  @Validate(
    OwnerValidConstraint,
    [
      {
        repository: 'Poll',
        property: 'userId',
      },
    ] as EntityCheckNode[],
    {
      message: 'Entity owner invalid',
    },
  )
  pollId?: string;

  @ApiProperty({ example: '0' })
  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
