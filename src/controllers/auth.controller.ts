import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import joi from 'joi';
import jwt, { JwtPayload } from 'jsonwebtoken';
import moment from 'moment';
import logger from '../config/winston-logger';
import { generateToken, getUserToken } from '../middlewares/TokenControl';
import { comparePassword, hashPassword } from '../middlewares/ValidatePassword';
import { IUser } from '../models/interfaces/user';
import User from '../models/User';

class AuthController {
  // [TO TEST] Create a user
  createUser = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const profile_picture =
      'https://xsgames.co/randomusers/assets/images/favicon.png';

    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
      name: joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      logger.error('Falha ao validar dados para criação de usuário.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        error: error.details[0].message,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        status: StatusCodes.BAD_REQUEST,
        message: error.details[0].message,
      });
    }
    const userExists = (await User.findOne({ email })) as IUser;

    if (userExists) {
      logger.error('O usuário já existe, tente outro e-mail.', {
        success: false,
        statusCode: StatusCodes.CONFLICT,
      });

      return res.status(StatusCodes.CONFLICT).json({
        success: false,
        statusCode: StatusCodes.CONFLICT,
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
          created_at: moment(new Date()).tz('America/Sao_Paulo').toISOString(),
        });

        const accessToken = generateToken(
          user,
          process.env.ACCESS_TOKEN_SECRET as string
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
            status: user?.status,
            email_verified_at:
              user?.email_verified_at !== null
                ? moment(user?.email_verified_at)
                    .tz('America/Sao_Paulo')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
            profile_picture: user?.profile_picture,
            lastLoginDate:
              user?.lastLoginDate !== null
                ? moment(user?.lastLoginDate)
                    .tz('America/Sao_Paulo')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
            currentLoginDate:
              user?.currentLoginDate !== null
                ? moment(user?.currentLoginDate)
                    .tz('America/Sao_Paulo')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
            created_at:
              user?.created_at !== null
                ? moment(user?.created_at)
                    .tz('America/Sao_Paulo')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
            updated_at:
              user?.updated_at !== null
                ? moment(user?.updated_at)
                    .tz('America/Sao_Paulo')
                    .format('DD/MM/YYYY HH:mm:ss')
                : null,
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
    const email = String(req.body.email);
    const password = String(req.body.password);

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
    if (!(await comparePassword(password, user?.password))) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: 'E-mail ou senha incorretos',
      });
    }

    const accessToken = generateToken(
      user,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    const refreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN_SECRET as string
    );

    if (!user?.lastLoginDate) {
      user.lastLoginDate = moment(new Date())
        .tz('America/Sao_Paulo')
        .toISOString() as unknown as Date;

      user.currentLoginDate = moment(new Date())
        .tz('America/Sao_Paulo')
        .toISOString() as unknown as Date;

      user.email_verified_at = moment(new Date())
        .tz('America/Sao_Paulo')
        .toISOString() as unknown as Date;

      await user?.save();
    }

    if (user.lastLoginDate) {
      const currentDate = moment(new Date())
        .tz('America/Sao_Paulo')
        .toISOString() as unknown as Date;
      const lastLoginDate = user?.currentLoginDate;
      user.lastLoginDate = lastLoginDate;
      user.currentLoginDate = currentDate;

      await user?.save();
    }

    const currentDate = user.currentLoginDate;
    const lastLoginDate = user.lastLoginDate;

    if (currentDate && lastLoginDate) {
      const differenceInDays = moment(currentDate).diff(
        moment(lastLoginDate),
        'days'
      );

      logger.info('differenceInDays', { differenceInDays });

      if (differenceInDays > 30) {
        user.status = 'inactive';

        await user?.save();
      }
    }

    if (user?.status === 'inactive') {
      return res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: 'Usuário inativo!',
      });
    }

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
        status: user?.status,
        email_verified_at:
          user?.email_verified_at !== null
            ? moment(user?.email_verified_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        profile_picture: user?.profile_picture,
        lastLoginDate:
          user?.lastLoginDate !== null
            ? moment(user?.lastLoginDate)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        currentLoginDate:
          user?.currentLoginDate !== null
            ? moment(user?.currentLoginDate)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        created_at:
          user?.created_at !== null
            ? moment(user?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          user?.updated_at !== null
            ? moment(user?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Usuário logado com sucesso',
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
        status: user?.status,
        email_verified_at:
          user?.email_verified_at !== null
            ? moment(user?.email_verified_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        profile_picture: user?.profile_picture,
        lastLoginDate:
          user?.lastLoginDate !== null
            ? moment(user?.lastLoginDate)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        currentLoginDate:
          user?.currentLoginDate !== null
            ? moment(user?.currentLoginDate)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        created_at:
          user?.created_at !== null
            ? moment(user?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          user?.updated_at !== null
            ? moment(user?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  };

  // [TO TEST] Refresh token
  refreshToken = async (req: Request, res: Response) => {
    const refresh_token = getUserToken(req);

    if (!refresh_token) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'O refresh token é obrigatório',
      });
    }

    try {
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
        process.env.ACCESS_TOKEN_SECRET as string
      );

      return res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Token de acesso atualizado com sucesso',
        access_token: accessToken,
      });
    } catch (error: Error | any) {
      if (error instanceof Error) {
        logger.error(error.message, {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          label: 'AuthController',
          method: 'POST',
          message: 'Não foi possível gerar um novo token de acesso',
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Não foi possível gerar um novo token de acesso',
          error: {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
        });
      }
    }
  };

  // [TO TEST] Verify user
  verifyUser = async (req: Request, res: Response) => {
    let user;

    const SECRET = String(process.env.ACCESS_TOKEN_SECRET);

    if (req.headers.authorization) {
      const token = getUserToken(req) as string;

      const decoded = jwt.verify(token, SECRET) as JwtPayload;

      user = await User.findById(decoded.id).select('-password');
    } else {
      user = null;
    }

    logger.info('Usuário autenticado com sucesso.', {
      success: true,
      statusCode: StatusCodes.OK,
      user
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Usuário autenticado com sucesso',
      user
    });
  };
}

export default new AuthController();
