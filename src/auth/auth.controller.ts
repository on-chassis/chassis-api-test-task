import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService, 
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: Express.AuthenticatedRequest) {
    return this.authService.login(req.user);
  }
}
