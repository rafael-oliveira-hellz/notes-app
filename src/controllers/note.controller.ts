import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import moment from 'moment-timezone';
import logger from '../config/winston-logger';
import { paginate } from '../middlewares/Pagination';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { IUser } from '../models/interfaces/user';
import Note from '../models/Note';

class NoteController {
  // [TO TEST] Get all notes (admin only)
  listAll = async (req: Request, res: Response): Promise<Response> => {
    const response = await paginate(Note, req, res);

    if (!response || response.data === undefined || response.data === null) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    response.data = response.data.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
    });

    return res.status(StatusCodes.OK).json(response);
  };

  // [TO TEST] Get all notes from the logged in user
  listAllFromUser = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    const userNotes = await Note.find({ assignee: user.id });

    if (userNotes.length === 0 || !userNotes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada para este usuário.',
      });
    }

    const notes = userNotes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
    });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada para este usuário.',
      });
    }

    if (notes.length > 1) {
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

      result.totalDocuments = notes.length;
      result.totalPages = Math.ceil(notes.length / limit);
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
      result.data = notes.slice(startIndex, endIndex);

      if (endIndex < notes.length) {
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
        message: 'Anotações encontradas com sucesso.',
        result,
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Anotação encontrada com sucesso.',
      notes,
    });
  };

  // [TO TEST] Get a note by id (user or admin)
  findByid = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada com este ID.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      note: {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
    });
  };

  // [TO TEST] Get a note by field
  findByField = async (req: Request, res: Response): Promise<Response> => {
    const field = String(req.query.field);
    const value = String(req.query.value);

    if (field === null || field === undefined || field === '') {
      logger.error('Não é possível buscar a anotação.', {
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

    if (value === null || value === undefined || value === '') {
      const result = await paginate(Note, req, res);

      if (
        result === null ||
        result.data.length === 0 ||
        result.data === undefined ||
        result.data === null
      ) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Nenhuma anotação encontrada para este usuário.',
        });
      }

      result.data = result.data.map((note: any) => {
        return {
          id: note?.id,
          title: note?.title,
          subject: note?.subject,
          content: note?.content,
          start_date:
            note?.start_date !== null
              ? moment(note?.start_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          due_date:
            note?.due_date !== null
              ? moment(note?.due_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          status: note?.status,
          assignee: note?.assignee,
          created_at:
            note?.created_at !== null
              ? moment(note?.created_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          updated_at:
            note?.updated_at !== null
              ? moment(note?.updated_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
        };
      });

      res.status(StatusCodes.OK).json(result);
    }

    try {
      const notes = await Note.find({
        [field]: { $regex: value, $options: 'i' },
      });

      if (notes.length === 0 || notes === null || notes === undefined) {
        return res.status(StatusCodes.NOT_FOUND).json({
          success: false,
          statusCode: StatusCodes.NOT_FOUND,
          message: 'Nenhuma anotação encontrada para este usuário.',
        });
      }

      const allNotes = notes.map((note: any) => {
        return {
          id: note?.id,
          title: note?.title,
          subject: note?.subject,
          content: note?.content,
          start_date:
            note?.start_date !== null
              ? moment(note?.start_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          due_date:
            note?.due_date !== null
              ? moment(note?.due_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          status: note?.status,
          assignee: note?.assignee,
          created_at:
            note?.created_at !== null
              ? moment(note?.created_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          updated_at:
            note?.updated_at !== null
              ? moment(note?.updated_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
        };
      });

      if (notes) {
        if (allNotes.length > 1) {
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

          result.totalDocuments = allNotes.length;
          result.totalPages = Math.ceil(allNotes.length / limit);
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
          result.data = allNotes.slice(startIndex, endIndex);

          if (endIndex < allNotes.length) {
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
            message: 'Anotações encontradas com sucesso.',
            result,
          });
        }

        logger.debug('Anotação encontrada com sucesso.', {
          success: true,
          statusCode: StatusCodes.OK,
          label: 'NoteController',
          method: 'GET',
        });

        return res.status(StatusCodes.OK).json({
          success: true,
          statusCode: StatusCodes.OK,
          message: 'Anotação encontrada com sucesso.',
          notes: allNotes,
        });
      }

      logger.error('Anotação não encontrada.', {
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        error: ReasonPhrases.NOT_FOUND,
      });

      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Anotação não encontrada.',
      });
    } catch (error) {
      logger.error('Falha ao buscar anotação.', {
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
      });

      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Falha ao buscar anotação.',
      });
    }
  };

  // [TO TEST] Get the notes where start_date and due_date are null
  getNotesWithoutDates = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a buscar anotações.',
      });
    }

    // find notes where start_date and due_date are null with mongoose
    const notes = await Note.find({
      $and: [{ start_date: null }, { due_date: null }],
    });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    const allNotes = notes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
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

    result.totalDocuments = allNotes.length;
    result.totalPages = Math.ceil(allNotes.length / limit);
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
    result.data = allNotes.slice(startIndex, endIndex);

    if (endIndex < allNotes.length) {
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
      message: 'Anotações encontradas com sucesso.',
      result,
    });
  };

  // [TO TEST] Get notes with status 'pending'
  listPending = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a buscar anotações.',
      });
    }

    const notes = await Note.find({ status: 'pending' });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    console.log(notes);

    const allNotes = notes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
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

    result.totalDocuments = allNotes.length;
    result.totalPages = Math.ceil(allNotes.length / limit);
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
    result.data = allNotes.slice(startIndex, endIndex);

    if (endIndex < allNotes.length) {
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
      message: 'Anotações encontradas com sucesso.',
      result,
    });
  };

  // [TO TEST] Get notes with status 'completed'
  listCompleted = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a buscar anotações.',
      });
    }

    const notes = await Note.find({
      status: 'completed',
    });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    const allNotes = notes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
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

    result.totalDocuments = allNotes.length;
    result.totalPages = Math.ceil(allNotes.length / limit);
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
    result.data = allNotes.slice(startIndex, endIndex);

    if (endIndex < allNotes.length) {
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
      message: 'Anotações encontradas com sucesso.',
      result,
    });
  };

  // [To Test] Get notes with status 'overdue'
  listOverdue = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a buscar anotações.',
      });
    }

    const notes = await Note.find({
      status: 'overdue',
    });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    const allNotes = notes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
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

    result.totalDocuments = allNotes.length;
    result.totalPages = Math.ceil(allNotes.length / limit);
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
    result.data = allNotes.slice(startIndex, endIndex);

    if (endIndex < allNotes.length) {
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
      message: 'Anotações encontradas com sucesso.',
      result,
    });
  };

  // [ ] Get all the notes from a specific user (admin only)
  getAllUserNotes = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;

    const notes = await Note.find({
      assignee: id,
    });

    if (notes.length === 0 || !notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    const allNotes = notes.map((note: any) => {
      return {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      };
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

    result.totalDocuments = allNotes.length;
    result.totalPages = Math.ceil(allNotes.length / limit);
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
    result.data = allNotes.slice(startIndex, endIndex);

    if (endIndex < allNotes.length) {
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
      message: 'Anotações encontradas com sucesso.',
      result,
    });
  };

  // [x] Create a note
  create = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a criar uma anotação.',
      });
    }

    const { title, subject, content, start_date, due_date } = req.body;

    if (!title || !subject || !content) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: "Os campos 'title', 'subject' e 'content' são obrigatórios.",
      });
    }

    if (start_date && due_date) {
      if (start_date > due_date) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          statusCode: StatusCodes.BAD_REQUEST,
          message: 'A data de início não pode ser maior que a data de término.',
        });
      }

      const note = await Note.create({
        title,
        subject,
        content,
        start_date,
        due_date,
        assignee: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      });

      if (!note) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Não foi possível criar a anotação.',
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        note: {
          id: note?.id,
          title: note?.title,
          subject: note?.subject,
          content: note?.content,
          start_date:
            note?.start_date !== null
              ? moment(note?.start_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          due_date:
            note?.due_date !== null
              ? moment(note?.due_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          status: note?.status,
          assignee: note?.assignee,
          created_at:
            note?.created_at !== null
              ? moment(note?.created_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          updated_at:
            note?.updated_at !== null
              ? moment(note?.updated_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
        },
      });
    }

    if (start_date && !due_date) {
      const note = await Note.create({
        title,
        subject,
        content,
        start_date,
        assignee: user.id,
      });

      if (!note) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: 'Não foi possível criar a anotação.',
        });
      }

      return res.status(StatusCodes.CREATED).json({
        success: true,
        statusCode: StatusCodes.CREATED,
        note: {
          id: note?.id,
          title: note?.title,
          subject: note?.subject,
          content: note?.content,
          start_date:
            note?.start_date !== null
              ? moment(note?.start_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          due_date:
            note?.due_date !== null
              ? moment(note?.due_date)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          status: note?.status,
          assignee: note?.assignee,
          created_at:
            note?.created_at !== null
              ? moment(note?.created_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
          updated_at:
            note?.updated_at !== null
              ? moment(note?.updated_at)
                  .tz('America/Sao_Paulo')
                  .format('DD/MM/YYYY HH:mm:ss')
              : null,
        },
      });
    }

    const note = await Note.create({
      title,
      subject,
      content,
      assignee: user.id,
    });

    if (!note) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Não foi possível criar a anotação.',
      });
    }

    return res.status(StatusCodes.CREATED).json({
      success: true,
      statusCode: StatusCodes.CREATED,
      note: {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
    });
  };

  // [TO TEST] Update a note from the logged in user
  update = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a atualizar uma anotação.',
      });
    }

    const { id } = req.params;

    const note = await Note.findById(id);

    if (!note) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada com este ID.',
      });
    }

    const isAuthorized = note.assignee
      ? note.assignee.toString() === user.id
      : false;

    if (!isAuthorized) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a atualizar esta anotação.',
      });
    }

    const { title, subject, content, start_date, due_date } = req.body;

    if (title !== null || title !== undefined || title !== '')
      note.title = title;
    if (subject !== null || subject !== undefined || subject !== '')
      note.subject = subject;
    if (content !== null || content !== undefined || content !== '')
      note.content = content;
    if (start_date !== null || start_date !== undefined || start_date !== '')
      note.start_date = start_date;
    if (due_date !== null || due_date !== undefined || due_date !== '')
      note.due_date = due_date;

    const updatedNote = await Note.findByIdAndUpdate(
      { _id: note.id },
      {
        $set: note,
      },
      { new: true }
    );

    if (!updatedNote) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Não foi possível atualizar a anotação.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: ReasonPhrases.OK,
      note: {
        id: updatedNote?.id,
        title: updatedNote?.title,
        subject: updatedNote?.subject,
        content: updatedNote?.content,
        start_date:
          updatedNote?.start_date !== null
            ? moment(updatedNote?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          updatedNote?.due_date !== null
            ? moment(updatedNote?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: updatedNote?.status,
        assignee: updatedNote?.assignee,
        created_at:
          updatedNote?.created_at !== null
            ? moment(updatedNote?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          updatedNote?.updated_at !== null
            ? moment(updatedNote?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
    });
  };

  // [TO TEST] Delete a note from the logged in user
  delete = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a deletar uma anotação.',
      });
    }

    const { id } = req.params;

    const note = await Note.findByIdAndDelete({ _id: id });

    if (!note) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada com este ID.',
      });
    }

    logger.info(`Anotação removida com sucesso por ${user.name}`, {
      success: true,
      statusCode: StatusCodes.OK,
      message: ReasonPhrases.OK,
      label: 'NoteController',
      method: 'DELETE',
      note: {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        assignee: note?.assignee,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Anotação removida com sucesso por ${user.name}`,
      deletedNote: {
        id: note?.id,
        title: note?.title,
        subject: note?.subject,
        content: note?.content,
        start_date:
          note?.start_date !== null
            ? moment(note?.start_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        due_date:
          note?.due_date !== null
            ? moment(note?.due_date)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        status: note?.status,
        created_at:
          note?.created_at !== null
            ? moment(note?.created_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        updated_at:
          note?.updated_at !== null
            ? moment(note?.updated_at)
                .tz('America/Sao_Paulo')
                .format('DD/MM/YYYY HH:mm:ss')
            : null,
        assignee: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
          status: user.status,
        },
      },
    });
  };
}

export default new NoteController();
