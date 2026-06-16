# Abbabal — Codebase Context

## Project Overview

Abbabal is an Amharic proverb archive and API platform. It preserves Ethiopian oral traditions by providing a curated, searchable collection of proverbs with translations, meanings, and cultural context. The project serves three audiences:

- **General users** — browse and discover proverbs via the web or mobile app
- **Developers** — integrate the proverb database into their products via a REST API
- **Researchers & educators** — access the archive for academic and educational purposes

---

## Repository Structure

This is a **pnpm monorepo** with three apps and one shared package:

```
abbabal-api-backend/
├── apps/
│   ├── api/          # NestJS backend (REST API)
│   ├── web/          # SvelteKit web app (landing, dashboard, playground)
│   └── mobile/       # SvelteKit + Capacitor Android app
├── packages/
│   └── shared/       # Shared TypeScript type definitions
└── docs/
    └── api/          # HTTP request examples for development
```

---

## Tech Stack

| Layer          | Technology                                          |
|----------------|------------------------------------------------------|
| **Monorepo**   | pnpm v10, workspaces                                 |
| **Backend**    | NestJS v11, TypeScript, PostgreSQL, Drizzle ORM       |
| **Web**        | Svelte 5 (runes) + SvelteKit 2, Tailwind CSS v4      |
| **Mobile**     | Svelte 5 + SvelteKit 2 + Capacitor v8 (Android)      |
| **UI (Web)**   | shadcn-svelte (Vega), Lucide icons, TanStack Table    |
| **API Docs**   | Swagger/OpenAPI (@nestjs/swagger)                    |
| **Auth**       | Passport.js (local, JWT, JWT-refresh), bcrypt         |
| **Validation** | class-validator (backend), Zod v4 (frontend)          |
| **Testing**    | Jest + Supertest (unit + e2e)                        |
| **Charts**     | layerchart + d3-scale + d3-shape                      |

---

## Architecture Decisions

### Authentication Strategy
- JWT-based with short-lived access tokens (15m) and long-lived refresh tokens (1w)
- Access tokens stored in httpOnly cookies for web clients
- API keys (hashed via SHA-256) for programmatic access, rate-limited per key
- Three roles: `admin`, `user`, `api_client`
- Auth guard system: `@Auth()` decorator combines JwtAuthGuard + RolesGuard

### API Key System
- Raw key shown only once at creation, stored as SHA-256 hash
- Optional API key guard allows unauthenticated access to read endpoints
- Rate limiting tied to API keys (custom ThrottlerGuard)

### Database & ORM
- PostgreSQL with Drizzle ORM (type-safe SQL, not a full ORM)
- Migrations managed via drizzle-kit
- 6 tables: proverbs, interpretations, proverb_stats, users, api_keys, votes
- Relations: user -> api_keys, user -> proverbs, user -> interpretations, user -> votes

### Frontend Architecture
- Svelte 5 runes throughout (no legacy stores except where needed)
- shadcn-svelte for consistent UI primitives
- sveltekit-superforms for form handling with Zod schemas
- Server-side auth hooks (`hooks.server.ts`) handle cookie-based JWT refresh
- Dashboard uses sidebar layout; public pages use root layout with Nav + Footer

### Mobile App
- SvelteKit with static adapter, built to `build/` directory
- Capacitor wraps the static output as a native Android app
- Bottom tab navigation (Home, Search, Random, Saved, Profile)
- API client calls the same backend endpoints

### Shared Package
- `@abbabal/shared` provides TypeScript interfaces for API contracts
- Currently types-only (implementation files are stubs)
- Used by both web and mobile apps

---

## Key Flows

### User Registration & Login
1. User submits email + password via `/auth/register`
2. Backend hashes password with bcrypt, creates user record
3. User logs in via `/auth/login`, receives JWT pair
4. Access token used for subsequent requests via httpOnly cookie
5. Refresh token used at `/auth/refresh` when access token expires

### API Key Usage
1. Authenticated user creates API key at `/api-keys`
2. Raw key displayed once, then irreversibly hashed
3. Client sends key via `x-api-key` header
4. OptionalApiKeyGuard validates key or allows anonymous access
5. RateLimitGuard tracks usage per key

### Proverb Lifecycle
1. Proverbs enter the system via: admin creation, Telegram scraping, user submission
2. Submitted proverbs start as `pending`, require admin review
3. Each proverb can have multiple interpretations (translations, meanings) in Amharic or English
4. Interpretations can be AI-generated (with confidence score), user-contributed, or admin-verified
5. Users can vote on interpretations (+1/-1)

---

## Development Commands

```bash
pnpm dev              # Run API + web concurrently
pnpm dev:api          # Run API only
pnpm dev:web          # Run web only
pnpm build            # Build all packages
pnpm test             # Run API unit tests
pnpm test:e2e         # Run API e2e tests
pnpm check            # Run svelte-check on all frontend apps
pnpm drizzle:generate # Generate new migration
pnpm drizzle:migrate  # Apply migrations
pnpm drizzle:seed     # Seed admin user
pnpm drizzle:studio   # Open Drizzle Studio (DB GUI)
```

---

## Environment Variables

### Root `.env`
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Access token signing secret |
| `JWT_EXPIRES_IN` | Access token lifetime (default: 15m) |
| `JWT_REFRESH_SECRET` | Refresh token signing secret |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token lifetime (default: 1w) |
| `CORS_ORIGIN` | Allowed CORS origins |
| `PORT` | Server port (default: 3000) |
| `ADMIN_EMAIL` | Admin seed email |
| `ADMIN_PASSWORD` | Admin seed password |

### Web `apps/web/.env`
| Variable | Description |
|----------|-------------|
| `PUBLIC_API_BASE_URL` | API URL for frontend requests |

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | None | Health check |
| POST | `/auth/register` | None | Register user |
| POST | `/auth/login` | Local | Login |
| POST | `/auth/refresh` | JWT-Refresh | Refresh tokens |
| GET | `/auth/profile` | JWT | Current user |
| GET | `/proverbs` | Optional key | List proverbs (paginated) |
| GET | `/proverbs/search` | Optional key | Search proverbs |
| GET | `/proverbs/random` | Optional key | Random proverb |
| GET | `/proverbs/:id` | Optional key | Proverb detail |
| POST | `/proverbs` | JWT (Admin) | Create proverb |
| POST | `/proverbs/submit` | JWT (User) | Submit proverb |
| PATCH | `/proverbs/:id/review` | JWT (Admin) | Review submission |
| PATCH | `/proverbs/:id` | JWT (Admin) | Update proverb |
| DELETE | `/proverbs/:id` | JWT (Admin) | Delete proverb |
| POST | `/users` | JWT (Admin) | Create user |
| GET | `/users` | JWT (Admin) | List users |
| GET | `/users/me` | JWT | Own profile |
| PATCH | `/users/:id` | JWT (Admin) | Update user |
| POST | `/api-keys` | JWT | Create API key |
| GET | `/api-keys` | JWT | List API keys |
| DELETE | `/api-keys/:id` | JWT | Revoke API key |
