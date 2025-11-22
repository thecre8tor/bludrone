import { QueryFailedError } from 'typeorm';
import {
  RepositoryError,
  ResourceNotFoundError,
  DuplicateResourceError,
  ForeignKeyConstraintError,
  CheckConstraintError,
  NotNullConstraintError,
  InvalidQueryError,
  DatabaseConnectionError,
  QueryTimeoutError,
  TransactionError,
  OptimisticLockError,
  DataIntegrityError,
  DatabasePermissionError,
  DatabaseError,
} from './repository-error';
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  DatabaseError as AppDatabaseError,
} from './app-error';

/**
 * Maps database errors to appropriate RepositoryError variants
 * Handles PostgreSQL, MySQL, and other common database errors
 */
export function mapDatabaseError(error: unknown): RepositoryError {
  // If it's already a RepositoryError, return as-is
  if (error instanceof RepositoryError) {
    return error;
  }

  // Handle TypeORM QueryFailedError
  if (error instanceof QueryFailedError) {
    const driverError = error.driverError;
    const code = driverError?.code;
    const message = driverError?.message || error.message;
    const constraint = driverError?.constraint;
    const table = driverError?.table;
    const column = driverError?.column;

    // PostgreSQL error codes
    switch (code) {
      // Unique constraint violation
      case '23505': // unique_violation
        return new DuplicateResourceError(`Duplicate entry: ${message}`, column || constraint);

      // Foreign key constraint violation
      case '23503': // foreign_key_violation
        return new ForeignKeyConstraintError(
          `Foreign key constraint violation: ${message}`,
          table,
          constraint,
        );

      // Not null constraint violation
      case '23502': // not_null_violation
        return new NotNullConstraintError(`Not null constraint violation: ${message}`, column);

      // Check constraint violation
      case '23514': // check_violation
        return new CheckConstraintError(`Check constraint violation: ${message}`, constraint);

      // Exclusion constraint violation
      case '23P01': // exclusion_violation
        return new DataIntegrityError(`Exclusion constraint violation: ${message}`);

      // Invalid query syntax
      case '42601': // syntax_error
      case '42P01': // undefined_table
      case '42P02': // undefined_parameter
        return new InvalidQueryError(`Invalid query: ${message}`, error.query);

      // Connection errors
      case '08003': // connection_does_not_exist
      case '08006': // connection_failure
      case '08001': // sqlclient_unable_to_establish_sqlconnection
        return new DatabaseConnectionError(`Connection error: ${message}`);

      // Query timeout
      case '57014': // query_canceled
        return new QueryTimeoutError(`Query timeout: ${message}`);

      // Transaction errors
      case '40001': // serialization_failure
      case '40P01': // deadlock_detected
        return new TransactionError(`Transaction error: ${message}`, undefined, code === '40P01');

      // Permission errors
      case '42501': // insufficient_privilege
        return new DatabasePermissionError(`Permission denied: ${message}`, undefined, table);

      // Data type mismatch
      case '42804': // datatype_mismatch
        return new DataIntegrityError(`Data type mismatch: ${message}`);

      default:
        return new DatabaseError(`Database error: ${message}`, error);
    }
  }

  // Handle connection timeout errors
  if (error instanceof Error) {
    const errorMessage = error.message.toLowerCase();

    if (errorMessage.includes('timeout') || errorMessage.includes('timed out')) {
      return new QueryTimeoutError(`Query timeout: ${error.message}`);
    }

    if (
      errorMessage.includes('connection') &&
      (errorMessage.includes('refused') || errorMessage.includes('failed'))
    ) {
      return new DatabaseConnectionError(`Connection error: ${error.message}`);
    }

    if (errorMessage.includes('deadlock')) {
      return new TransactionError(`Deadlock detected: ${error.message}`, undefined, true);
    }
  }

  // Fallback to generic DatabaseError
  return new DatabaseError(
    `Unexpected database error: ${error instanceof Error ? error.message : String(error)}`,
    error,
  );
}

/**
 * Converts RepositoryError to appropriate AppError for HTTP responses
 */
export function repositoryErrorToAppError(
  error: RepositoryError,
): AppDatabaseError | NotFoundError | ConflictError | BadRequestError {
  if (error instanceof ResourceNotFoundError) {
    return new NotFoundError(error.message);
  }

  if (error instanceof DuplicateResourceError) {
    return new ConflictError(error.message);
  }

  if (
    error instanceof ForeignKeyConstraintError ||
    error instanceof CheckConstraintError ||
    error instanceof NotNullConstraintError ||
    error instanceof DataIntegrityError
  ) {
    return new BadRequestError(error.message);
  }

  if (error instanceof OptimisticLockError) {
    return new ConflictError(error.message);
  }

  // All other repository errors become DatabaseError (500)
  return new AppDatabaseError(error.message);
}
