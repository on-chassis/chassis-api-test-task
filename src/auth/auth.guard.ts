import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

import { jwtConstants } from '../constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    const { authorization } = request.headers;
    const token = authorization?.split('Bearer ')[1];

    return this.authorize(request, token);
  }

  async authorize(request: any, token: string): Promise<boolean> {
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const jwtVerified = this.jwtService.verify(token, {
        secret: jwtConstants.secret,
      });
      request.userId = jwtVerified.sub;
      return true;
    } catch (e) {
      throw new UnauthorizedException('Token expired. Please sign in again.');
    }
  }
}
