import bcrypt from 'bcrypt';

export const comparePassword = async (oldPassword: string, hash: string) => {
  return bcrypt.compare(oldPassword, hash);
};

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 13);
};
