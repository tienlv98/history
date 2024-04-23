import winston from 'winston';
import { performance } from 'perf_hooks';

// Define log format
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
    logFormat,
  ),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize(),
    ),
  }),
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

const perf = {
  start: (key) => {
    performance.mark('start_' + key);
  },
  end: (key) => {
    performance.mark('end_' + key);
    performance.measure('perf_' + key, 'start_' + key, 'end_' + key);
  },
  function: (func) => {
    performance.timerify(func)();
  },
};

export { perf, logger, stream };
