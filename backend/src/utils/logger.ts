import pino from "pino";
import { env } from "../config/env.js";

/**
 * Application logger. Pretty-prints in development; structured JSON in production.
 * Sensitive headers are redacted so tokens never leak into logs.
 */
export const logger = pino({
  level: env.logLevel,
  redact: [
    "req.headers.authorization",
    "req.headers.cookie",
    "req.headers['x-admin-token']",
    "res.headers['set-cookie']",
  ],
  ...(env.isProduction
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }),
});
