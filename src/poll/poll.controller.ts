import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '../auth/auth.guard';
import { CreatePollDTO } from './DTO/createPoll.dto';
import { UpdatePollDTO } from './DTO/updatePoll.dto';
import { Poll } from './poll.entity';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() pollData: CreatePollDTO,
    @Req() req: any,
  ): Promise<Poll> {
    return await this.pollService.createPoll(pollData, req.userId);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() pollDetails: UpdatePollDTO,
    @Req() req: any,
  ) {
    await this.pollService.updatePoll(id, pollDetails, req.userId);
  }

  @Get('public')
  async getAllPublic(): Promise<Poll[]> {
    return await this.pollService.find();
  }

  @Get('private')
  @UseGuards(AuthGuard)
  async getAllPrivate(@Req() req: any): Promise<Poll[]> {
    return await this.pollService.find(req.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getOne(@Param('id') id: string, @Req() req: any): Promise<Poll> {
    return await this.pollService.findOne(id, req.userId);
  }
}
