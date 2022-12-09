import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import joi from 'joi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { comparePassword, hashPassword } from 'middlewares/ValidatePassword';
import User from 'models/User';
import logger from '../config/winston-logger';
import { generateToken, getUserToken } from '../middlewares/TokenControl';
import { IUser } from '../models/interfaces/user';

class AuthController {
  // [TO TEST] Create a user
  createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const profile_picture = '/uploads/';

    // Validate the request body with joi
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      name: joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      logger.error('Falha ao validar dados para criação de usuário.', {
        success: false,
        statusCode: 400,
        error: error.details[0].message,
      });

      return res.status(400).json({
        status: 400,
        message: error.details[0].message,
      });
    }
    const userExists = (await User.findOne({ email })) as IUser;

    if (userExists) {
      logger.error('O usuário já existe, tente outro e-mail.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'O usuário já existe, tente outro e-mail.',
      });
    }

    const hashedPassword = await hashPassword(password);

    try {
      if (hashedPassword) {
        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          profile_picture,
        });

        const accessToken = generateToken(
          user,
          process.env.ACCESS_TOKEN_SECRET as string,
          process.env.ACCESS_TOKEN_EXPIRES_IN as unknown as number
        );

        logger.debug('Usuário criado com sucesso.', {
          success: true,
          statusCode: StatusCodes.CREATED,
          label: 'AuthController',
          method: 'POST',
        });

        return res.status(StatusCodes.CREATED).json({
          success: true,
          statusCode: StatusCodes.CREATED,
          message: 'Usuário criado com sucesso.',
          user: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            role: user?.role,
            profile_picture: user?.profile_picture,
            created_at: user?.created_at,
            updated_at: user?.updated_at,
          },
          access_token: accessToken,
        });
      }
    } catch (error) {
      logger.error('Falha ao criar usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: 'Falha ao criar usuário.',
      });
    }
  };

  // [TO TEST] Login user
  signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'O e-mail é obrigatório',
      });
    }

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'A senha é obrigatória',
      });
    }

    // COMPLETE - Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: 'Não há usuário cadastrado com este e-mail',
      });
    }

    // COMPLETE - If the login and password are wrong, return 401
    if (
      email !== user?.email ||
      !(await comparePassword(password, user?.password))
    ) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'E-mail ou senha incorretos',
      });
    }

    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET as string,
      process.env.ACCESS_TOKEN_EXPIRES_IN as unknown as number
    );

    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET as string,
      process.env.REFRESH_TOKEN_EXPIRES_IN as unknown as number
    );

    logger.debug('Usuário logado com sucesso.', {
      success: true,
      statusCode: StatusCodes.OK,
      label: 'AuthController',
      method: 'POST',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        profile_picture: user?.profile_picture,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
      },
    });

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: 'Usuário logado com sucesso',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        profile_picture: user?.profile_picture,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  };

  // [TO TEST] Refresh token
  refreshToken = async (req: Request, res: Response) => {
    const { refresh_token } = req.headers;

    if (!refresh_token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'O refresh token é obrigatório',
      });
    }

    const decoded = jwt.verify(
      String(refresh_token),
      String(process.env.REFRESH_TOKEN_SECRET)
    ) as JwtPayload;

    if (!decoded) {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: 'Não foi possível gerar um novo token de acesso',
      });
    }

    const user = await User.findOne({ where: { _id: decoded.id } });

    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Usuário não encontrado',
      });
    }

    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET as string,
      process.env.ACCESS_TOKEN_EXPIRES_IN as unknown as number
    );

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Token de acesso atualizado com sucesso',
      access_token: accessToken,
    });
  };

  // [TO TEST] Verify user
  verifyUser = async (req: Request, res: Response) => {
    let user;

    if (req.headers['authorization']) {
      const token = getUserToken(req) as string;

      const decoded = jwt.verify(
        token,
        String(process.env.ACCESS_TOKEN_SECRET)
      ) as JwtPayload;

      user = (await User.findOne({
        where: { _id: decoded.id },
      })) as unknown as IUser;
    } else {
      user = null;

      logger.error('Falha ao autenticar usuário.', {
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    logger.info('Usuário autenticado com sucesso.', {
      success: true,
      statusCode: StatusCodes.OK,
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        profile_picture: user?.profile_picture,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Usuário autenticado com sucesso',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        profile_picture: user?.profile_picture,
        created_at: user?.created_at,
        updated_at: user?.updated_at,
      },
    });
  };
}

export default new AuthController();
