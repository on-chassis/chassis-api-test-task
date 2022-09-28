import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';
import { CollectAnswersDto } from './dto/collect-answers.dto';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService, private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Request() req: Express.AuthenticatedRequest, @Body() createPollDto: CreatePollDto) {
    try {
      const creator = await this.usersService.findOneBy(req.user);
      return this.pollsService.create(createPollDto, creator);
    } catch (err: any) {
      return new InternalServerErrorException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/make_public')
  async makePublic(@Param('id') id: string, @Request() req: Express.AuthenticatedRequest) {
    const owner = await this.usersService.findOneBy(req.user);
    await this.pollsService.checkOwnership(id, owner);
    const result = await this.pollsService.changePollPublic(id, 1);
    return result;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req: Express.AuthenticatedRequest) {
    const owner = await this.usersService.findOneBy(req.user);
    const result = await this.pollsService.findAll(owner);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const _public = await this.pollsService.checkPublic(id);
      if (!_public) return new NotFoundException();
      return this.pollsService.findOne(id);
    } catch (err: any) {
      return new InternalServerErrorException(err);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  async update(@Param('id') id: string, @Request() req: Express.AuthenticatedRequest, @Body() updatePollDto: UpdatePollDto) {
    try {
      const creator = await this.usersService.findOneBy(req.user);
      await this.pollsService.checkOwnership(id, creator);
      return this.pollsService.update(id, updatePollDto, creator);
    } catch (err: any) {
      return new InternalServerErrorException(err);
    }
  }

  @Post(':id')
  async collectAnswers(@Param('id') id: string, @Body() answers: CollectAnswersDto) {
    try {
      const _public = await this.pollsService.checkPublic(id);
      if (!_public) return new NotFoundException();
      return this.pollsService.collectAnswers(id, answers);
    } catch (err: any) {
      return new InternalServerErrorException(err);
    }
  }
}
