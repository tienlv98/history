import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { logger } from '@utils/logger';
import config from '@config/index';
import { EnumEnv } from '@config/config.interface';

export const ErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const status: number = error.status || 500;
    const message: string =
      config.appEnv !== EnumEnv.Production
        ? error.message || 'Something went wrong'
        : 'Something went wrong';

    logger.error(
      `[${req.method}] ${req.path} >> StatusCode:: ${status}, Message:: ${message}`,
    );
    res
      .status(status)
      .json({ message, success: false, status: 500, time: Date.now() });
  } catch (error) {
    next(error);
  }
};
