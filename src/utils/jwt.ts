import jwt from 'jsonwebtoken';
import { TokenType } from '@prisma/client';

import config from '../config/config';

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
  return jwt.verify(token, secret) as TokenPayload;
};
