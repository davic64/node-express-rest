import { Request, Response, NextFunction } from 'express';
import passport from '../config/passport';
import httpStatus from 'http-status';
import { ApiError } from '../utils/errors';
import { User } from '@prisma/client';
import { roleRights } from '../config/roleRights';

const verifyRolePermissions =
  (
    req: any,
    resolve: (value?: unknown) => void,
    reject: (reason?: unknown) => void,
    requiredRights: string[],
  ) =>
  async (err: unknown, user: User | false, info: unknown) => {
    if (err || info || !user)
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'You are not yet authenticated'));

    req.user = user;

    if (requiredRights.length) {
      const userPermissions = roleRights.get(user.role) ?? [];
      const hasRequiredPermissions = requiredRights.every(requiredRight =>
        userPermissions.includes(requiredRight),
      );

      if (!hasRequiredPermissions && req.params.userId !== user.id)
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Access denied, not enough permissions'));
    }

    resolve();
  };

const authJWT =
  (...requiredPermissions: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    return new Promise((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyRolePermissions(req, resolve, reject, requiredPermissions),
      )(req, res, next);
    })
      .then(() => next())
      .catch(err => next(err));
  };

export default authJWT;
