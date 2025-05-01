import { z } from 'zod';

import validateUser from './user.validation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerSchema = validateUser.createUserSchema.extend({});

const logoutSchema = z.object({
  refreshToken: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

const resetPasswordSchema = z.object({
  query: z
    .object({
      token: z.string(),
    })
    .strict(),
  body: z
    .object({
      password: z.string().min(6),
    })
    .strict(),
});

const verifyEmailSchema = z.object({
  query: z.object({ token: z.string() }).strict(),
});

export default {
  loginSchema,
  registerSchema,
  logoutSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
};
