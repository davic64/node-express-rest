import jwt from 'jsonwebtoken';
import config from '../config/config';
import { TokenType } from '@prisma/client';

export interface TokenPayload {
  sub: string;
  iat: number;
  exp: any;
  type: TokenType;
}

export const generateToken = (payload: TokenPayload, secret: string): string => {
  return jwt.sign(payload, secret ?? config.JWT_SECRET);
};

export const verifyToken = (token: string, secret: string): TokenPayload => {
  return jwt.verify(token, secret ?? config.JWT_SECRET) as TokenPayload;
};
