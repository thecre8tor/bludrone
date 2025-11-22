/**
 * Result type implementation similar to Rust's Result<T, E>
 * Represents either success (Ok) or failure (Err)
 */

export type Result<T, E = Error> = Ok<T, E> | Err<T, E>;

export class Ok<T, E> {
  readonly ok: boolean = true;
  readonly err: boolean = false;

  constructor(readonly value: T) {}

  isOk(): this is Ok<T, E> {
    return true;
  }

  isErr(): this is Err<T, E> {
    return false;
  }

  unwrap(): T {
    return this.value;
  }

  unwrapOr(_defaultValue: T): T {
    return this.value;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    return ok(fn(this.value));
  }

  mapErr<F>(_fn: (error: E) => F): Result<T, F> {
    return ok(this.value);
  }
}

export class Err<T, E> {
  readonly ok: false = false;
  readonly err: true = true;

  constructor(readonly error: E) {}

  isOk(): this is Ok<T, E> {
    return false;
  }

  isErr(): this is Err<T, E> {
    return true;
  }

  unwrap(): never {
    throw this.error;
  }

  unwrapOr(defaultValue: T): T {
    return defaultValue;
  }

  map<U>(_fn: (value: T) => U): Result<U, E> {
    return err(this.error);
  }

  mapErr<F>(fn: (error: E) => F): Result<T, F> {
    return err(fn(this.error));
  }
}

// Helper functions to create Result types
export function ok<T, E = never>(value: T): Ok<T, E> {
  return new Ok(value);
}

export function err<T = never, E = Error>(error: E): Err<T, E> {
  return new Err(error);
}

// Utility to convert async operations to Result
export async function tryCatch<T, E = Error>(
  fn: () => Promise<T>,
  errorHandler?: (error: unknown) => E,
): Promise<Result<T, E>> {
  try {
    const value = await fn();
    return ok(value);
  } catch (error) {
    const handledError = errorHandler ? errorHandler(error) : (error as E);
    return err(handledError);
  }
}

// Utility for synchronous operations
export function tryCatchSync<T, E = Error>(
  fn: () => T,
  errorHandler?: (error: unknown) => E,
): Result<T, E> {
  try {
    const value = fn();
    return ok(value);
  } catch (error) {
    const handledError = errorHandler ? errorHandler(error) : (error as E);
    return err(handledError);
  }
}
