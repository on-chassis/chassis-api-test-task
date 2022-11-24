import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/auth/strategies/jwt.strategy';
import { AllowAny } from 'src/decorators/allow-all.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';

import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';

@ApiTags('POLLS')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  create(@Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get('user/:userId')
  @AllowAny()
  findAllByUser(
    @CurrentUser() user: AuthUser,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    if (user?.id) {
      return this.pollsService.findAllByUserId(userId);
    }

    return this.pollsService.findPublicByUserId(userId);
  }

  @Get('user/:userId/full')
  @AllowAny()
  findAllByUserWithRelations(
    @CurrentUser() user: AuthUser,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ) {
    if (user?.id) {
      return this.pollsService.findAllByUserId(userId, true);
    }

    return this.pollsService.findPublicByUserId(userId, true);
  }

  @Get(':id')
  findById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pollsService.findById(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pollsService.remove(id);
  }
}
