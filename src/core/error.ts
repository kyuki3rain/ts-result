/**
 * StdError is an interface extending the standard Error object with an optional cause.
 * This aligns with ES2022's Error cause feature.
 */
export interface StdError extends Error {
  cause?: unknown;
}

/**
 * Base class for our standard errors, extending the built-in Error class.
 * This ensures we have a consistent name and optionally cause.
 */
abstract class BaseStdError extends Error implements StdError {
  override cause?: unknown;
  constructor(message?: string, options?: ErrorOptions) {
    super(message, options);
    this.name = this.constructor.name;
    if (options?.cause !== undefined) {
      this.cause = options.cause;
    }
  }
}

/**
 * InvalidArgumentError represents invalid input arguments, akin to a Rust-like illegal argument.
 */
export class InvalidArgumentError extends BaseStdError {
  constructor(message: string = "Invalid argument provided", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * NotFoundError represents a scenario where a requested resource is not found.
 */
export class NotFoundError extends BaseStdError {
  constructor(message: string = "Resource not found", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * PermissionDeniedError indicates a lack of required permissions to perform an action.
 */
export class PermissionDeniedError extends BaseStdError {
  constructor(message: string = "Permission denied", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * TimeoutError indicates that an operation timed out.
 */
export class TimeoutError extends BaseStdError {
  constructor(message: string = "Operation timed out", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * UnknownError for unexpected or uncategorized errors.
 */
export class UnknownError extends BaseStdError {
  constructor(message: string = "An unknown error occurred", options?: ErrorOptions) {
    super(message, options);
  }
}

/**
 * wrapAsStdError attempts to convert an unknown error into a StdError.
 * If e is already an Error (and potentially has a message), we try to reuse it.
 * If not, we return an UnknownError.
 */
export function wrapAsStdError(e: unknown, defaultMsg: string = "An error occurred"): StdError {
  if (e instanceof Error) {
    // It's already an Error, ensure it's seen as StdError
    // If it's not one of our known classes, wrap it in UnknownError to unify handling.
    if ('cause' in e) {
      // Already has cause
      return e as StdError;
    } else {
      // We can wrap it with UnknownError to ensure cause is consistent.
      return new UnknownError(e.message, { cause: e });
    }
  }

  // If e is a string, use it as a message.
  if (typeof e === "string") {
    return new UnknownError(e);
  }

  // Otherwise, we know nothing; wrap in UnknownError with cause as is.
  return new UnknownError(defaultMsg, { cause: e });
}

/**
 * fromJsError converts a standard JS Error into a StdError.
 * If it's already a StdError, just return it. Otherwise, wrap as UnknownError.
 */
export function fromJsError(err: Error): StdError {
  if ('cause' in err) {
    // It's likely already conforming to ES2022 Error with cause
    return err as StdError;
  }
  // Wrap in UnknownError to standardize
  return new UnknownError(err.message, { cause: err });
}