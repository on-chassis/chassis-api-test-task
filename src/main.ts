import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fs from 'fs';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Polls API')
    .setDescription(`
    ## Test task
    Task is to implement an API that can do following:
    - [x] Sign up / Sign in for a user
      - [x] Email / Password credentials is a must
      - [ ] OAuth via Google - additional, nice to have, not required
    - [x] Update user's name, email, password (Authenticated, partial updates are OK)
    - [x] User can create a poll (Authenticated)
      - [x] Poll is a set of sections and questions within those sections (see below)
    - [x] User can modify the default poll, but it should not affect other users (Authenticated)
      - [x] Once default poll is modified - it should be overwritten, without losing data about previous poll-sections-questions settings and already collected answers
      - [x] User can modify private polls without any restrictions and public polls using override mechanism (Authenticated)
    - [x] User can list all the polls available. Either default one or user created ones (Authenticated)
      - [x] Implement default poll prepopulate for new user profile
    - [x] User can make a poll public, so non-registered users will be able to answer questions of the public poll (Public)
    - [x] All the answers given to a public polls are stored in the DB. They could be retrieved by poll.id (Authenticated)
    
    ### Default poll (always public)
    - [x] Company info (section)
      - [x] What's your company name?
      - [x] How many people in a company?
    - [x] Personal info (section)
      - [x] What is your name?
      - [x] How old are you?
    
    ### Polls details
    - [x] Polls can have unlimited amount of sections and have at least one section. 
    - [x] Every section has questions. At least one in a section.
    - [x] Questions have freeform answers
    
    ## Limitations:
    - [x] DB is Postgres
    - [x] Framework is nestjs
    - [x] Types are important
    - [x] Tests are welcomed
    - [ ] Linter is set up, feel free to update linter rules
    
    ## Deliverables:
    - [x] Working API with instructions how to run it. Better if deployed somewhere (e.g. Heroku).
    - [x] Endpoints description w/contracts (Better if it's accessible Swagger)
    - [x] Description of solution drawbacks/limitations
    - [x] PR to this repo / Link to a github repo with implemented test task
    `)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
