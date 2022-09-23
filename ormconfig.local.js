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
