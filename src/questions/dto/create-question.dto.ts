import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Some name' })
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'Some UUID' })
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

  @ApiProperty({ example: '0' })
  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
