import { Request, Response, NextFunction, RequestHandler } from "express";
import { z } from "zod";
import { BadRequestError } from "../utils/errors";

const validate = (
  schema: z.AnyZodObject,
  property: "body" | "query" | "params" = "body"
): RequestHandler => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const dataToValidate = req[property];

    const parsed = schema.parse(dataToValidate);

    if (!parsed.success) {
      const validationErrors = Object.values(
        parsed.error.flatten().fieldErrors
      ).flat() as string[];

      const validateError = new BadRequestError(
        "Validation data failed",
        validationErrors
      );
      return next(validateError);
    } else {
      req[property] = parsed.data;
      next();
    }
  };
};

export default validate;
