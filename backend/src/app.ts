import express, { type Express } from "express";
import cors from "cors";
import compression from "compression";
import path from "node:path";
import { pinoHttp } from "pino-http";
import router from "./routes/index.js";
import { logger } from "./utils/logger.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

app.use(compression());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

app.use(
  cors({
    // Allow all origins in development (empty CORS_ORIGIN); restrict in production.
    origin: env.corsOrigins.length > 0 ? env.corsOrigins : true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

// Single-server mode: serve the built frontend and fall back to index.html for
// client-side routes (anything that is not an /api request).
if (env.serveClient) {
  // Static files with caching (1 year for hashed assets)
  app.use(
    express.static(env.clientDistPath, {
      maxAge: "1y",
      immutable: true,
      index: false, // Don't serve index.html directly from here to handle SPA routes correctly
    }),
  );

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(env.clientDistPath, "index.html"), {
      maxAge: "0", // Don't cache index.html
    });
  });
  logger.info({ clientDist: env.clientDistPath }, "Serving frontend build");
}

// Registered AFTER all routes so Express treats it as the error handler.
app.use(errorHandler);

export default app;
