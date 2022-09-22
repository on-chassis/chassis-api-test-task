const databaseUrl = process.env.DATABASE_URL;

module.exports = [
  {
    type: 'postgres',
    name: 'default',
    url: databaseUrl,
    migrations: ['migrations/*.ts'],
    synchronize: false,
    migrationsRun: false,
    entities: ['src/**/*.entity.ts'],
    cli: {
      migrationsDir: 'migrations',
    },
  },
];

// import * as config from 'config';

// const dbConfig = config.get('db');

// export const typeOrmConfig = {
//   type: 'postgres',
//   host: process.env.POSTGRES_HOST || dbConfig.host,
//   port: +process.env.POSTGRES_PORT || 5432,
//   username: process.env.DB_USERNAME || dbConfig.username,
//   password: process.env.DB_PASSWORD || dbConfig.password,
//   database: process.env.POSTGRES_DB || dbConfig.database,
//   entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
//   migrationsRun: false,
//   logging: true,
//   migrationsTableName: 'migration',
//   migrations: [
//     __dirname + '/migration/**/*.ts',
//     __dirname + '/migration/**/*.js',
//   ],
//   synchronize: false,
//   cli: {
//     migrationsDir: 'src/migration',
//   },
// };
