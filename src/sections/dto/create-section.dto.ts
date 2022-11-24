import { Transform } from 'class-transformer';
import {
  IsOptional,
  IsNotEmpty,
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

  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
