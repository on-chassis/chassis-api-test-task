import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PollsModule } from './polls/polls.module';
import { User } from './users/entities/user.entity';
import { Poll, PollSection, PollQuestion } from './polls/entities/poll.entity';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        name: `node-${process.pid}`,
        url: configService.get('DATABASE_URL'),
        entities: [User, Poll, PollSection, PollQuestion],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    PollsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
