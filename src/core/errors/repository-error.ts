/**
 * Repository-specific errors
 */
export class RepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RepositoryError';
  }
}

export class ResourceNotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = 'ResourceNotFoundError';
  }
}

export class DuplicateResourceError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = 'DuplicateResourceError';
  }
}

export class InvalidQueryError extends RepositoryError {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidQueryError';
  }
}

