import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const typeOrmCliConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5433'),
  username: process.env.DATABASE_USER || 'bluser',
  password: process.env.DATABASE_PASSWORD || 'secret',
  database: process.env.DATABASE_NAME || 'bludrone',
  entities: ['dist/**/**/*.entity.js'],
  synchronize: false, // Never use synchronize in production
  logging: process.env.NODE_ENV === 'development',
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
};

// DataSource for migrations
export default new DataSource(typeOrmCliConfig);
