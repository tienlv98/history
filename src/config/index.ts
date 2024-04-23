import 'dotenv/config';
import { IConfig } from '@/config/config.interface';

export const config: IConfig = {
  appName: process.env.APP_NAME || 'SPW-Market',
  appPort: parseInt(process.env.APP_PORT),
  appEnv: process.env.APP_ENV,
  corsOrigin: process.env.CREDENTIALS === 'true',
  logLevel: process.env.LOG_LEVEL || 'dev',
  JWTTokenSecret: process.env.SECRET_TOKEN as string,
  JWTExpiredTime:
    (parseInt(process.env.EXPIRATION_TIME, 1800) as number) || 1800,
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    username: process.env.REDIS_USERNAME,
    db: parseInt(process.env.REDIS_DB),
  },
  mongo: {
    srv: process.env.MONGO_SRV_URL,
  },
};
export default config;
