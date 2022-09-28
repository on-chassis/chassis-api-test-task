import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';
import {expect, jest, test} from '@jest/globals';


import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';
import { CreatePollDto } from '../src/polls/dto/create-poll.dto';
import { Poll } from '../src/polls/entities/poll.entity';
import { UsersService } from '../src/users/users.service';

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
      .send(pollCreationData)
      .expect(200);

    const poll = await pollRepo.findOne({ id: createdPollResponse.body.id }, { relations: ['creator', 'sections', 'sections.questions'] });

    expect(poll).toEqual(updatedPollResponse.body);

    const equalityCheckData: any = pollUpdateData;
    equalityCheckData.id = expect.any(String);
    equalityCheckData._default = "0";
    equalityCheckData._public = "0";
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
});
