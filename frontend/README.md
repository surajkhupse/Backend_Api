# Event App (Frontend)

React 19 + TypeScript SPA built with Vite. Uses Material UI for the design system, Redux Toolkit for auth state, React Router for navigation, and **Orval** to generate a typed Axios client from the backend OpenAPI spec.

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19, MUI 9, Emotion |
| Build | Vite 8 |
| State | Redux Toolkit (auth tokens) |
| Forms | react-hook-form + Zod |
| HTTP | Axios (shared instance + Orval-generated clients) |
| API types | Orval from `server/openapi.generated.json` |

## Prerequisites

- Node.js 18+
- npm
- Backend API running (default `http://127.0.0.1:5000`) — see [server/README.md](../server/README.md)

## Quick start

```bash
cd frontend
npm install
cp .env.example .env
```

Generate the API client (requires backend OpenAPI file):

```bash
# From repo root — server spec first, then frontend client
cd ../server && npm run openapi
cd ../frontend && npm run generate:api
```

```bash
npm run dev
```

App runs at **http://localhost:5173** (Vite default).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b` then production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run generate:openapi` | Run backend `npm run openapi` |
| `npm run generate:api` | Regenerate Orval client (`src/api/generated`) |

Run `generate:api` after any backend OpenAPI change.

## Environment variables

Copy `.env.example` to `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend origin, no trailing slash (e.g. `http://127.0.0.1:5000`) |

**Development:** If `VITE_API_URL` is unset, the app uses the Vite proxy in `vite.config.ts` (`/api` → `http://127.0.0.1:5000`). Setting `VITE_API_URL` talks to the backend directly.

**Production:** Set `VITE_API_URL` to your deployed API origin; the dev proxy is not used.

## Project structure

```
frontend/
├── public/                    # Static assets (favicon, icons)
├── src/
│   ├── main.tsx               # Providers: Redux, theme, router
│   ├── App.tsx                # Route tree root
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── paths.ts           # ROUTES constants
│   │   └── ProtectedRoute.tsx
│   ├── layouts/
│   │   └── MainLayout.tsx     # Authenticated shell
│   ├── features/              # Feature modules (primary organization)
│   │   ├── auth/              # API wrappers, token storage, Google logo
│   │   ├── login/
│   │   ├── password/          # Register, forgot password
│   │   ├── audit/               # Audit logs page (GET /api/auth/audit-logs)
│   │   └── dashboard/         # Dashboard UI (some data still mocked)
│   ├── services/api/
│   │   ├── client.ts          # Axios instance + Bearer interceptor
│   │   └── orvalMutator.ts    # Orval → shared axios
│   ├── api/generated/         # Orval output (gitignored — regenerate)
│   ├── store/                 # Redux store + auth slice
│   ├── theme/                 # MUI theme, tokens, component overrides
│   ├── pages/                 # Shared pages (e.g. 404)
│   ├── constants/
│   └── utils/
│       └── apiBaseUrl.ts
├── orval.config.ts
├── vite.config.ts
└── package.json
```

## Routes

| Path | Access | Page |
|------|--------|------|
| `/login` | Public | Login |
| `/sign-up` | Public | Register |
| `/forgot-password` | Public | Forgot password |
| `/` | Protected | Dashboard |
| `/audit-logs` | Protected | Audit logs (sign-in activity from API) |

Protection: `ProtectedRoute` checks Redux `auth.accessToken`; unauthenticated users redirect to `/login`.

## API client (Orval)

Configuration: `orval.config.ts`

- **Input:** `../server/openapi.generated.json` (generate with `npm run openapi` in server).
- **Output:** `src/api/generated/` (accounts, events, models).
- **Mutator:** All generated calls use `customInstance` in `orvalMutator.ts`, which routes through `services/api/client.ts` (base URL, JSON headers, Bearer token).

Feature code should prefer thin wrappers in `features/auth/api/auth.ts` (trimming, error messages, token validation) and import generated types/functions from `@/api/generated` or relative paths.

**Regenerate workflow:**

```bash
cd ../server && npm run openapi
cd ../frontend && npm run generate:api
```

Generated files are in `.gitignore`; clone fresh → run both commands before `npm run build`.

## Auth flow

1. **Login / register** call Orval-generated account endpoints via `features/auth/api/auth.ts`.
2. **Tokens** stored in `localStorage` (remember me) or `sessionStorage` via `features/auth/utils/authStorage.ts`.
3. **Redux** `authSlice` holds `accessToken` and `refreshToken` for guards and logout.
4. **Axios** `client.ts` attaches `Authorization: Bearer <accessToken>` on each request.

**Not yet implemented in the client:** automatic refresh on 401 (`POST /api/auth/refresh`), Google SSO button wiring, forgot-password API calls, real dashboard data from `/api/events`.

## Feature modules

| Module | Responsibility |
|--------|----------------|
| `auth` | `loginRequest`, `registerRequest`, `logoutRequest`, error helpers, storage |
| `login` | `LoginPage`, `LoginForm`, Zod schema |
| `password` | `RegisterPage`, `ForgotPasswordPage`, forms, password strength |
| `dashboard` | Layout, stat cards, tables (mock data in `data/dashboardMockData.ts`) |

Import from feature barrels (`features/auth`, `features/login`, etc.) rather than deep paths when possible.

## Styling

- **Primary:** MUI theme under `src/theme/` (palette, typography, component overrides).
- **Global:** `index.css`, `App.css`.
- Tailwind is listed in `package.json` but not used in `src/`; styling is MUI-driven.

## Linting

ESLint ignores `dist` and `src/api/generated` (generated code).

```bash
npm run lint
```

## Working with the backend

1. Start MongoDB and the backend (`npm run dev` in `server/`).
2. Match `VITE_API_URL` to backend `PORT` (default 5000).
3. Regenerate OpenAPI + client when API contracts change.

| Backend | Frontend |
|---------|----------|
| `npm run dev` | `npm run dev` |
| `npm run openapi` | `npm run generate:api` |
| `/api-docs/` | — |
| `/openapi.json` | input to Orval |

## Production build

```bash
npm run generate:api   # CI should run this before build if generated/ is not committed
npm run build
npm run preview
```

Set `VITE_API_URL` at build time to the production API URL.

## Planned improvements

- Axios interceptor for token refresh on 401
- Dashboard wired to `GET /api/events` instead of mock data
- Forgot password, Google SSO, sessions UI using generated clients
- Path aliases (`@/features/...`) in `tsconfig` + Vite
- Vitest + Testing Library for forms and auth helpers

See [server/README.md](../server/README.md) for API and environment details.
