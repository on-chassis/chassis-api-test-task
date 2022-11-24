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

export class CreateSectionDto {
  @ApiProperty({ example: 'Some name' })
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @ApiProperty({ example: 'Some description' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description?: string;

  @ApiProperty({ example: 'Some UUID' })
  @IsOptional()
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
  @IsUUID()
  pollId?: string;

  @ApiProperty({ example: '0' })
  @IsOptional()
  @IsNumber()
  orderBy?: number;
}
