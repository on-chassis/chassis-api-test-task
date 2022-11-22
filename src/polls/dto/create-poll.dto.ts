import { Transform } from 'class-transformer';
import { IsNotEmpty, MinLength, IsBoolean, IsOptional } from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsOptional()
  @Transform(({ value }) => value.trim())
  @MinLength(3)
  description?: string;

  @IsOptional()
  @IsBoolean()
  nonPublic?: boolean;
}
