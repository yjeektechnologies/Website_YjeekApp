import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const currentDir = path.dirname(fileURLToPath(import.meta.url));
// From backend/{src,dist}/config → repo root → frontend/dist
const defaultClientDist = path.resolve(currentDir, "../../../frontend/dist");

/**
 * Centralised, validated environment configuration.
 *
 * Every value the app reads from process.env is resolved here once, with sane
 * defaults, so the rest of the codebase never touches process.env directly.
 */
export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",

  port: Number(process.env.PORT ?? 4000),
  logLevel: process.env.LOG_LEVEL ?? "info",

  /** Allowed CORS origins. Empty array => allow all (handy in development). */
  corsOrigins: (process.env.CORS_ORIGIN ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  mongoUri: process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017/yjeek",

  /** When true, the API server also serves the built frontend (single-server mode). */
  serveClient: process.env.SERVE_CLIENT === "true" || process.env.NODE_ENV === "production",
  /** Path to the frontend production build that gets served in single-server mode. */
  clientDistPath: process.env.CLIENT_DIST ?? defaultClientDist,

  adminEmail: process.env.ADMIN_EMAIL ?? "admin@yjeektech.com",
  adminPasswordHash: process.env.ADMIN_PASSWORD_HASH ?? "",

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: (process.env.SMTP_SECURE ?? "false") === "true",
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "noreply@yjeektech.com",
  },
} as const;
