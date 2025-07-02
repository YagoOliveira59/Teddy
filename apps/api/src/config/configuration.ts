import * as path from 'path';

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    autoLoadEntities: true,
    synchronize: false,
    migrationsRun: true,
    migrations: [
      path.join(__dirname, '..', 'database', 'migrations', '*{.ts,.js}'),
    ],
  },
});
