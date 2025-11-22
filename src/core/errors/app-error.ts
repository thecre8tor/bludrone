import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class AppError extends Error {
  abstract readonly statusCode: HttpStatus;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toHttpException(): HttpException {
    return new HttpException(
      {
        code: this.code,
        message: this.message,
      },
      this.statusCode,
    );
  }
}

/**
 * Validation error for input validation failures
 */
export class ValidationError extends AppError {
  readonly statusCode = HttpStatus.BAD_REQUEST;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Not found error for missing resources
 */
export class NotFoundError extends AppError {
  readonly statusCode = HttpStatus.NOT_FOUND;
  readonly code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Unauthorized error for authentication failures
 */
export class UnauthorizedError extends AppError {
  readonly statusCode = HttpStatus.UNAUTHORIZED;
  readonly code = 'UNAUTHORIZED';

  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

/**
 * Forbidden error for authorization failures
 */
export class ForbiddenError extends AppError {
  readonly statusCode = HttpStatus.FORBIDDEN;
  readonly code = 'FORBIDDEN';

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

/**
 * Conflict error for conflicting operations
 */
export class ConflictError extends AppError {
  readonly statusCode = HttpStatus.CONFLICT;
  readonly code = 'CONFLICT';

  constructor(message: string) {
    super(message);
  }
}

/**
 * Database error for database operation failures
 */
export class DatabaseError extends AppError {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly code = 'DATABASE_ERROR';

  constructor(message: string = 'Database operation failed') {
    super(message);
  }
}

/**
 * Internal error for unexpected failures
 */
export class InternalError extends AppError {
  readonly statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly code = 'INTERNAL_ERROR';

  constructor(message: string = 'An internal error occurred') {
    super(message);
  }
}
