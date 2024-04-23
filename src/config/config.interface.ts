import { config } from 'dotenv'
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` })

export enum EnumEnv {
    Local = 'local',
    Development = 'development',
    Staging = 'staging',
    PreProduction = 'pre-production',
    Production = 'production',
}

export interface IConfig {
    appName: string;
    appPort: number;
    appEnv: string;
    corsOrigin: boolean;

    JWTTokenSecret: string;
    JWTExpiredTime: number;
    logLevel: string;
    mongo: {
        srv: string;
    };

    redis: {
        host: string;
        port: number;
        password: string;
        username: string;
        db: number;
    };
}