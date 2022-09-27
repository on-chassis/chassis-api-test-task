import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import { User } from 'src/users/users.entity';

import { CreateUserDTO } from '../users/DTO/createUser.dto';
import { AuthService } from './auth.service';
import { SignInResponse } from './auth.types';
import { CredentialsDTO } from './DTO/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Register new user' })
  @ApiSecurity('None', [])
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created user details',
  })
  async signUp(@Body() user: CreateUserDTO): Promise<User> {
    return await this.authService.signUp(user);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Sign-in user' })
  @ApiSecurity('None', [])
  @ApiResponse({
    status: 200,
    description: 'Returns "accessToken" and "expiresIn" properties',
  })
  async signIn(@Body() credentials: CredentialsDTO): Promise<SignInResponse> {
    return await this.authService.signIn(credentials);
  }
}
