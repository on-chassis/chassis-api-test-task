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
    * Sign up / Sign in for a user
      * Email / Password credentials is a must
      * OAuth via Google - additional, nice to have, not required
    * Update user's name, email, password (Authenticated, partial updates are OK)
    * User can create a poll (Authenticated)
      * Poll is a set of sections and questions within those sections (see below)
    * User can modify the default poll, but it should not affect other users (Authenticated)
    * User can list all the polls available. Either default one or user created ones (Authenticated)
    * User can make a poll public, so non-registered users will be able to answer questions of the public poll (Public)
    * All the answers given to a public polls are stored in the DB. They could be retrieved by poll.id.
    
    ### Default poll (always public)
    * Company info (section)
      * What's your company name?
      * How many people in a company?
    * Personal info (section)
      * What is your name?
      * How old are you?
    
    ### Polls details
    * Polls can have unlimited amount of sections and have at least one section. 
    * Every section has questions. At least one in a section.
    * Questions have freeform answers
    
    ## Limitations:
    * DB is Postgres
    * Framework is nestjs
    * Types are important
    * Tests are welcomed
    * Linter is set up, feel free to update linter rules
    
    ## Deliverables:
    * Working API with instructions how to run it. Better if deployed somewhere (e.g. Heroku).
    * Endpoints description w/contracts (Better if it's accessible Swagger)
    * Description of solution drawbacks/limitations
    * PR to this repo / Link to a github repo with implemented test task
    `)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
