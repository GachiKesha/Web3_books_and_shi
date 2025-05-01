import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { DataSource, DataSourceOptions } from 'typeorm';
require('dotenv').config();

export const typeOrmModuleOptions: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  cache: false,
  database: process.env.DB_NAME || 'web_lab',
  logging: ['warn', 'error'],
  synchronize: true,
};

export const connectionSource = new DataSource(typeOrmModuleOptions as DataSourceOptions)