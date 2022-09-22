import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/users.entity';

import { UsersController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, UsersService, JwtService],
  controllers: [AuthController, UsersController],
})
export class AuthModule {}
