import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

import { User } from './users.entity';
import {
  checkIfUserInteractsWithHisProfile,
  checkIfDataIsEmpty,
} from './users.helpers';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getUser(@Param('id') id: string, @Req() req: any): Promise<User> {
    checkIfUserInteractsWithHisProfile(req.userId, id);

    return await this.usersService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async updateUser(
    @Param('id') id: string,
    @Body() userDetails: Partial<User>,
    @Req() req: any,
  ): Promise<void> {
    checkIfUserInteractsWithHisProfile(req.userId, id);
    checkIfDataIsEmpty(userDetails);

    await this.usersService.update(id, userDetails);
  }
}
