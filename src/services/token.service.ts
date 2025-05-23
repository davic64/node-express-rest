import dayjs, { Dayjs } from 'dayjs';
import { Token, TokenType } from '@prisma/client';
import httpStatus from 'http-status';

import { generateToken as newToken, TokenPayload, verifyToken as tokenExist } from '../utils/jwt';
import prisma from '../prisma';
import config from '../config/config';
import userService from './user.service';
import { ApiError } from '../utils/errors';

interface TokenResponse {
  token: string;
  expires: Date;
}

export interface AuthTokensResponse {
  access: TokenResponse;
  refresh?: TokenResponse;
}

/**
 * Generate token
 * @param {string} userId
 * @param {Dayjs} expiresIn
 * @param {TokenType} type
 * @param {string} secret
 * @returns {string}
 */
const generateToken = (
  userId: string,
  role: string,
  expiresIn: Dayjs,
  type: TokenType,
  secret = config.JWT_SECRET ?? 'secret',
) => {
  const payload: TokenPayload = {
    sub: userId,
    role,
    iat: dayjs().unix(),
    exp: expiresIn.unix(),
    type,
  };

  return newToken(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {ObjectId} userId
 * @param {Dayjs} expiresIn
 * @param {TokenType} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<Token>}
 */
const saveToken = async (
  token: string,
  userId: string,
  expiresIn: Dayjs,
  type: TokenType,
  blacklisted = false,
): Promise<Token> => {
  const createdToken = prisma.token.create({
    data: {
      token,
      userId,
      expiresIn: expiresIn.toDate(),
      type,
      blacklisted,
    },
  });

  return createdToken;
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {TokenType} type
 * @returns {Promise<Token>}
 */
const verifyToken = async (token: string, type: TokenType): Promise<Token> => {
  const payload = tokenExist(token, config.JWT_SECRET);
  const userId = payload.sub;
  const tokenData = await prisma.token.findFirst({
    where: { token, type, userId, blacklisted: false },
  });

  if (!tokenData) {
    throw new Error('Token not found');
  }
  return tokenData;
};

/**
 * Generate auth tokens
 * @param {ObjectId} userId
 * @returns {Promise<AuthTokensResponse>}
 */
const generateAuthTokens = async (user: any): Promise<AuthTokensResponse> => {
  const accesTokenExpires = dayjs().add(config.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, user.role, accesTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = dayjs().add(config.JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, TokenType.REFRESH);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);

  return {
    access: {
      token: accessToken,
      expires: accesTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }

  const expires = dayjs().add(10, 'minutes');
  const resetPasswordToken = generateToken(user.id, user.role, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TokenType.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {ObjectId} userId
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: {
  id: string;
  email: string;
  role: string;
}): Promise<string> => {
  const expires = dayjs().add(5, 'minutes');
  const verifyEmailToken = generateToken(user.id, user.role, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

/**
 * Delete expired tokens
 * @returns {Promise<void>}
 */
const deleteExpiredTokens = async (): Promise<void> => {
  const now = dayjs();
  await prisma.token.deleteMany({
    where: {
      expiresIn: {
        lt: now.toDate(),
      },
    },
  });
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  generateResetPasswordToken,
  generateVerifyEmailToken,
  deleteExpiredTokens,
};
