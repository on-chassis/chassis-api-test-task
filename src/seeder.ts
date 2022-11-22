import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { seeder } from 'nestjs-seeder';

import dbConfig from './config/db.config';
import { TypeOrmConfigService } from './config/typeorm.service';
import { User } from './users/entities/user.entity';
import { UsersSeeder } from './users/users.seeder';

seeder({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [dbConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([User]),
  ],
}).run([UsersSeeder]);
