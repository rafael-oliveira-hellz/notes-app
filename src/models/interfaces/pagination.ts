import { INote } from './note';
import { IUser } from './user';

export interface IPagination {
  totalDocuments: number;
  totalPages: number;
  previous: {
    page: number;
    limit: number;
  };
  current: {
    page: number;
    limit: number;
  };
  next: {
    page: number;
    limit: number;
  };
  data: INote[] | IUser[];
}
