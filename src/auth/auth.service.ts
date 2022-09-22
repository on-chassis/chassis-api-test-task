import { createHash } from 'crypto';

import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/users.entity';

import { CreateUserDTO } from '../users/DTO/createUser.dto';
import { UsersService } from '../users/users.service';
import { SignInResponse } from './auth.types';
import { CredentialsDTO } from './DTO/credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(userDetails: CreateUserDTO): Promise<User> {
    const userExists = await this.usersService.findOne({
      email: userDetails.email,
    });
    if (userExists) {
      throw new ForbiddenException('User with that email already exists!');
    }
    return await this.usersService.create(userDetails);
  }

  async signIn(credentials: CredentialsDTO): Promise<SignInResponse> {
    const passwordHash = createHash('md5')
      .update(credentials.password)
      .digest('hex');

    try {
      const user = await this.usersService.findOne({
        email: credentials.email,
        password: passwordHash,
      });

      const payload = { username: user.email, sub: user.id };
      return {
        accessToken: this.jwtService.sign(payload),
        expiresIn: '60m',
      };
    } catch (e) {
      throw new Error('email or password is not correct!');
    }
  }
}
