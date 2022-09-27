import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

import { AuthGuard } from '../auth/auth.guard';
import { CreatePollDTO } from './DTO/createPoll.dto';
import { UpdatePollDTO } from './DTO/updatePoll.dto';
import { Poll } from './poll.entity';
import { validatePollData } from './poll.helpers';
import { PollService } from './poll.service';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create new poll' })
  @ApiResponse({
    status: 200,
    description: 'Returns the newly created poll',
  })
  async create(
    @Body() pollData: CreatePollDTO,
    @Req() req: any,
  ): Promise<Poll> {
    validatePollData(pollData);
    return await this.pollService.createPoll(pollData, req.userId);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update poll (sections, questions)' })
  @ApiResponse({
    status: 200,
    description: 'Just returns simple text about succeeded update',
  })
  async update(
    @Param('id') id: number,
    @Body() pollData: UpdatePollDTO,
    @Req() req: any,
  ): Promise<string> {
    validatePollData(pollData, true);
    await this.pollService.updatePoll(id, pollData, req.userId);

    return 'Poll successfully updated!';
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Make poll public' })
  @ApiResponse({
    status: 200,
    description: 'Returns nothing other than status code',
  })
  async makePollPublic(
    @Param('id') id: number,
    @Req() req: any,
  ): Promise<void> {
    await this.pollService.makePollAsPublic(id, req.userId);
  }

  @Get('public')
  @ApiOperation({ summary: 'Get all public polls' })
  @ApiResponse({
    status: 200,
    description: 'Returns all public polls with all their hierarchy',
  })
  @ApiSecurity('None', [])
  async getAllPublic(): Promise<Poll[]> {
    return await this.pollService.find();
  }

  @Get('private')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get all private polls' })
  @ApiResponse({
    status: 200,
    description:
      'Returns all private polls with all their hierarchy of the signed-in user',
  })
  async getAllPrivate(@Req() req: any): Promise<Poll[]> {
    return await this.pollService.find(req.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a single private poll' })
  @ApiResponse({
    status: 200,
    description:
      "Returns requested private poll with all it's hierarchy of the signed-in user",
  })
  async getOne(@Param('id') id: number, @Req() req: any): Promise<Poll> {
    return await this.pollService.findOne(id, req.userId);
  }
}
