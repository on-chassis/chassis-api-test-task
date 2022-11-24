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

export class CreateQuestionDto {
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @IsUUID()
  @Validate(EntityExistsConstraint, ['Section'], {
    message: 'Section Not Found',
  })
  @Validate(
    OwnerValidConstraint,
    [
      {
        repository: 'Section',
        property: 'pollId',
      },
      {
        repository: 'Poll',
        property: 'userId',
      },
    ] as EntityCheckNode[],
    {
      message: 'Entity owner invalid',
    },
  )
  sectionId?: string;

  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
