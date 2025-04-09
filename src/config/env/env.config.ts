import { config } from 'dotenv';
import { envSchema } from './env.validation';

config();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('Error validando variables de entorno:');
    console.error(parsedEnv.error.format());
    process.exit(1);
}

export const env = {
    DB_TYPE: parsedEnv.data.DB_TYPE,
    DB_HOST: parsedEnv.data.DB_HOST,
    DB_PORT: parsedEnv.data.DB_PORT,
    DB_USER: parsedEnv.data.DB_USER,
    DB_PASSWORD: parsedEnv.data.DB_PASSWORD,
    DB_NAME: parsedEnv.data.DB_NAME,
    PORT: parsedEnv.data.PORT ?? 3001,
};
