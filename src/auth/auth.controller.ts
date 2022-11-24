import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AllowAny } from 'src/decorators/allow-all.decorator';

import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('AUTH')
@Controller('auth')
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('sign-in')
  @AllowAny()
  @ApiOperation({ summary: 'Existing user sign-in' })
  public async signIn(@Body() signInDto: SignInDto) {
    return this.service.signIn(signInDto);
  }

  @Post('sign-up')
  @AllowAny()
  @ApiOperation({ summary: 'New user sign-up' })
  public async signUp(@Body() signUpDto: SignUpDto) {
    return this.service.signUp(signUpDto);
  }
}
