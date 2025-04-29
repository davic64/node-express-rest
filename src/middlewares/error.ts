import type { Request, Response } from "express";
import config, { logger } from "../config/config";

const errorMiddleware = (err: any, req: Request, res: Response) => {
  const statusCode = err.statusCode || 500;
  logger.error(`[${req.method}] ${req.path} - ${statusCode} - ${err.message}`, {
    stack: err.stack,
    ip: req.ip,
    body: req.body,
  });

  const responseMessage =
    config.NODE_ENV === "production" && statusCode === 500
      ? "Internal Server Error"
      : err.message;

  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    statusCode,
    message: responseMessage,
    ...(config.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

export default errorMiddleware;
