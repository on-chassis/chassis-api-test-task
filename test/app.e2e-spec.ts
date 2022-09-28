import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import {expect, jest, test} from '@jest/globals';
import { Repository } from 'typeorm';
import * as _ from 'lodash'

import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { CreatePollDto } from '../src/polls/dto/create-poll.dto';
import { Poll } from '../src/polls/entities/poll.entity';
import { UsersService } from '../src/users/users.service';
import { CollectAnswersDto } from '../src/polls/dto/collect-answers.dto';
import { PollRespondent, PollRespondentAnswers } from '../src/polls/entities/answers.entity';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/user (POST) existing user', async () => {
    const repo = app.get(getRepositoryToken(User));
    await repo.insert({ username: 'existing@example.com', name: 'existing', passwordHash: '' });

    await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'existing@example.com'})
      .expect(400);

    await repo.delete({ username: 'existing@example.com', name: 'existing', passwordHash: '' });
  });

  it('/user (POST) not enough data', async () => {
    await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'invalid@example.com'})
      .expect(400);
  });

  it('/user (POST) valid', async () => {
    const repo = app.get(getRepositoryToken(User));
    await repo.delete({ username: 'valid@example.com' });

    await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'valid@example.com', name: 'Dev', password: 'HelloWorld'})
      .expect(201);

    await repo.findOneOrFail({ username: 'valid@example.com', name: 'Dev' });
    await repo.delete({ username: 'valid@example.com', name: 'Dev' });
  });

  it('/polls (POST) valid', async () => {
    const userRepo = app.get(getRepositoryToken(User));
    const pollRepo = app.get(getRepositoryToken(Poll));
    const userService = app.get(UsersService);
    await userRepo.delete({ username: 'poll-creator@example.com' });

    const userResponse = await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'poll-creator@example.com', name: 'Dev', password: 'HelloWorld'})
      .expect(201);

    expect(userResponse).toHaveProperty('body.id');
    await userRepo.findOneOrFail({ username: 'poll-creator@example.com', name: 'Dev' });

    const { body: { access_token }} = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'poll-creator@example.com', password: 'HelloWorld'})
      .expect(201);

    const pollCreationData: CreatePollDto = {
      title: 'example poll',
      sections: [
        {
          title: 'section 1',
          questions: [
            {
              text: 'question 1'
            }
          ]
        }
      ]
    };

    const response = await request(app.getHttpServer())
      .post('/polls')
      .auth(access_token, { type: "bearer" })
      .send(pollCreationData)
      .expect(201);

    const creator = await userService.findOneBy({ id: userResponse.body.id })
    const poll = await pollRepo.findOne({ id: response.body.id, creator }, { relations: ['creator', 'sections', 'sections.questions'] });
    expect(poll).toEqual(response.body);
    await userRepo.delete({ username: 'poll-creator@example.com' });
  })

  it('/polls (POST) update private', async () => {
    const userRepo = app.get(getRepositoryToken(User));
    const pollRepo = app.get(getRepositoryToken(Poll));
    const userService = app.get(UsersService);
    await userRepo.delete({ username: 'update-private@example.com' });

    await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'update-private@example.com', name: 'Dev', password: 'HelloWorld'})
      .expect(201);

    const { body: { access_token }} = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'update-private@example.com', password: 'HelloWorld'})
      .expect(201);

    const pollCreationData: CreatePollDto = {
      title: 'example poll',
      sections: [
        {
          title: 'section 1',
          questions: [
            {
              text: 'question 1'
            }
          ]
        }
      ]
    };

    const createdPollResponse = await request(app.getHttpServer())
      .post('/polls')
      .auth(access_token, { type: "bearer" })
      .send(pollCreationData)
      .expect(201);

    const pollUpdateData = pollCreationData;
    pollUpdateData.sections[0].questions[0].text = 'updated question 1';

    const updatedPollResponse = await request(app.getHttpServer())
      .patch(`/polls/${createdPollResponse.body.id}`)
      .auth(access_token, { type: "bearer" })
      .send(pollUpdateData)
      .expect(200);

    const poll = await pollRepo.findOne({ id: createdPollResponse.body.id }, { relations: ['creator', 'sections', 'sections.questions'] });

    expect(poll).toEqual(updatedPollResponse.body);

    const equalityCheckData: any = pollUpdateData;
    equalityCheckData.id = expect.any(String);
    equalityCheckData._default = 0;
    equalityCheckData._public = 0;
    equalityCheckData.creator = {
      id: expect.any(String),
      username: 'update-private@example.com',
      name: 'Dev'
    }
    for (let i = 0; i < equalityCheckData.sections.length; i++) {
      equalityCheckData.sections[i].id = expect.any(String);
      equalityCheckData.sections[i].orderNumber = expect.any(Number);
      for (let j = 0; j < equalityCheckData.sections[i].questions.length; j++) {
        equalityCheckData.sections[i].questions[j].id = expect.any(String);
        equalityCheckData.sections[i].questions[j].orderNumber = expect.any(Number);
      }
    }
    expect(poll).toEqual(equalityCheckData);
    await userRepo.delete({ username: 'update-private@example.com' });
  })

  it('/polls (POST) update public with archivation', async () => {
    const userRepo = app.get(getRepositoryToken(User));
    const pollRepo = app.get(getRepositoryToken(Poll));
    const userService = app.get(UsersService);
    await userRepo.delete({ username: 'update-public@example.com' });

    await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'update-public@example.com', name: 'Dev', password: 'HelloWorld'})
      .expect(201);

    const { body: { access_token }} = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'update-public@example.com', password: 'HelloWorld'})
      .expect(201);

    const pollCreationData: CreatePollDto = {
      title: 'example poll',
      sections: [
        {
          title: 'section 1',
          questions: [
            {
              text: 'question 1'
            }
          ]
        }
      ]
    };

    const createdPollResponse = await request(app.getHttpServer())
      .post('/polls')
      .auth(access_token, { type: "bearer" })
      .send(pollCreationData)
      .expect(201);

    
    const publishedPollResponse = await request(app.getHttpServer())
      .post(`/polls/${createdPollResponse.body.id}/make_public`)
      .auth(access_token, { type: "bearer" })
      .expect(201);

    const pollUpdateData = _.cloneDeep(pollCreationData);
    pollUpdateData.sections[0].questions[0].text = 'updated public question 1 with archivation';

    const updatedPollResponse = await request(app.getHttpServer())
      .patch(`/polls/${publishedPollResponse.body.id}`)
      .auth(access_token, { type: "bearer" })
      .send(pollUpdateData)
      .expect(200);

    const checkData = (original: boolean) => {
      const equalityCheckData: any = _.cloneDeep(pollCreationData);
      equalityCheckData.id = original ? publishedPollResponse.body.id : updatedPollResponse.body.id;
      equalityCheckData._default = 0;
      equalityCheckData._public = 1;
      equalityCheckData.creator = {
        id: expect.any(String),
        username: 'update-public@example.com',
        name: 'Dev'
      }
      for (let i = 0; i < equalityCheckData.sections.length; i++) {
        equalityCheckData.sections[i].id = original ? publishedPollResponse.body.sections[i].id : updatedPollResponse.body.sections[i].id;
        equalityCheckData.sections[i].orderNumber = expect.any(Number);
        for (let j = 0; j < equalityCheckData.sections[i].questions.length; j++) {
          equalityCheckData.sections[i].questions[j].id = original ? publishedPollResponse.body.sections[i].questions[j].id : updatedPollResponse.body.sections[i].questions[j].id;
          equalityCheckData.sections[i].questions[j].orderNumber = expect.any(Number);
          equalityCheckData.sections[i].questions[j].text = original ? publishedPollResponse.body.sections[i].questions[j].text : updatedPollResponse.body.sections[i].questions[j].text;
        }
      }
      return equalityCheckData;
    }

    const originalPublicTemplate = checkData(true);
    const updatedTemplate = checkData(false);
    
    expect(publishedPollResponse.body).toEqual(originalPublicTemplate);
    const originalPoll = await pollRepo.findOne({ id: publishedPollResponse.body.id }, { relations: ['creator', 'sections', 'sections.questions', 'child'] });
    expect(originalPoll).toEqual({
      ...originalPublicTemplate,
      child: {
        id: updatedPollResponse.body.id,
        _default: updatedPollResponse.body._default,
        _public: updatedPollResponse.body._public,
        title: updatedPollResponse.body.title,
      }
    });

    expect(updatedPollResponse.body).toEqual(updatedTemplate);
    const poll = await pollRepo.findOne({ id: updatedPollResponse.body.id }, { relations: ['creator', 'sections', 'sections.questions', 'child'] });
    expect(poll).toEqual({
      ...updatedTemplate,
      child: null,
    });

    await userRepo.delete({ username: 'update-public@example.com' });
  })

  it('/polls/:id/answers (POST) collect polls answers', async () => {
    const userRepo = app.get(getRepositoryToken(User));
    const pollRepo = app.get(getRepositoryToken(Poll));
    const pollAnswersRepo: Repository<PollRespondentAnswers> = app.get(getRepositoryToken(PollRespondentAnswers));
    const userService = app.get(UsersService);
    await userRepo.delete({ username: 'poll-creator-for-answers@example.com' });

    const userResponse = await request(app.getHttpServer())
      .post('/user')
      .send({ username: 'poll-creator-for-answers@example.com', name: 'Dev', password: 'HelloWorld'})
      .expect(201);
    
    const creator = await userRepo.findOneOrFail({ id: userResponse.body.id });
    const defaultPoll: Poll = await pollRepo.findOneOrFail({ creator }, { relations: ['creator', 'sections', 'sections.questions', 'child'] })
    const data: CollectAnswersDto[] = [{ answers: [] }, { answers: [] }]

    for (let i = 0; i < defaultPoll.sections.length; i++) {
      for (let j = 0; j < defaultPoll.sections[i].questions.length; j++) {
        for (let k = 0; k < 2; k++) {
          data[k].answers.push({
            questionId: defaultPoll.sections[i].questions[j].id,
            text: `${k}+${i}+${j}`,
          })
        }
      }
    }

    for (let i = 0; i < data.length; i++) {
      const answerResponse = await request(app.getHttpServer())
        .post(`/polls/${defaultPoll.id}/answers`)
        .send(data[i])
        .expect(201);
      const pollRespondent: PollRespondent = answerResponse.body;
      const answers: PollRespondentAnswers[] = await pollAnswersRepo.find({ where: { respondent: pollRespondent }, order: { text: 'ASC' }});
      const expected = data[i].answers.sort((v1, v2) => v1.text.localeCompare(v2.text)).map((v) => ({ text: v.text, id: expect.any(String) }));
      expect(answers).toEqual(expected);
    }

    await userRepo.delete({ username: 'poll-creator-for-answers@example.com' });
  })
});
