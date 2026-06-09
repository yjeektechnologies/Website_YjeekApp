import type { Request, Response, NextFunction } from "express";
import {
  AuthenticationError,
  ValidationError,
  NotFoundError,
  BusinessRuleError,
} from "../utils/errors.js";

/**
 * Global error-handling middleware. Maps typed domain errors to HTTP status
 * codes. Must be registered AFTER all routes and must declare four parameters
 * so Express recognises it as an error handler.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AuthenticationError) {
    res.status(401).json({ error: err.message });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({ error: "Validation failed", details: err.issues });
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({ error: err.message });
    return;
  }

  if (err instanceof BusinessRuleError) {
    res.status(400).json({ error: err.message });
    return;
  }

  const message = err instanceof Error ? err.message : "An unexpected error occurred";
  req.log.error({ err }, "Unhandled error");
  res.status(500).json({ error: message });
}
