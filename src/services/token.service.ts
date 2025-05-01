import { generateToken as newToken, TokenPayload, verifyToken as tokenExist } from '../utils/jwt';
import dayjs, { Dayjs } from 'dayjs';
import { Token, TokenType } from '@prisma/client';
import prisma from '@/prisma';
import config from '../config/config';
import userService from './user.service';
import { ApiError } from '../utils/errors';
import httpStatus from 'http-status';

interface TokenResponse {
  token: string;
  expires: Date;
}

interface AuthTokensResponse {
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
const generateToken = (userId: string, expiresIn: Dayjs, type: TokenType, secret = 'secret') => {
  const payload: TokenPayload = {
    sub: userId,
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
  const payload = await tokenExist(token, config.JWT_SECRET);
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
const generateAuthTokens = async (user: { id: string }): Promise<AuthTokensResponse> => {
  const accesTokenExpires = dayjs().add(config.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
  const accessToken = generateToken(user.id, accesTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = dayjs().add(config.JWT_REFRESH_EXPIRATION_DAYS, 'days');
  const refreshToken = generateToken(user.id, refreshTokenExpires, TokenType.REFRESH);
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
const genereteResetPasswordToken = async (email: string): Promise<string> => {
  const user = await userService.getUserByEmail(email);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No users found with this email');
  }

  const expires = dayjs().add(1, 'minutes');
  const resetPasswordToken = generateToken(user.id, expires, TokenType.RESET_PASSWORD);
  await saveToken(resetPasswordToken, user.id, expires, TokenType.RESET_PASSWORD);
  return resetPasswordToken;
};

/**
 * Generate verify email token
 * @param {ObjectId} userId
 * @param {string} email
 * @returns {Promise<string>}
 */
const generateVerifyEmailToken = async (user: { id: string; email: string }): Promise<string> => {
  const expires = dayjs().add(5, 'minutes');
  const verifyEmailToken = generateToken(user.id, expires, TokenType.VERIFY_EMAIL);
  await saveToken(verifyEmailToken, user.id, expires, TokenType.VERIFY_EMAIL);
  return verifyEmailToken;
};

export default {
  generateToken,
  saveToken,
  verifyToken,
  generateAuthTokens,
  genereteResetPasswordToken,
  generateVerifyEmailToken,
};
