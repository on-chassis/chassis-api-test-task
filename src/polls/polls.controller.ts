import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from '../users/users.service';

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
      return {
        message: err.message
      };
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Request() req: Express.AuthenticatedRequest) {
    const owner = await this.usersService.findOneBy(req.user);
    const result = await this.pollsService.findAll(owner);
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(+id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(+id);
  }
}
