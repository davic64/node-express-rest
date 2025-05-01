import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '@prisma/client';

import { authService, userService, tokenService, emailService } from '../services';
import exclude from '../utils/exclude';

const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  const user = await userService.createUser(email, password, name);
  const userWithoutPassword = exclude(user, ['password', 'createdAt']);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user: userWithoutPassword, tokens });
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  res.send({ user, tokens });
};

const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  await authService.logout(refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const refreshTokens = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshAuth(refreshToken);
  res.send({ ...tokens });
};

const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const resetPasswordToken = await tokenService.generateResetPasswordToken(email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.query;
  const { password } = req.body;
  await authService.resetPassword(token as string, password);
  res.status(httpStatus.NO_CONTENT).send();
};

const sendVerificationEmail = async (req: Request, res: Response) => {
  const user = req.user as User;
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
  await emailService.sendVerificationEmail(user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
};

const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;
  await authService.verifyEmail(token as string);
  res.status(httpStatus.NO_CONTENT).send();
};

export default {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
};
