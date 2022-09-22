import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './auth/auth.service';
import { jwtConstants } from './constants';
import { PollModule } from './poll/poll.module';
import { UsersController } from './users/users.controller';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'postgres',
      port: 5432,
      username: 'postgres',
      password: 'SomePassw0rd',
      database: 'testtask',
      entities: [User],
      synchronize: true,
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    AuthModule,
    UsersModule,
    PollModule,
  ],
  controllers: [AppController, AuthController, UsersController],
  providers: [AppService, AuthService, UsersService],
  exports: [JwtModule],
})
export class AppModule {}
