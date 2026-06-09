/**
 * Typed error classes. Controllers throw these; the global error handler maps
 * each one to a deterministic HTTP status code, so controllers never set status
 * codes for error cases themselves.
 *
 *   AuthenticationError → 401
 *   ValidationError     → 400
 *   NotFoundError       → 404
 *   BusinessRuleError   → 400
 *   anything else       → 500
 */

export class AuthenticationError extends Error {
  readonly name = "AuthenticationError";
  constructor(message: string) {
    super(message);
  }
}

export class ValidationError extends Error {
  readonly name = "ValidationError";
  constructor(public readonly issues: unknown[]) {
    super("Validation failed");
  }
}

export class NotFoundError extends Error {
  readonly name = "NotFoundError";
  constructor(
    public readonly resourceName: string,
    public readonly id: number | string,
  ) {
    super(`${resourceName} with id ${id} not found`);
  }
}

export class BusinessRuleError extends Error {
  readonly name = "BusinessRuleError";
  constructor(message: string) {
    super(message);
  }
}
