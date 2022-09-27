import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';

import { Poll } from '../poll/poll.entity';
import { PollService } from '../poll/poll.service';
import { validateAnswers, validateQuestions } from './answer.helpers';
import { AnswerService } from './answer.service';
import { ReceivedAnswerDTO } from './DTO/receivedAnswer.dto';

@Controller('answer')
export class AnswerController {
  constructor(
    private readonly answerService: AnswerService,
    private readonly pollService: PollService,
  ) {}

  @Put(':pollId')
  @ApiOperation({ summary: 'Answer to a public poll' })
  @ApiSecurity('None', [])
  @ApiResponse({
    status: 200,
    description: 'Returns a simple string about the accepted answers',
  })
  async answerToPoll(
    @Param('pollId') pollId: number,
    @Body() data: ReceivedAnswerDTO,
  ): Promise<string> {
    validateAnswers(data);

    const poll = await this.pollService.findOne(pollId, null);
    validateQuestions(data, poll);

    await this.answerService.saveAnswers(data);
    return 'Answers saved successfully!';
  }

  @Get(':pollId')
  @ApiOperation({ summary: 'Get answers of a public poll' })
  @ApiSecurity('None', [])
  @ApiResponse({
    status: 200,
    description:
      'Returns all answers for all questions inside all sections of the requested poll',
  })
  async getAnswersForPoll(@Param('pollId') pollId: number): Promise<Poll> {
    return await this.answerService.find(pollId);
  }
}
