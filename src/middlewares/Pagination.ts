import { Request } from 'express';
import { StatusCodes } from 'http-status-codes';
import logger from '../config/winston-logger';
import { INote } from './../models/interfaces/note';
import { IPagination } from './../models/interfaces/pagination';
import { IUser } from './../models/interfaces/user';

const paginate = async (model: any, req: Request, res: any) => {
  const page: number = Number(req.query.page) || 1;
  const limit: number = Number(req.query.limit) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const result: IPagination = {
    totalDocuments: 0,
    totalPages: 0,
    previous: {
      page: 0,
      limit: 0,
    },
    current: {
      page: 0,
      limit: 0,
    },
    next: {
      page: 0,
      limit: 0,
    },
    data: {} as IUser[] | INote[],
  };

  try {
    result.totalDocuments = await model.countDocuments().exec();
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error counting documents',
      error,
    });
  }

  try {
    result.totalPages = Math.ceil(result.totalDocuments / limit);
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error counting pages',
      error,
    });
  }

  if (endIndex < (await model.countDocuments().exec())) {
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

  try {
    if (limit === 0 || limit > result.data.length) {
      result.data = await model.find().skip(startIndex).exec();
    }

    result.data = await model.find().limit(limit).skip(startIndex).exec();
  } catch (error) {
    logger.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: 'Error finding documents',
      error,
    });
  }

  result.current = {
    page,
    limit,
  };

  res.paginatedResult = result;

  logger.debug('Dados encontrados com sucesso.', {
    success: true,
    statusCode: StatusCodes.OK,
    label: model.collection.collectionName,
    method: 'GET',
    result,
  });

  return result;
};

export { paginate };
