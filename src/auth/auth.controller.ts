import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/users/users.entity';

import { CreateUserDTO } from '../users/DTO/createUser.dto';
import { AuthService } from './auth.service';
import { SignInResponse } from './auth.types';
import { CredentialsDTO } from './DTO/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() user: CreateUserDTO): Promise<User> {
    return await this.authService.signUp(user);
  }

  @Post('sign-in')
  async signIn(@Body() credentials: CredentialsDTO): Promise<SignInResponse> {
    return await this.authService.signIn(credentials);
  }
}
