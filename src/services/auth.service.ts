import httpStatus from 'http-status';
import userService from './user.service';
import { ApiError } from '../utils/errors';
import { verifyPassword } from '../utils/crypto';
import exclude from '@/utils/exclude';

/**
 * Login with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
const loginUserWithEmailAndPassword = async (email: string, password: string) => {
  const user = await userService.getUserByEmail(email, ['email', 'name', 'password']);

  if (!user || !(await verifyPassword(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }

  return exclude(user, ['password']);
};

export default {
  loginUserWithEmailAndPassword,
};
