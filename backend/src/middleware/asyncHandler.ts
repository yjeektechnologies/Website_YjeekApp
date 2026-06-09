import type { Request, Response, NextFunction } from "express";

/**
 * Wraps an async Express handler so any rejected promise is forwarded to the
 * error-handling chain via next(err). Lets controllers stay try/catch-free —
 * all error → HTTP mapping lives in the global error handler.
 */
export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<void>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    handler(req, res, next).catch(next);
  };
}
