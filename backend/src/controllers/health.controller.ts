import type { Request, Response } from "express";

/** GET /api/healthz — liveness probe. */
export function healthCheck(_req: Request, res: Response): void {
  res.json({ status: "ok" });
}
