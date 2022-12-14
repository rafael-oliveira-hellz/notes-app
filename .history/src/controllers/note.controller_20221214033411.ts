import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import logger from '../config/winston-logger';
import { paginate } from '../middlewares/Pagination';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { IUser } from '../models/interfaces/user';
import Note from '../models/Note';

class NoteController {
  // [TO TEST] Get all notes (admin only)
  listAll = async (req: Request, res: Response): Promise<Response> => {
    const response = await paginate(Note, req, res);

    logger.log('notas', { response });

    return res.status(StatusCodes.OK).json(response);
  };

  // [TO TEST] Get all notes from the logged in user
  listAllFromUser = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = (await getUserByToken(token)) as unknown as IUser;

    const userNotes = await Note.find({ assignee: user.id });

    if (!userNotes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada para este usuário.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      notes: userNotes,
    });
  };

  // [ ] Get a note by id (user or admin)
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
      note,
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

      res.status(StatusCodes.OK).json(result);
    }

    try {
      const note = await Note.find({
        [field]: { $regex: value, $options: 'i' },
      });

      if (note) {
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
          note,
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

    const notes = await Note.find({
      start_date: null,
      due_date: null,
    });

    if (!notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      notes,
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

    const notes = await Note.find({
      status: 'pending',
    });

    if (!notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      notes,
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

    if (!notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      notes,
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

    if (!notes) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        statusCode: StatusCodes.NOT_FOUND,
        message: 'Nenhuma anotação encontrada.',
      });
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      notes,
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
          profile_picture: user.profile_picture,
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
        note,
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
        note,
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
      note,
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
      note.start_date = start_date; // MM DD YYYY
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
      note: updatedNote,
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
        id: note.id,
        title: note.title,
        subject: note.subject,
        content: note.content,
        start_date: note.start_date,
        due_date: note.due_date,
      },
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      statusCode: StatusCodes.OK,
      message: `Anotação removida com sucesso por ${user.name}`,
      deletedNote: {
        id: note.id,
        title: note.title,
        subject: note.subject,
        content: note.content,
        assignee: {
          id: user.id,
          name: user.name,
          email: user.email,
          profile_picture: user.profile_picture,
          status: user.status,
        },
        start_date: note.start_date,
        due_date: note.due_date,
      },
    });
  };
}

export default new NoteController();