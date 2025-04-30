import { Request, Response, NextFunction } from "express";
import passport from "../config/passport";
import httpStatus from "http-status";
import { ApiError } from "../utils/errors";

export const authJWT = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: Express.User | false | null, info: any) => {
      if (err) return next(err);
      if (!user) {
        let message = "Unauthorized";
        if (info instanceof Error) message = info.message;

        return next(new ApiError(httpStatus.UNAUTHORIZED, message));
      }

      req.user = user;
      next();
    }
  )(req, res, next);
};
