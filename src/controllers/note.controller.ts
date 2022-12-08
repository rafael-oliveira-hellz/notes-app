import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { paginate } from '../middlewares/Pagination';
import { getUserByToken, getUserToken } from '../middlewares/TokenControl';
import { IUser } from '../models/interfaces/user';
import Note from '../models/Note';

class NoteController {
  // [TO TEST] Get all notes (admin only)
  listAll = async (req: Request, res: Response): Promise<Response> => {
    const response = await paginate(Note, req, res);

    return res.status(StatusCodes.OK).json(response);
  };

  // [ ] Get all notes from the logged in user
  listAllFromUser = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = getUserByToken(token) as unknown as IUser;

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

  // [ ] Get a note by field
  findByField = async (req: Request, res: Response): Promise<Response> => {
    const field = String(req.query.field);
    const value = String(req.query.value);

    const note = await Note.findOne({ [field]: value });

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

    const { title, content, start_date, due_date } = req.body;

    if (!title || !content || !start_date || !due_date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Todos os campos são obrigatórios.',
      });
    }

    const note = await Note.create({
      title,
      content,
      start_date,
      due_date,
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

  // [ ] Update a note from the logged in user
  update = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = getUserByToken(token) as unknown as IUser;

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

    const userNote = note.assignee
      ? note.assignee.toString() === user.id
      : false;

    if (!userNote) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a atualizar esta anotação.',
      });
    }

    const { title, content, start_date, due_date } = req.body;

    if (!title || !content || !start_date || !due_date) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Todos os campos são obrigatórios.',
      });
    }

    const updatedNote = await Note.findByIdAndUpdate(
      id,
      {
        title,
        content,
        start_date,
        due_date,
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

    return res.status(StatusCodes.NO_CONTENT).send();
  };

  // [ ] Delete a note from the logged in user
  delete = async (req: Request, res: Response): Promise<Response> => {
    const token = getUserToken(req) as string;
    const user = getUserByToken(token) as unknown as IUser;

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a deletar uma anotação.',
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

    const userNote = note.assignee
      ? note.assignee.toString() === user.id
      : false;

    if (!userNote) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        statusCode: StatusCodes.UNAUTHORIZED,
        message: 'Você não está autorizado a deletar esta anotação.',
      });
    }

    const deletedNote = await Note.findByIdAndDelete(id);

    if (!deletedNote) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Não foi possível deletar a anotação.',
      });
    }

    return res.status(StatusCodes.NO_CONTENT).send();
  };
}

export default new NoteController();
