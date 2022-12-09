import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import logger from '../config/winston-logger';
import { paginate } from '../middlewares/Pagination';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { comparePassword, hashPassword } from '../middlewares/ValidatePassword';
import { IUser } from '../models/interfaces/user';
import User from '../models/User';
import { isEmailValid } from '../utils/Validations';

class UserController {
  // [TO TEST] Get all users
  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const response = await paginate(User, req, res);

    response.data = response.data.map((user: IUser) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: user.profile_picture,
        created_at: user.created_at,
        updated_at: user.updated_at,
      };
    });

    const allData = Object.assign({}, ...response.data);

    response.data = allData;

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
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            profile_picture: user.profile_picture,
            created_at: user.created_at,
            updated_at: user.updated_at,
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
      logger.error('Não é possível buscar o usuário.', {
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
      logger.error('Não é possível buscar o usuário por este campo.', {
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
      });

      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Não é possível buscar o usuário por este campo.',
      });
    }

    if (value === null || value === undefined || value === '') {
      const result = await paginate(User, req, res);

      res.status(StatusCodes.OK).json(result);
    }

    try {
      const user = await User.find({
        [field]: { $regex: value, $options: 'i' },
      }).select('-password');

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
          user,
        });
      }

      logger.error('Usuário não encontrado.', {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        error: ReasonPhrases.NOT_FOUND,
      });

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

  // [TO TEST] Update user's password
  updateUserPassword = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

      logger.info('Dados do Usuario', {
        user,
      });

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
          const hashedPassword = await hashPassword(newPassword);

          const updatedUser = await User.updateOne(
            { password: hashedPassword },
            { _id: user.id }
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

  // [TO TEST] Update user
  updateUser = async (req: Request, res: Response) => {
    try {
      const token = getUserToken(req) as string;
      const user = await getUserByToken(token);

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
        const { name, email, password, role } = req.body;

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

        if (password) {
          const hashedPassword = await hashPassword(password);

          user.password = hashedPassword;
        }

        if (role) {
          user.role = role;
        }

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
            method: 'PATCH',
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
            message: `Usuário deletado com sucesso por ${user.name}`,
            deletedUser: {
              id: deletedUser.id,
              name: deletedUser.name,
              email: deletedUser.email,
              role: deletedUser.role,
              profile_picture: deletedUser.profile_picture,
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
}

export default new UserController();
