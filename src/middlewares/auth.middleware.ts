import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { HttpException } from '@exceptions/HttpException';
import { JwtTokenData, RequestWithUser } from '@interfaces/auth.interface';
import config from '@config';

const getAuthorization = (req) => {
  const coockie = req.cookies['Authorization'];
  if (coockie) return coockie;

  const header = req.header('Authorization');
  if (header) return header.split('Bearer ')[1];

  return null;
};

export const AuthMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction,
) => {
  try {
    const Authorization = getAuthorization(req);

    if (Authorization) {
      const { id } = (await verify(
        Authorization,
        config.JWTTokenSecret,
      )) as JwtTokenData;

      req.user = id;
      next();
    } else {
      next(
        new HttpException(
          404,
          'The requested URL was not found on this server.',
        ),
      );
    }
  } catch (error) {
    next(new HttpException(401, 'Invalid authentication token'));
  }
};
