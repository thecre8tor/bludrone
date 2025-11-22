/**
 * Repository-specific errors
 * These are low-level database errors that should be converted to AppError
 * when propagating to the application layer
 */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

/**
 * Resource not found in the database
 */
export class ResourceNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

/**
 * Duplicate resource error (unique constraint violation)
 */
export class DuplicateResourceError extends RepositoryError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'DuplicateResourceError';
  }
}

/**
 * Foreign key constraint violation
 */
export class ForeignKeyConstraintError extends RepositoryError {
  constructor(
    message: string,
    public readonly table?: string,
    public readonly constraint?: string,
  ) {
    super(message);
    this.name = 'ForeignKeyConstraintError';
  }
}

/**
 * Check constraint violation
 */
export class CheckConstraintError extends RepositoryError {
  constructor(
    message: string,
    public readonly constraint?: string,
    public readonly value?: unknown,
  ) {
    super(message);
    this.name = 'CheckConstraintError';
  }
}

/**
 * Not null constraint violation
 */
export class NotNullConstraintError extends RepositoryError {
  constructor(
    message: string,
    public readonly field?: string,
  ) {
    super(message);
    this.name = 'NotNullConstraintError';
  }
}

/**
 * Invalid query syntax or structure
 */
export class InvalidQueryError extends RepositoryError {
  constructor(
    message: string,
    public readonly query?: string,
  ) {
    super(message);
    this.name = 'InvalidQueryError';
  }
}

/**
 * Database connection error
 */
export class DatabaseConnectionError extends RepositoryError {
  constructor(message: string = 'Failed to connect to database') {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

/**
 * Query timeout error
 */
export class QueryTimeoutError extends RepositoryError {
  constructor(
    message: string = 'Query execution timed out',
    public readonly timeout?: number,
  ) {
    super(message);
    this.name = 'QueryTimeoutError';
  }
}

/**
 * Transaction error (rollback, deadlock, etc.)
 */
export class TransactionError extends RepositoryError {
  constructor(
    message: string,
    public readonly transactionId?: string,
    public readonly isDeadlock?: boolean,
  ) {
    super(message);
    this.name = 'TransactionError';
  }
}

/**
 * Optimistic locking conflict (version mismatch)
 */
export class OptimisticLockError extends RepositoryError {
  constructor(
    message: string,
    public readonly entity?: string,
    public readonly expectedVersion?: number,
    public readonly actualVersion?: number,
  ) {
    super(message);
    this.name = 'OptimisticLockError';
  }
}

/**
 * Data integrity violation
 */
export class DataIntegrityError extends RepositoryError {
  constructor(
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'DataIntegrityError';
  }
}

/**
 * Database permission/authorization error
 */
export class DatabasePermissionError extends RepositoryError {
  constructor(
    message: string,
    public readonly operation?: string,
    public readonly resource?: string,
  ) {
    super(message);
    this.name = 'DatabasePermissionError';
  }
}

/**
 * Generic database error (catch-all for unclassified database errors)
 */
export class DatabaseError extends RepositoryError {
  constructor(
    message: string,
    public readonly originalError?: unknown,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}
