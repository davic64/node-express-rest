import { Request, Response, NextFunction, RequestHandler } from "express";
import { z, ZodSchema } from "zod";
import httpStatus from "http-status";
import { ApiError } from "../utils/errors";

const validate = <T extends ZodSchema>(
  schema: T,
  property: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const dataToValidate = req[property];
      const parsed = schema.parse(dataToValidate);
      req[property] = parsed;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        const validateError = new ApiError(
          httpStatus.BAD_REQUEST,
          "Validation data failed",
          validationErrors as any
        );
        return next(validateError);
      }
      next(error);
    }
  };
};

export default validate;
