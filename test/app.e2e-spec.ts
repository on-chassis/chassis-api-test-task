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
    const poll = await pollRepo.findOne({ creator }, { relations: ['creator', 'sections', 'sections.questions'] });
    expect(poll).toEqual(response.body);
    await userRepo.delete({ username: 'poll-creator@example.com' });
  })
});
