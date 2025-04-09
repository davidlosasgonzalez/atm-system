import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { env } from '../env/env.config';

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    entities: [__dirname + '/../../modules/**/*.entity{.ts,.js}'],
    synchronize: true,
    dropSchema: true,
};
