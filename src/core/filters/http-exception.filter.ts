import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AppError } from '../errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof AppError) {
      // AppError already formats correctly via toHttpException()
      const httpException = exception.toHttpException();
      const status = httpException.getStatus();
      const body = httpException.getResponse();

      return response.status(status).json(body);
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      // If it's already in the correct format, return as-is
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'status' in exceptionResponse
      ) {
        return response.status(status).json(exceptionResponse);
      }

      // Format NestJS validation errors and other HttpExceptions
      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any)?.message || 'An error occurred';

      const formattedMessage = Array.isArray(message) ? message.join('; ') : message;

      // 4xx errors use "fail", 5xx errors use "error"
      const isServerError = status >= 500;

      const errorDetail = {
        code: 'HTTP_EXCEPTION',
        message: formattedMessage,
      };

      if (isServerError) {
        return response.status(status).json({
          status: 'error',
          error: errorDetail,
        });
      }

      return response.status(status).json({
        status: 'fail',
        error: errorDetail,
      });
    }

    // Handle unknown errors
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 'error',
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An internal server error occurred',
      },
    });
  }
}

