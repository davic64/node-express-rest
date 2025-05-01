import httpStatus from 'http-status';
import { NextFunction, Request, Response } from 'express';
import { z, ZodError, AnyZodObject, ZodTypeAny } from 'zod';

import { ApiError } from '../utils/errors';

const STANDARD_REQUEST_PARTS = ['query', 'params', 'body'];

const validate =
  (schema: AnyZodObject | ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    try {
      let objectToValidate: Record<string, unknown>; // Replace 'any' with a more specific type
      let validationSchema: ZodTypeAny;

      const isZodObject = schema instanceof z.ZodObject;
      const schemaTopLevelKeys = isZodObject ? Object.keys(schema.shape) : [];

      const isStructuredSchema =
        isZodObject && schemaTopLevelKeys.some(key => STANDARD_REQUEST_PARTS.includes(key));

      if (isStructuredSchema) {
        validationSchema = schema;
        objectToValidate = {};

        schemaTopLevelKeys.forEach(key => {
          if (STANDARD_REQUEST_PARTS.includes(key) && req[key as keyof Request] !== undefined) {
            objectToValidate[key] = req[key as keyof Request];
          }
        });
      } else {
        validationSchema = schema;
        objectToValidate = req.body;
      }

      const validationResult = validationSchema.safeParse(objectToValidate);
      if (validationResult.success) {
        (req as any).locals = (req as any).locals || {};
        (req as any).locals.validated = validationResult.data;
        next();
      } else {
        const error: ZodError = validationResult.error;

        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Errors',
          error.errors.map(issue => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        );
      }
    } catch (error) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid request');
    }
  };

export default validate;
