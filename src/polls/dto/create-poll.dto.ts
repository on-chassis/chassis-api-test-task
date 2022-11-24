import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreatePollDto {
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

  @ApiProperty({ example: false })
  @IsOptional()
  @IsBoolean()
  nonPublic?: boolean;
}
