import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { toBoolean } from '@/utils/format';
export function getEnv(env: string): Record<string, unknown> {
  if (fs.existsSync(env)) {
    return dotenv.parse(fs.readFileSync(env));
  }
}

export function buildConnectionOptions() {
  const defaultConfig = getEnv('.env');
  const envConfig = getEnv(`.env.${process.env.NODE_ENV || 'development'}`);

  const config = { ...defaultConfig, ...envConfig };
  return {
    type: config['DB_TYPE'],
    host: config['DB_HOST'],
    port: config['DB_PORT'],
    username: config['DB_USERNAME'],
    password: config['DB_PASSWORD'],
    database: config['DB_DATABASE'],
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: toBoolean(config['DB_SYNC']),
    autoLoadEntities: toBoolean(config['DB_AUTOLOAD']),
  } as TypeOrmModuleOptions;
}

export default new DataSource({
  ...buildConnectionOptions(),
} as DataSourceOptions);
