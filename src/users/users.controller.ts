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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

import { UpdateUserDTO } from './DTO/updateUser.dto';
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
  @ApiOperation({ summary: "Get signed-in user's profile" })
  @ApiResponse({ status: 200, description: "Get signed-in user's profile" })
  async getUser(@Param('id') id: string, @Req() req: any): Promise<User> {
    checkIfUserInteractsWithHisProfile(req.userId, id);

    return await this.usersService.findOne({ id });
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({
    status: 204,
    description: 'Update user details (including password)',
  })
  @HttpCode(204)
  async updateUser(
    @Param('id') id: string,
    @Body() userDetails: UpdateUserDTO,
    @Req() req: any,
  ): Promise<void> {
    checkIfUserInteractsWithHisProfile(req.userId, id);
    checkIfDataIsEmpty(userDetails);

    await this.usersService.update(id, userDetails);
  }
}
