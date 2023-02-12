import { TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export class DatabaseConfiguration implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): DataSourceOptions {
    return {
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: false,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: ['dist/database/migrations/*.js'],
    };
  }
}
