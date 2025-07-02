import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(__dirname, '..', '..', '.env') });

import { UserSchema } from '../modules/users/infrastructure/database/schemas/user.schema';
import { ClientSchema } from '../modules/clients/infrastructure/database/schemas/client.schema';
import { UserClientSchema } from '../modules/users/infrastructure/database/schemas/user-client.schema';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [UserSchema, ClientSchema, UserClientSchema],
  migrations: [path.join(__dirname, 'migrations', '*{.ts,.js}')],
});
