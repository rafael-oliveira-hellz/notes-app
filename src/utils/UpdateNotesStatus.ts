import Note from '../models/Note';
import User from '../models/User';

export const updateNotesStatus = async () => {
  const notes = await Note.find({ status: 'pending' });
  const users = await User.find().select('-password');

  notes.forEach((note) => {
    if (note.due_date && note.due_date < new Date()) {
      note.status = 'overdue';
      note.save();
    }
  });

  users.forEach((user) => {
    if (user?.lastLoginDate !== null && user.lastLoginDate !== null) {
      const currentDate = user?.currentLoginDate;
      const lastLoginDate = user?.lastLoginDate;

      const differenceInDays = Math.floor(
        (currentDate.getTime() - lastLoginDate.getTime()) / (1000 * 3600 * 24)
      );

      if (differenceInDays > 30) {
        user.status = 'inactive';

        user?.save();
      }
    }
  });
};
