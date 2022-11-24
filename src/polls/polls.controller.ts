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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthUser } from 'src/app.context';
import { AllowAny } from 'src/decorators/allow-all.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';

import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { PollsService } from './polls.service';

@ApiTags('POLLS')
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @ApiOperation({ summary: 'Add new poll' })
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() createPollDto: CreatePollDto) {
    return this.pollsService.create(createPollDto, user.id);
  }

  @ApiOperation({ summary: 'Get all polls' })
  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @ApiOperation({ summary: 'Get polls by user ID' })
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

  @ApiOperation({ summary: 'Get polls by user ID with relations' })
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

  @ApiOperation({ summary: 'Get poll by ID' })
  @AllowAny()
  @Get(':id')
  findById(
    @CurrentUser() user: AuthUser,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (user?.id) {
      return this.pollsService.findById(id);
    }

    return this.pollsService.findPublicById(id);
  }

  @ApiOperation({ summary: 'Update poll by ID' })
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(id, updatePollDto);
  }

  @ApiOperation({ summary: 'Delete poll by ID' })
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.pollsService.remove(id);
  }
}
