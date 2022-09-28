import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { PollsModule } from './polls/polls.module';
import { UsersModule } from './users/users.module';
import { randomUUID } from 'crypto';
import { User } from './users/entities/user.entity';
import { Poll, PollSection, PollQuestion } from './polls/entities/poll.entity';
import { PollRespondent, PollRespondentAnswers } from './polls/entities/answers.entity';
@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        name: process.env.NODE_ENV !== 'test' ? `node-${process.pid}` : `node-test-${randomUUID()}`,
        url: configService.get('DATABASE_URL'),
        entities: [User, Poll, PollSection, PollQuestion, PollRespondent, PollRespondentAnswers],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PollsModule,
  ],
})
export class AppModule {}
