# Yjeek Backend — Node.js + Express + TypeScript + Mongoose (MongoDB)

A standalone REST API for the Yjeek website, rewritten from the original
PostgreSQL/Drizzle service into a simple **MVC** structure backed by **MongoDB**.
The HTTP API (routes, request/response shapes, numeric `id`s) is kept identical to
the original so the existing React frontend works unchanged.

## Structure

```
src/
  config/        env loading + MongoDB connection
  models/        Mongoose schemas (+ numeric auto-increment id via counters)
  controllers/   request handlers (the "C" + business logic)
  routes/        Express routers, all mounted under /api
  services/      mailer (SMTP/nodemailer) + settings key-value helpers
  middleware/    admin-session guard, async wrapper, error handler
  validation/    zod request schemas
  utils/         logger, typed errors, helpers
  app.ts         express app wiring
  index.ts       bootstrap (connect DB, listen)
  seed.ts        sample data seeder
```

## Prerequisites

- Node.js 18+
- A running MongoDB (default `mongodb://127.0.0.1:27017/yjeek`)

## Setup

```bash
cd backend
npm install
cp .env.example .env          # then edit values

# Generate an admin password hash and paste it into ADMIN_PASSWORD_HASH:
node -e "console.log(require('bcryptjs').hashSync('admin12345', 12))"

npm run seed                  # optional: insert a sample launch
npm run dev                   # start with hot-reload (tsx)
```

The API listens on `http://localhost:4000` with all routes under `/api`
(e.g. `GET http://localhost:4000/api/healthz`).

## Scripts

| Script           | Description                          |
| ---------------- | ------------------------------------ |
| `npm run dev`    | Hot-reload dev server (tsx)          |
| `npm run build`  | Compile TypeScript to `dist/`        |
| `npm start`      | Run compiled server                  |
| `npm run seed`   | Insert a sample launch               |
| `npm run typecheck` | Type-check without emitting       |

## Connecting the frontend

The React frontend calls relative `/api/...` paths. Point it at this server by
either adding a Vite dev proxy (`/api` → `http://localhost:4000`) or setting the
API base URL. Admin auth uses the `x-admin-token` request header (unchanged).
