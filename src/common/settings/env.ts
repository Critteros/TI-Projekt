import dotenv from 'dotenv';
import { cleanEnv, port, str, url } from 'envalid';

dotenv.config();

export const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development',
  }),
  PORT: port({ default: 9000 }),
  HOST: str({ default: '0.0.0.0' }),
  DATABASE_URL: url(),
  JWT_SECRET: str(),
});
