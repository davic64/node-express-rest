export class ApiError extends Error {
  public errors?: string[];
  public statusCode: number;

  constructor(statusCode: number, message: string, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = "Resource not found") {
    super(404, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = "Bad request", errors?: string[]) {
    super(400, message, errors);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
