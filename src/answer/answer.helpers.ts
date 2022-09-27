import { ForbiddenException } from '@nestjs/common';

import { Poll } from '../poll/poll.entity';
import { ReceivedAnswerDTO } from './DTO/receivedAnswer.dto';

export const validateAnswers = (data: ReceivedAnswerDTO): void => {
  if (!data.answers?.length) {
    throw new ForbiddenException('Please provide answers!');
  }
  for (let i = 0; i < data.answers.length; i++) {
    if (!data.answers[i].text) {
      throw new ForbiddenException('Please provide text for every answer!');
    }
    if (!data.answers[i].questionId) {
      throw new ForbiddenException(
        'Please provide "questionId" for every answer!',
      );
    }
  }
};

export const validateQuestions = (
  data: ReceivedAnswerDTO,
  poll: Poll,
): void => {
  const receivedQuestionIds: Array<number> = data.answers.map(
    (answer) => answer.questionId,
  );
  const questionIdsInPoll: Array<number> = [];
  poll.sections.forEach((section) => {
    section.questions.forEach((question) =>
      questionIdsInPoll.push(
        typeof question.id === 'string' ? parseInt(question.id) : question.id,
      ),
    );
  });

  for (let i = 0; i < receivedQuestionIds.length; i++) {
    if (!questionIdsInPoll.includes(receivedQuestionIds[i])) {
      throw new ForbiddenException(
        'Some of the questions are not part of the poll!',
      );
    }
  }
};
