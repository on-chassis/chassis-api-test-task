import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { User } from 'src/users/entities/user.entity';
import { JwtPayloadDto } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
  }

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.usersService.findOneBy({ username });
    if (user && await this.usersService.checkPassword(username, password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayloadDto = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
