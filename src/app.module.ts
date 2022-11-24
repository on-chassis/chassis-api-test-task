import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppContext } from './app.context';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt.guard';
import appConfig from './config/app.config';
import authConfig from './config/auth.config';
import dbConfig from './config/db.config';
import { TypeOrmConfigService } from './config/typeorm.service';
import { HealthModule } from './health/health.module';
import { PollsModule } from './polls/polls.module';
import { QuestionsModule } from './questions/questions.module';
import { SectionsModule } from './sections/sections.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig, authConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options) => {
        const dataSource = await new DataSource(options).initialize();

        return dataSource;
      },
    }),
    RequestContextModule.forRoot({
      contextClass: AppContext,
      isGlobal: true,
    }),
    HealthModule,
    UsersModule,
    PollsModule,
    SectionsModule,
    QuestionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useFactory: (ref) => new JwtAuthGuard(ref),
      inject: [Reflector],
    },
    AppService,
  ],
})
export class AppModule {}
