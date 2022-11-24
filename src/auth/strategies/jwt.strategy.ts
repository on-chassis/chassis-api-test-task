import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthUser, UserStorage } from 'src/storage/user.storage';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('auth.secret'),
    });
  }

  async validate(payload: any): Promise<AuthUser> {
    // TODO: Better to provide User object here by connecting dataSource and repo
    const user = { id: payload.id };

    UserStorage.set(user);

    return user;
  }
}
