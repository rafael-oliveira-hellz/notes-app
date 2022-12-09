import { Schema } from 'mongoose';
import mongoose from '../database/connection';
import { INote } from './interfaces/note';

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
  },
  start_date: {
    type: Date,
    required: false,
  },
  due_date: {
    type: Date,
    required: false,
  },
  assignee: {
    type: String,
    ref: 'User',
    required: false,
  },
});

noteSchema.set('toJSON', {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Note = mongoose.model<INote>('Note', noteSchema);

export default Note;
