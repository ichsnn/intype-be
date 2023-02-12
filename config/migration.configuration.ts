import { DataSource } from 'typeorm';
import { DatabaseConfiguration } from './database.configuration';

const databaseOption = new DatabaseConfiguration().createTypeOrmOptions();

export default new DataSource(databaseOption);
