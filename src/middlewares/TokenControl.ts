import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import jwt, { JwtPayload } from 'jsonwebtoken';
import logger from '../config/winston-logger';
import { IUser } from '../models/interfaces/user';
import User from '../models/User';

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
    logger.error('Acesso negado. Você não está autenticado!', {
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
    });

    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: 'Acesso negado. Você não está autenticado!',
    });
  }

  const token = getUserToken(req) as string;

  logger.info('Verificando token de acesso...', {
    success: true,
    statusCode: StatusCodes.OK,
    token,
  });

  if (!token) {
    logger.error(
      'Acesso negado. Você não tem permissão para acessar este recurso!',
      {
        success: false,
        statusCod: StatusCodes.FORBIDDEN,
      }
    );

    return res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message:
        'Acesso negado. Você não tem permissão para acessar este recurso!',
    });
  }

  const secretKey = process.env.ACCESS_TOKEN_SECRET as string;

  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;

    if (!decoded) {
      logger.error(
        'Acesso negado. Você não tem permissão para acessar este recurso!',
        {
          success: false,
          statusCode: StatusCodes.FORBIDDEN,
        }
      );

      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message:
          'Acesso negado. Você não tem permissão para acessar este recurso!',
      });
    }

    logger.info(decoded);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      status: StatusCodes.BAD_REQUEST,
      message: 'Requisição inválida!',
    });
  }

  return req.user;
};

// Generate user access token
const generateToken = (user: JwtPayload, secretKey: string): string => {
  logger.info('Gerando token de acesso...', {
    success: true,
    statusCode: StatusCodes.OK,
  });

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    secretKey,
    {
      expiresIn: '24h',
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

  const user = (await User.findById({
    _id: decoded.id,
  })) as unknown as IUser;

  return user;
};

export { verifyToken, generateToken, getUserByToken, getUserToken };
