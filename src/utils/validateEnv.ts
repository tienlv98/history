import { cleanEnv, port, str } from 'envalid';

export const ValidateEnv = () => {
  cleanEnv(process.env, {
    APP_ENV: str(),
    APP_PORT: port(),
  });
};
