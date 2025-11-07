// src/utils/ApiError.ts
export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(
    message: string,
    statusCode: number,
    details?: any,
    isOperational = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = tr;
    Error.captureStackTrace(this);
  }
}
 

export class NotFoundError extends ApiError {
    constructor(message: string = "Resource not found") {
        super(message, 404);
    }}


    
export class ValidationError extends ApiError {
  constructor(message: string = "Invalid request data", details?: any) {
    super(message, 400, details);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = "forbidden acess") {
    super(message, 403);
  }
}
export class AuthError extends ApiError {
  constructor(message: string = "unauthorized acess") {
    super(message, 403);
  }
}

export class DatabaseError extends ApiError {
  constructor(message: string = "DatabaseError", details?: any) {
    super(message, 500, details);
  }
}
export class RateLimitError extends ApiError {
  constructor(message: string = "too many Request try agin later") {
    super(message, 429);
  }
}