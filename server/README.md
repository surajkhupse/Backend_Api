# Event API (Server)

Express + TypeScript REST API for user accounts (JWT, refresh tokens, Google SSO, password reset, audit logs) and authenticated event CRUD. OpenAPI is generated from JSDoc comments in route files and powers Swagger UI and the frontend Orval client.

## Tech stack

| Layer | Choice |
|--------|--------|
| Runtime | Node.js, TypeScript |
| HTTP | Express 5 |
| Database | MongoDB (Mongoose) |
| Auth | JWT access tokens, rotating refresh tokens, bcrypt, optional Google OAuth |
| API docs | swagger-jsdoc, swagger-ui-express |

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm

## Quick start

```bash
cd server
npm install
```

Create a `.env` file in this folder (see [Environment variables](#environment-variables)). Minimum for local dev:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/event-api
JWT_SECRET=your-long-random-secret
CLIENT_URL=http://localhost:5173
```

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| `http://127.0.0.1:5000/__health` | Health check |
| `http://127.0.0.1:5000/openapi.json` | OpenAPI JSON |
| `http://127.0.0.1:5000/api-docs/` | Swagger UI |
| `http://127.0.0.1:5000/swagger/` | Swagger UI (alias) |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon + tsx (watch `src/`) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled `dist/server.js` |
| `npm run openapi` | Write `openapi.generated.json` (gitignored) |

## Project structure

```
server/
├── src/
│   ├── server.ts              # Entry: DB connect, build spec, listen
│   ├── app.ts                 # Express app (middleware, routes, Swagger)
│   ├── config/
│   │   ├── db.ts              # MongoDB connection
│   │   ├── env.ts             # Environment variable types
│   │   ├── openapi.ts         # swagger-jsdoc assembly
│   │   ├── openapi-template.ts
│   │   └── openapi-settings.ts
│   ├── modules/
│   │   ├── auth/              # Register, login, refresh, SSO, sessions, audit
│   │   ├── events/            # Event CRUD (authenticated)
│   │   ├── users/             # User model, service, types
│   │   ├── roles/             # Role parsing, resolution
│   │   └── permissions/       # RBAC permission constants
│   ├── middlewares/
│   │   ├── auth.middleware.ts  # JWT Bearer authentication
│   │   ├── role.middleware.ts  # Role-based authorization
│   │   ├── permission.middleware.ts
│   │   └── error.middleware.ts # Global error handler
│   ├── utils/
│   │   ├── jwt.ts             # Access token issuance
│   │   ├── bcrypt.ts          # Password hashing
│   │   └── response.ts        # Standardized JSON replies
│   ├── routes/
│   │   └── index.ts           # Central route aggregator
│   ├── types/
│   │   └── express.d.ts       # Express Request augmentation
│   └── scripts/
│       └── generate-openapi.ts
├── openapi.generated.json     # Generated locally — do not commit
├── package.json
└── tsconfig.json
```

## API overview

Base path for business routes: `/api`.

### Accounts (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/sso/google` | — | Start Google OAuth redirect |
| GET | `/sso/google/callback` | — | OAuth callback |
| POST | `/register` | — | Create user |
| POST | `/login` | — | Sign in (access + refresh tokens) |
| POST | `/refresh` | — | Rotate refresh token |
| POST | `/logout` | — | Revoke one refresh token |
| POST | `/forgot-password` | — | Request reset email flow |
| POST | `/reset-password` | — | Set new password with token |
| GET | `/sessions` | Bearer | List active refresh sessions |
| GET | `/audit-logs` | Bearer | List audit log entries for current user |
| POST | `/logout-all` | Bearer | Revoke all refresh tokens |

Protected routes expect: `Authorization: Bearer <access_jwt>`.

### Events (`/api/events`)

All routes require Bearer auth.

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List events |
| POST | `/` | Create event |
| DELETE | `/:id` | Delete event by id |

## OpenAPI

- **Live spec:** `GET /openapi.json` (aliases: `/api/openapi`, `/api-spec.json`, `/v1/openapi.json`).
- **Source of truth:** `@openapi` JSDoc blocks in `src/modules/**/**.routes.ts` plus `src/config/openapi-template.ts`.
- **Static file:** `npm run openapi` writes `openapi.generated.json` in this folder. The file is listed in `.gitignore`; regenerate after route/schema changes.

The frontend uses this file for [Orval](../frontend/README.md#api-client-orval) code generation.

## Environment variables

| Variable | Required | Default / notes |
|----------|----------|----------------|
| `PORT` | No | `5000` |
| `MONGO_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret for signing access JWTs |
| `JWT_ACCESS_EXPIRES` | No | e.g. `15m` |
| `REFRESH_TOKEN_TTL_MS` | No | Refresh session length (ms) |
| `CLIENT_URL` | No | SPA origin for SSO redirects (`http://localhost:5173`) |
| `API_PUBLIC_URL` | No | Public API URL for Google `redirect_uri` |
| `GOOGLE_CLIENT_ID` | For SSO | Google OAuth client |
| `GOOGLE_CLIENT_SECRET` | For SSO | Google OAuth secret |
| `SSO_SUCCESS_PATH` | No | SPA path after SSO (default `/sso-callback`) |
| `ACCOUNT_LOCK_MAX_ATTEMPTS` | No | Failed logins before lockout |
| `ACCOUNT_LOCK_DURATION_MS` | No | Lockout duration |
| `SWAGGER_BASE_URL` | No | Override OpenAPI server URL in spec |
| `TRUST_PROXY` | No | Set `false` to disable `trust proxy` |
| `NODE_ENV` | No | `production` affects cookie `secure` flag |

## Development notes

- **CORS** is enabled with `credentials: true` for cookie-based flows where needed.
- **Account lockout** applies after repeated failed password logins (423 response with `lockUntil`).
- **Refresh tokens** rotate on each `/api/auth/refresh` call; store the new refresh token client-side.
- **Trust proxy** is on by default (one hop) so client IP is accurate behind a reverse proxy.

## Working with the frontend

1. Start this API on port `5000` (or set `PORT` and match `VITE_API_URL` in the frontend).
2. From `server`: `npm run openapi`.
3. From `frontend`: `npm run generate:api`.

See [frontend/README.md](../frontend/README.md) for the React app setup.

## Production build

```bash
npm run build
npm start
```

Ensure `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` are set for the deployment environment.
