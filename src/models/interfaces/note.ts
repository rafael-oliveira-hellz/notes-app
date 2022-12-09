import { IUser } from './user';

export interface INote {
  id: string;
  title: string;
  subject: string;
  content: string;
  start_date: Date;
  due_date: Date;
  assignee?: IUser;
  created_at: Date;
  updated_at: Date;
}
