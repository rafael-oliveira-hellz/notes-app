import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../config/winston-logger';
import { IUser } from '../models/interfaces/user';
import User from '../models/User';
import Bundle from '../utils/Bundle';

// Get the user token from somewhere
const getUserToken = (req: Request) => {
  const authToken = req.headers['authorization'];

  const token = authToken && authToken.split(' ')[1];

  return token;
};

// Check if the token is valid
const verifyToken = async (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    logger.error('Acesso negado. Token não informado!', {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
    });

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Acesso negado. Token não informado!',
    });
  }

  const token = getUserToken(req) as string;

  logger.info('Verificando token de acesso...', {
    success: true,
    statusCode: StatusCodes.OK,
    token,
  });

  if (!token) {
    logger.error('Acesso negado!', {
      success: false,
      statusCod: StatusCodes.FORBIDDEN,
    });

    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: 'Acesso negado!',
    });
  }

  try {
    const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (!decoded) {
      logger.error('Acesso negado!', {
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
      });

      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: 'Acesso negado!',
      });
    }

    const id = decoded.id;

    const user = User.findOne({
      where: {
        id,
      },
    });

    Bundle.setBundle(req, user, null);

    next();
  } catch (error) {
    logger.error('Token inválido.', {
      success: false,
      statusCod: StatusCodes.UNAUTHORIZED,
    });

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: ReasonPhrases.UNAUTHORIZED,
    });
  }

  return req.user;
};

// Generate user access token
const generateToken = (
  user: JwtPayload,
  secretKey: string,
  expiry: number
): string => {
  logger.info('Gerando token de acesso...', {
    success: true,
    statusCode: StatusCodes.OK,
  });

  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    secretKey,
    {
      expiresIn: process.env.NODE_ENV === 'production' ? expiry : '12h',
      algorithm: 'HS512',
    }
  );

  logger.info('Token de acesso gerado com sucesso.', {
    success: true,
    statusCode: StatusCodes.OK,
    accessToken: token,
  });

  return token;
};

const getUserByToken = async (token: string) => {
  const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

  const decoded = jwt.verify(token, secretKey) as JwtPayload;

  const user = User.findById({
    _id: decoded.id,
  }).select('-password') as unknown as IUser;

  return user;
};

export { verifyToken, generateToken, getUserByToken, getUserToken };
