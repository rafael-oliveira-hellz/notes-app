import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import { INote } from "./interfaces/note";

const noteSchema = new mongoose.Schema<INote>({
  title: {
    type: String,
    required: true,
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

noteSchema.set("toJSON", {
  transform: (_document: any, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },  
});

const Note = mongoose.model<INote>("Note", noteSchema);

export default Note;