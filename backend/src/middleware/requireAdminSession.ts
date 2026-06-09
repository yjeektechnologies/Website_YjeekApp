import type { Request, Response, NextFunction } from "express";
import { AdminSession } from "../models/adminSession.model.js";

/**
 * Validates the `x-admin-token` header against a non-expired admin session.
 *
 * Session-token auth (vs JWT) lets us revoke a token server-side instantly
 * (e.g. on logout or password reset) simply by deleting the row.
 */
export async function requireAdminSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const sessionToken = req.headers["x-admin-token"] as string | undefined;

  if (!sessionToken) {
    res.status(401).json({ error: "No session token provided" });
    return;
  }

  const activeSession = await AdminSession.findOne({
    token: sessionToken,
    expiresAt: { $gt: new Date() },
  }).lean();

  if (!activeSession) {
    res.status(401).json({ error: "Invalid or expired session" });
    return;
  }

  next();
}
