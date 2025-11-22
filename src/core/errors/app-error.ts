import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class AppError extends Error {
  abstract readonly status_code: HttpStatus;
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }

  toHttpException(): HttpException {
    // 4xx errors use "fail", 5xx errors use "error"
    const isServerError = this.status_code >= 500;

    const errorDetail = {
      code: this.code,
      message: this.message,
    };

    if (isServerError) {
      return new HttpException(
        {
          status: 'error',
          error: errorDetail,
        },
        this.status_code,
      );
    }

    return new HttpException(
      {
        status: 'fail',
        error: errorDetail,
      },
      this.status_code,
    );
  }
}

export class ValidationError extends AppError {
  readonly status_code = HttpStatus.BAD_REQUEST;
  readonly code = 'VALIDATION_ERROR';

  constructor(message: string) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  readonly status_code = HttpStatus.NOT_FOUND;
  readonly code = 'NOT_FOUND';

  constructor(message: string) {
    super(message);
  }
}

export class UnauthorizedError extends AppError {
  readonly status_code = HttpStatus.UNAUTHORIZED;
  readonly code = 'UNAUTHORIZED';

  constructor(message: string = 'Unauthorized access') {
    super(message);
  }
}

export class ForbiddenError extends AppError {
  readonly status_code = HttpStatus.FORBIDDEN;
  readonly code = 'FORBIDDEN';

  constructor(message: string = 'Forbidden') {
    super(message);
  }
}

export class ConflictError extends AppError {
  readonly status_code = HttpStatus.CONFLICT;
  readonly code = 'CONFLICT';

  constructor(message: string) {
    super(message);
  }
}

export class DatabaseError extends AppError {
  readonly status_code = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly code = 'DATABASE_ERROR';

  constructor(message: string = 'Database operation failed') {
    super(message);
  }
}

export class InternalError extends AppError {
  readonly status_code = HttpStatus.INTERNAL_SERVER_ERROR;
  readonly code = 'INTERNAL_ERROR';

  constructor(message: string = 'An internal error occurred') {
    super(message);
  }
}
