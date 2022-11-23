import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

import { User } from '../users/entities/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ token: string; user: User }> {
    const user = await this.usersService.findForSignInExposedPW(
      signInDto.email,
    );

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    delete user.password;

    if (isValidPassword) {
      const token = await this.jwtService.sign({
        id: user.id,
      });

      return { token, user };
    }

    throw new UnauthorizedException();
  }

  async signUp(signUpDto: SignUpDto): Promise<void> {
    await this.usersService.create(signUpDto);
  }
}
