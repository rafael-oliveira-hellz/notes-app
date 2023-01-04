import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';
import logger from '../config/winston-logger';
import { paginate } from '../middlewares/Pagination';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { comparePassword, hashPassword } from '../middlewares/ValidatePassword';
import User from '../models/User';
import { isEmailValid } from '../utils/Validations';
class UserController {
  // [TO TEST] Get all users
  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const response = await paginate(User, req, res);

    if (!response) {
      logger.debug('Nenhum usuário encontrado.', {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        label: 'UserController',
        method: 'GET',
      });

      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhum usuário encontrado.',
      });
    }

    response.data = response.data.map((user: any) => {
      return {
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
      };
    });

    return res.status(StatusCodes.OK).json(response);
  };

  // [TO TEST] Verify if the user is logged in, if so, get the user profile info
  getUserProfile = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      if (user) {
        logger.debug('Usuário encontrado com sucesso.', {
          success: true,
          statusCode: StatusCodes.OK,
          label: 'UserController',
          method: 'GET',
        });

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Usuário encontrado com sucesso.',
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
        });
      }

      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Usuário não encontrado.',
      });
    } catch (error) {
      logger.error('Falha ao buscar usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao buscar usuário.',
      });
    }
  };

  // [TO TEST] Get a user by field
  getUserByField = async (req: Request, res: any) => {
    const field = String(req.query.field);
    const value = String(req.query.value);

    if (field === null || field === undefined || field === '') {
      logger.error('Não é possível buscar realizar busca.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });
    }

    if (
      field === 'email_verified_at' ||
      field === 'password' ||
      field === 'remember_token' ||
      field === 'password_reset_token' ||
      field === 'profile_picture'
    ) {
      logger.error('Não é possível buscar um usuário por este campo.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Não é possível buscar um usuário por este campo.',
      });
    }

    if (value === null || value === undefined || value === '') {
      const response = await paginate(User, req, res);

      if (!response) {
        logger.error('Não foi possível buscar usuário.', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        });
      }

      response.data = response.data.map((user: any) => {
        return {
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
        };
      });

      res.status(StatusCodes.OK).json(response);
    }

    try {
      const userData = await User.find({
        [field]: { $regex: value, $options: 'i' },
      }).select(['-password', '-remember_token', '-password_reset_token']);

      if (userData.length === 0 || !userData) {
        logger.error('Usuário não encontrado.', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: ReasonPhrases.NOT_FOUND,
        });
      }

      const user = userData.map((user: any) => {
        return {
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
        };
      });

      if (user) {
        logger.debug('Busca realizada com sucesso.', {
          success: true,
          statusCode: StatusCodes.OK,
          label: 'UserController',
          method: 'GET',
        });

        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result: any = {
          totalDocuments: 0,
          totalPages: 0,
          previous: {},
          current: {},
          next: {},
          data: {},
        };

        result.totalDocuments = user.length;
        result.totalPages = Math.ceil(user.length / limit);
        result.previous = {
          page: page - 1,
          limit,
        };
        result.current = {
          page,
          limit,
        };
        result.next = {
          page: page + 1,
          limit,
        };
        result.data = user.slice(startIndex, endIndex);

        if (endIndex < user.length) {
          result.next = {
            page: page + 1,
            limit,
          };
        }

        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit,
          };
        }

        if (page > result.totalPages) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Nenhuma anotação encontrada para este usuário.',
          });
        }

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Busca realizada com sucesso.',
          result,
        });
      }

      return res.status(StatusCodes.OK).json({
        success: true,
        statusCode: StatusCodes.OK,
        message: 'Busca realizada com sucesso.',
        user,
      });
    } catch (error) {
      logger.error('Falha ao realizar busca', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      if (error instanceof Error) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Erro interno do servidor.',
        });
      }
    }
  };

  // Find all the active users
  getActiveUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({
        status: 'active',
      }).select(['-password', '-remember_token', '-password_reset_token']);

      if (!users || users.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Nenhum usuário encontrado.',
        });
      }

      const allUsers = users.map((user: any) => {
        return {
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
        };
      });

      if (allUsers) {
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result: any = {
          totalDocuments: 0,
          totalPages: 0,
          previous: {},
          current: {},
          next: {},
          data: {},
        };

        result.totalDocuments = allUsers.length;
        result.totalPages = Math.ceil(allUsers.length / limit);
        result.previous = {
          page: page - 1,
          limit,
        };
        result.current = {
          page,
          limit,
        };
        result.next = {
          page: page + 1,
          limit,
        };
        result.data = allUsers.slice(startIndex, endIndex);

        if (endIndex < allUsers.length) {
          result.next = {
            page: page + 1,
            limit,
          };
        }

        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit,
          };
        }

        if (page > result.totalPages) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Nenhuma anotação encontrada para este usuário.',
          });
        }

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Busca realizada com sucesso.',
          result,
        });
      }
    } catch (error: any) {
      logger.error('Falha ao buscar usuários.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: 'Falha ao buscar usuários.',
      });
    }
  };

  // Find all the inactive users
  getInactiveUsers = async (req: Request, res: Response) => {
    try {
      const users = await User.find({
        status: 'inactive',
      }).select(['-password', '-remember_token', '-password_reset_token']);

      if (!users || users.length === 0) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Nenhum usuário inativo encontrado.',
        });
      }

      const allUsers = users.map((user: any) => {
        return {
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
        };
      });

      if (allUsers) {
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const result: any = {
          totalDocuments: 0,
          totalPages: 0,
          previous: {},
          current: {},
          next: {},
          data: {},
        };

        result.totalDocuments = allUsers.length;
        result.totalPages = Math.ceil(allUsers.length / limit);
        result.previous = {
          page: page - 1,
          limit,
        };
        result.current = {
          page,
          limit,
        };
        result.next = {
          page: page + 1,
          limit,
        };
        result.data = allUsers.slice(startIndex, endIndex);

        if (endIndex < allUsers.length) {
          result.next = {
            page: page + 1,
            limit,
          };
        }

        if (startIndex > 0) {
          result.previous = {
            page: page - 1,
            limit,
          };
        }

        if (page > result.totalPages) {
          return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            statusCode: StatusCodes.NOT_FOUND,
            message: 'Nenhuma anotação encontrada para este usuário.',
          });
        }

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Busca realizada com sucesso.',
          result,
        });
      }
    } catch (error: any) {
      logger.error('Falha ao buscar usuários.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        message: 'Falha ao buscar usuários.',
      });
    }
  };

  // [TO TEST] Update user's password
  updateUserPassword = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      if (user) {
        const { oldPassword, newPassword } = req.body;

        if (
          oldPassword === null ||
          oldPassword === undefined ||
          oldPassword === ''
        ) {
          logger.error('A senha antiga não pode ser nula.', {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: ReasonPhrases.BAD_REQUEST,
          });

          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'A senha antiga não pode ser nula.',
          });
        }

        if (
          newPassword === null ||
          newPassword === undefined ||
          newPassword === ''
        ) {
          logger.error('A nova senha não pode ser nula.', {
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: ReasonPhrases.BAD_REQUEST,
          });

          return res.status(StatusCodes.BAD_REQUEST).json({
            success: false,
            statusCode: StatusCodes.BAD_REQUEST,
            message: 'A nova senha não pode ser nula.',
          });
        }

        const isOldPasswordCorrect = await comparePassword(
          oldPassword,
          user.password
        );

        if (isOldPasswordCorrect) {
          const hashedPassword: string = await hashPassword(newPassword);

          user.password = hashedPassword;
          user.updated_at = moment(new Date())
            .tz('America/Sao_Paulo')
            .toISOString() as unknown as Date;

          const updatedUser = await User.findByIdAndUpdate(
            { _id: user.id },
            {
              $set: user,
            },
            { new: true }
          );

          if (updatedUser) {
            logger.debug('Senha atualizada com sucesso.', {
              success: true,
              statusCode: StatusCodes.OK,
              label: 'UserController',
              method: 'PATCH',
            });

            return res.status(StatusCodes.OK).json({
              success: true,
              statusCode: StatusCodes.OK,
              message: 'Senha atualizada com sucesso.',
              oldPassword,
              newPassword,
            });
          }

          logger.error('Falha ao atualizar a senha.', {
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            error: ReasonPhrases.INTERNAL_SERVER_ERROR,
          });

          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: 'Falha ao atualizar a senha.',
          });
        }
      }
    } catch (error) {
      logger.error('Falha ao atualizar a senha.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao atualizar a senha.',
      });
    }
  };

  // [TO TEST] Update user by id
  updateUserById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, email, profile_picture } = req.body;

      logger.info(name);
      logger.info(email);
      logger.info(profile_picture);

      const user = await User.findById(id);

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'PUT',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        if (name) {
          user.name = name;

          logger.info(user.name);
        }

        if (email) {
          user.email = email;

          logger.info(user.email);
        }

        if (profile_picture) {
          user.profile_picture = profile_picture;

          logger.info(user.profile_picture);
        }

        user.updated_at = moment(new Date())
          .tz('America/Sao_Paulo')
          .toISOString() as unknown as Date;

        const updatedUser = await User.findByIdAndUpdate(
          { _id: user.id },
          {
            $set: user,
          },
          { new: true }
        );

        if (updatedUser) {
          logger.debug('Usuário atualizado com sucesso.', {
            success: true,
            statusCode: StatusCodes.OK,
            label: 'UserController',
            method: 'PUT',
          });

          return res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Usuário atualizado com sucesso.',
            user: updatedUser,
          });
        }

        logger.error('Falha ao atualizar o usuário.', {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Falha ao atualizar o usuário.',
        });
      }
    } catch (error) {
      logger.error('Falha ao atualizar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao atualizar o usuário.',
      });
    }
  };

  // [TO TEST] Update own user
  updateUser = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'PUT',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        const { name, email } = req.body;

        if (req.file) {
          user.profile_picture = req.file.filename;
        }

        if (name) {
          user.name = name;
        }

        if (email) {
          const { valid, reason, validators }: any = (await isEmailValid(
            email
          )) as any;

          if (!valid) {
            return res.status(StatusCodes.BAD_REQUEST).json({
              status: StatusCodes.BAD_REQUEST,
              message: 'Por favor, forneça um e-mail válido!',
              reason: validators[reason].reason,
            });
          }

          const userExists = await User.findOne({ email });

          if (userExists) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
              status: StatusCodes.UNAUTHORIZED,
              message: 'Usuário já existe, escolha outro endereço de e-mail',
            });
          }

          user.email = email;
        }

        user.updated_at = moment(new Date())
          .tz('America/Sao_Paulo')
          .toISOString() as unknown as Date;

        const updatedUser = await User.findByIdAndUpdate(
          { _id: user.id },
          {
            $set: user,
          },
          { new: true }
        );

        if (updatedUser) {
          logger.debug('Usuário atualizado com sucesso.', {
            success: true,
            statusCode: StatusCodes.NO_CONTENT,
            label: 'UserController',
            method: 'PUT',
            updatedUser,
          });

          return res.status(StatusCodes.NO_CONTENT).send();
        }

        logger.error('Falha ao atualizar o usuário.', {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Falha ao atualizar o usuário.',
        });
      }
    } catch (error) {
      logger.error('Falha ao atualizar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao atualizar o usuário.',
      });
    }
  };

  updateRole = async (req: Request, res: Response) => {
    const { role } = req.body;
    const userId = req.params.id;

    const user = await User.findById({ _id: userId });

    if (role === null || role === undefined || role === '') {
      logger.error('A [ role ] não pode ser nula.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: ReasonPhrases.BAD_REQUEST,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'A [ role ] não pode ser nula.',
      });
    }

    if (user) {
      user.role = role;
      user.updated_at = moment(new Date())
        .tz('America/Sao_Paulo')
        .toISOString() as unknown as Date;

      const updatedUser = await User.findByIdAndUpdate(
        { _id: userId },
        {
          $set: user,
        },
        { new: true }
      );

      if (updatedUser) {
        logger.debug('Role atualizada com sucesso.', {
          success: true,
          statusCode: StatusCodes.OK,
          label: 'UserController',
          method: 'PATCH',
        });

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Role atualizada com sucesso.',
        });
      }

      logger.error('Falha ao atualizar a role de usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });
    }
  };

  // [TO TEST] Delete own user
  deleteProfile = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'DELETE',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        const deletedUser = await User.findByIdAndDelete({ _id: user.id });

        if (deletedUser) {
          logger.debug('Usuário deletado com sucesso.', {
            success: true,
            statusCode: StatusCodes.NO_CONTENT,
            label: 'UserController',
            method: 'DELETE',
          });

          return res.status(StatusCodes.NO_CONTENT).send();
        }

        logger.error('Falha ao deletar o usuário.', {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Falha ao deletar o usuário.',
        });
      }
    } catch (error) {
      logger.error('Falha ao deletar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao deletar o usuário.',
      });
    }
  };

  // [TO TEST] Delete a user by its Id
  deleteUser = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'DELETE',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete({ _id: id });

        if (deletedUser) {
          logger.debug(`Usuário deletado com sucesso por ${user.name}.`, {
            success: true,
            statusCode: StatusCodes.NO_CONTENT,
            label: 'UserController',
            method: 'DELETE',
          });

          return res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: `Usuário removido com sucesso por ${user.name}`,
            deletedUser: {
              id: deletedUser.id,
              name: deletedUser.name,
              email: deletedUser.email,
              role: deletedUser.role,
              status: deletedUser.status,
              profile_picture: deletedUser.profile_picture,
              email_verified_at: deletedUser.email_verified_at,
              lastLoginDate: deletedUser.lastLoginDate,
              currentLoginDate: deletedUser.currentLoginDate,
              created_at: deletedUser.created_at,
              updated_at: deletedUser.updated_at,
            },
          });
        }

        logger.error('Falha ao deletar o usuário.', {
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          error: ReasonPhrases.INTERNAL_SERVER_ERROR,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Falha ao deletar o usuário.',
        });
      }
    } catch (error) {
      logger.error('Falha ao deletar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao deletar o usuário.',
      });
    }
  };

  activateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findById({
        _id: id,
      });

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'PATCH',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        const activatedUser = await User.findByIdAndUpdate(
          id,
          { status: 'active' },
          { new: true }
        );

        if (activatedUser) {
          logger.debug('Usuário ativado com sucesso.', {
            success: true,
            statusCode: StatusCodes.OK,
            label: 'UserController',
            method: 'PATCH',
          });

          return res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Usuário ativado com sucesso.',
            activatedUser: {
              id: activatedUser.id,
              name: activatedUser.name,
              email: activatedUser.email,
              role: activatedUser.role,
              status: activatedUser.status,
              profile_picture: activatedUser.profile_picture,
              email_verified_at:
                activatedUser.email_verified_at !== null
                  ? moment(activatedUser.email_verified_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              lastLoginDate:
                activatedUser.lastLoginDate !== null
                  ? moment(activatedUser.lastLoginDate)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              currentLoginDate:
                activatedUser.currentLoginDate !== null
                  ? moment(activatedUser.currentLoginDate)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              created_at:
                activatedUser.created_at !== null
                  ? moment(activatedUser.created_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              updated_at:
                activatedUser.updated_at !== null
                  ? moment(activatedUser.updated_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
            },
          });
        }
      }
    } catch (error) {
      logger.error('Falha ao ativar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao ativar o usuário.',
      });
    }
  };

  deactivateUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await User.findById({
        _id: id,
      });

      if (!user) {
        logger.debug('Usuário não encontrado!', {
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          label: 'UserController',
          method: 'PATCH',
        });

        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Usuário não encontrado!',
        });
      }

      if (user) {
        const deactivatedUser = await User.findByIdAndUpdate(
          id,
          { status: 'inactive' },
          { new: true }
        );

        if (deactivatedUser) {
          logger.debug('Usuário ativado com sucesso.', {
            success: true,
            statusCode: StatusCodes.OK,
            label: 'UserController',
            method: 'PATCH',
          });

          return res.status(StatusCodes.OK).json({
            success: true,
            statusCode: StatusCodes.OK,
            message: 'Usuário desativado com sucesso.',
            deactivatedUser: {
              id: deactivatedUser.id,
              name: deactivatedUser.name,
              email: deactivatedUser.email,
              role: deactivatedUser.role,
              status: deactivatedUser.status,
              profile_picture: deactivatedUser.profile_picture,
              email_verified_at:
                deactivatedUser.email_verified_at !== null
                  ? moment(deactivatedUser.email_verified_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              lastLoginDate:
                deactivatedUser.lastLoginDate !== null
                  ? moment(deactivatedUser.lastLoginDate)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              currentLoginDate:
                deactivatedUser.currentLoginDate !== null
                  ? moment(deactivatedUser.currentLoginDate)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              created_at:
                deactivatedUser.created_at !== null
                  ? moment(deactivatedUser.created_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
              updated_at:
                deactivatedUser.updated_at !== null
                  ? moment(deactivatedUser.updated_at)
                      .tz('America/Sao_Paulo')
                      .format('DD/MM/YYYY HH:mm:ss')
                  : null,
            },
          });
        }
      }
    } catch (error) {
      logger.error('Falha ao desativar o usuário.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao desativar o usuário.',
      });
    }
  };
}

export default new UserController();
