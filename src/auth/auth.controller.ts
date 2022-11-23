import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Controller('auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('sign-in')
  public async signIn(@Body() signInDto: SignInDto) {
    return this.service.signIn(signInDto);
  }

  @Post('sign-up')
  public async signUp(@Body() signUpDto: SignUpDto) {
    return this.service.signUp(signUpDto);
  }
}
