import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { UniqueConstraint } from 'src/validators/unique.validator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  @Validate(UniqueConstraint, ['User'], {
    message: 'Email Already Exists',
  })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @Transform(({ value }) => value.trim())
  password: string;
}
