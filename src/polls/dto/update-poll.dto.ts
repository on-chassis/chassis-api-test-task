import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, MinLength, IsBoolean } from 'class-validator';

import { CreatePollDto } from './create-poll.dto';

export class UpdatePollDto extends PartialType(CreatePollDto) {
  @ApiProperty({ example: 'Some name' })
  @IsOptional()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name?: string;

  @ApiProperty({ example: 'Some description' })
  @IsOptional()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description?: string;

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  nonPublic?: boolean;
}
