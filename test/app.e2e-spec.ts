import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AppModule } from './../src/app.module';
import { User } from '../src/users/entities/user.entity';

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
  });
});
