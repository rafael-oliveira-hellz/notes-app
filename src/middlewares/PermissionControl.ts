import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/winston-logger';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { IUser } from '../models/interfaces/user';

// verify if the user has the 'admin' role

export const isAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = getUserToken(req) as string;
  const user = (await getUserByToken(token)) as unknown as IUser;

  if (!user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Token inválido.',
    });
  }

  if (user.role !== 'admin') {
    logger.debug('Acesso não autorizado.', {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      role: { user },
    });
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Acesso não autorizado.',
    });
  }

  next();
};
