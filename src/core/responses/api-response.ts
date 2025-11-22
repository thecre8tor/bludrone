/**
 * Standardized API response types matching the Rust ApiResponse enum pattern
 */

export interface ErrorDetail {
  code: string;
  message: string;
}

export type ApiResponse<T> =
  | { status: 'success'; message: string; data?: T }
  | { status: 'fail'; error: ErrorDetail }
  | { status: 'error'; error: ErrorDetail }
  | { status: 'redirect' };

export class ApiResponseBuilder {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      status: 'success',
      message,
      data,
    };
  }

  static successWithNoContent(): void {
    // Returns void for 204 No Content
    return;
  }

  static fail(code: string, message: string): ApiResponse<never> {
    return {
      status: 'fail',
      error: {
        code,
        message,
      },
    };
  }

  static error(code: string, message: string): ApiResponse<never> {
    return {
      status: 'error',
      error: {
        code,
        message,
      },
    };
  }

  static redirect(url: string): { status: 'redirect'; url: string } {
    return {
      status: 'redirect',
      url,
    };
  }
}

