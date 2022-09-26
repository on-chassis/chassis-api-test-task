import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { UsersService } from './users.service';


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('user')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('user')
  select(@Request() req: Express.AuthenticatedRequest) {
    return this.usersService.findOneBy(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('user')
  update(@Request() req: Express.AuthenticatedRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, updateUserDto);
  }
}
