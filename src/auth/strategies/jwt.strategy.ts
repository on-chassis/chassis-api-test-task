import { RequestContext } from '@medibloc/nestjs-request-context';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppContext, AuthUser } from 'src/app.context';

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

    const ctx: AppContext = RequestContext.get();
    ctx.user = user;

    return user;
  }
}
