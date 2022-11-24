import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AuthUser } from 'src/app.context';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err: Error, user: any, info: Error, context: ExecutionContext) {
    const allowAny = this.reflector.get<string[]>(
      'allow-any',
      context.getHandler(),
    );

    if (user as AuthUser) {
      return user;
    }

    if (allowAny) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
