import mongoose, { connect, ConnectOptions, set } from 'mongoose';
import { logger } from '@utils/logger';
import config from '@config/index';
console.log("🦅 ~ config:", config)
import { EnumEnv } from '@config/config.interface';

export const dbConnection = async () => {
  try {
    const dbConfig = {
      url: config.mongo.srv,
      options: {
        maxPoolSize: 100,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        readPreference: 'secondary',
      } as ConnectOptions,
    };

    if (config.appEnv !== EnumEnv.Production) {
      set('debug', true);
    }

    await connect(dbConfig.url, dbConfig.options);

    logger.info('Connected to database');

    mongoose.connection.on('error', (error) => {
      logger.error('Error connecting to database', error);
      mongoose.connection.close();
    });

    mongoose.connection.on('disconnected', () => {
      logger.info('Disconnected from database');
    });
  } catch (error) {
    logger.error('Error connecting to database', error);
  }
};
