import { validate } from 'deep-email-validator';

const isEmailValid = async (email: string) => {
  return validate(email);
};

export { isEmailValid };
