# Abbabal — Codebase Status

> Last updated: June 16, 2026
> Branch: `feat/web-pages`

---

## Feature Completion Status

### Backend (NestJS API) — `/apps/api/`

| Feature | Status | Notes |
|---------|--------|-------|
| Health check endpoint | ✅ Done | `GET /` returns "Hello World!" |
| User registration | ✅ Done | Email + password, bcrypt hashing |
| User login (local) | ✅ Done | Passport local strategy |
| JWT access tokens | ✅ Done | 15min expiry, httpOnly cookies |
| JWT refresh tokens | ✅ Done | 1-week expiry, rotation |
| User profile | ✅ Done | `GET /auth/profile` |
| User CRUD (admin) | ✅ Done | Create, list, update users |
| Proverb CRUD | ✅ Done | Create, read, update, delete |
| Proverb search | ✅ Done | Text search with pagination |
| Random proverb | ✅ Done | Single random result |
| Proverb submission | ✅ Done | User-submitted with pending status |
| Proverb review workflow | ✅ Done | Admin approve/reject |
| API key management | ✅ Done | Create, list, revoke |
| API key authentication | ✅ Done | SHA-256 hashed keys |
| Rate limiting (per key) | ✅ Done | Custom ThrottlerGuard |
| Optional auth on reads | ✅ Done | OptionalApiKeyGuard |
| Swagger documentation | ✅ Done | `/api/docs` |
| Role-based access | ✅ Done | Admin / User / API Client |
| Database migrations | ✅ Done | 2 migrations, drizzle-kit |
| Admin seeding | ✅ Done | Drizzle seed script |
| Unit tests | ✅ Done | Controllers, services, guards |
| E2E tests | ✅ Done | Full auth + API key flow |

### Web Frontend (SvelteKit) — `/apps/web/`

| Feature | Status | Notes |
|---------|--------|-------|
| Landing page (`/`) | ✅ Done | Hero, stats, features, API showcase, CTA, FAQ |
| About page (`/about`) | ✅ Done | Mission, approach, values |
| Documentation page (`/documentation`) | 🟡 Stub | Empty file, needs content |
| Download page (`/download`) | ✅ Done | SQLite DB + mobile app download cards |
| Public playground (`/playground`) | ✅ Done | API request builder with response preview |
| Proverbs listing (`/proverbs`) | ✅ Done | Loads random proverb from API |
| Proverb detail (`/proverbs/[id]`) | ✅ Done | Hero layout, translations, meanings, share/copy/random, metadata, error states, SEO |
| Auth — Login (`/auth/login`) | ✅ Done | Superforms + Zod validation |
| Auth — Signup (`/auth/signup`) | ✅ Done | Superforms + Zod validation |
| Auth hooks | ✅ Done | httpOnly JWT cookie refresh |
| Dashboard — Layout | ✅ Done | Sidebar navigation |
| Dashboard — Overview | ✅ Done | Stats and charts |
| Dashboard — API Keys | ✅ Done | Create/list/revoke with raw key display |
| Dashboard — Usage | ✅ Done | Usage analytics with charts |
| Dashboard — Playground | ✅ Done | Interactive API testing |
| Dashboard — Profile | ❌ Empty | Placeholder, no content |
| Dashboard — Admin Users | ✅ Done | TanStack data table with CRUD |
| Dashboard — Admin Proverbs | 🟡 Stub | Basic page, needs data table |
| Navigation | ✅ Done | Nav component with all links |
| Footer | ✅ Done | Brand, links, GitHub icon |
| Hero component | ✅ Done | Reusable, centered layout |
| shadcn-svelte components | ✅ Done | 23 UI primitives installed |
| Responsive design | 🟡 Partial | Most pages responsive, some need polish |
| Dark mode | 🟡 Partial | CSS variables defined, no toggle yet |

### Mobile App (Capacitor/SvelteKit) — `/apps/mobile/`

| Feature | Status | Notes |
|---------|--------|-------|
| Home feed | ✅ Done | Infinite scroll proverb cards |
| Search | ✅ Done | Debounced search input |
| Random proverb | ✅ Done | Fetch and display random |
| Saved proverbs | 🟡 Partial | Page exists, needs persistence |
| Profile page | 🟡 Partial | Page exists, needs auth integration |
| Proverb detail | 🟡 Stub | Basic page layout |
| Bottom navigation | ✅ Done | 5 tabs: Home, Search, Random, Saved, Profile |
| Side drawer | ✅ Done | App info and links |
| API client | ✅ Done | Fetch wrapper for all endpoints |
| Capacitor Android | ✅ Done | Native project configured |
| Offline support | ❌ Missing | Planned, not implemented |
| Push notifications | ❌ Missing | Not started |

### Shared Package — `/packages/shared/`

| Feature | Status | Notes |
|---------|--------|-------|
| TypeScript interfaces | 🟡 Partial | Some contracts defined, many missing |
| Runtime code | ❌ Missing | `.js` files are empty stubs |
| Backend integration | 🟡 Partial | Backend has its own DTOs separately |

---

## Known Issues & Technical Debt

### Backend
1. **No input validation on interpretation votes** — Vote controller exists in schema but not exposed via API
2. **ProverbStats not auto-populated** — Views/forwards counters exist in schema but no middleware increments them
3. **Environment template outdated** — `.env.example` shows `file:./data/proverbs.db` (SQLite-style) but production uses PostgreSQL
4. **No database connection pooling config** — Uses default node-postgres pool settings
5. **Swagger decorators on DTOs** — Mix of Swagger + class-validator decorators makes DTOs verbose
6. **No soft deletes** — Proverbs and users are hard-deleted
7. **Interpretation source enum** — Contains `telegram` which is a legacy import pipeline not fully documented

### Web Frontend
1. **Documentation page empty** — `/docs` link in nav points to `/documentation` which is an empty file
2. **Proverb detail route empty** — `proverbs/[id]/+page.svelte` has no content
3. **Nav link mismatch** — Nav links to `/docs` but the actual route is `/documentation`
4. **Dashboard profile page empty** — No content at `dashboard/profile/`
5. **No 404 page** — No `+error.svelte` at root or custom error page
6. **No loading states** — No `+loading.svelte` for route transitions
7. **Dark mode toggle** — CSS variables exist for dark mode but no toggle UI
8. **API base URL hardcoded in playground** — Falls back to `http://localhost:3000` in some places
9. **Mobile responsiveness** — Some dashboard pages may not be fully responsive
10. **No meta tags / SEO** — Missing Open Graph, description, and keyword meta tags

### Mobile App
1. **No authentication** — Mobile app doesn't support login yet
2. **Saved proverbs not persisted** — Page renders but no local storage or API integration
3. **Profile page is a placeholder** — Shows basic layout without real functionality
4. **No offline caching** — Every request hits the network
5. **No error handling for network failures** — Missing retry logic or offline indicators

### Infrastructure
1. **No CI/CD pipeline** — No GitHub Actions, no automated testing on PRs
2. **No Docker setup** — No containerization for local development or deployment
3. **No staging environment** — Only local development and production (Render.com)
4. **No monitoring or logging** — No structured logging, no error tracking (Sentry, etc.)
5. **No database backup strategy** — No automated backup configuration

---

## Current Sprint Focus (feat/web-pages)

### Recently Completed
- [x] Landing page with hero, stats, features, API showcase, CTA, and FAQ sections
- [x] Reusable Hero component (centered layout, configurable)
- [x] Footer component (brand, links, GitHub icon, moved from dashboard)
- [x] Nav component with all navigation items and "Get Started" CTA
- [x] About page — stripped down to mission, approach, values
- [x] Playground page — replaced PlaygroundHero with inline hero matching download page pattern
- [x] Download page with SQLite and mobile app download cards
- [x] Proverbs listing page with random proverb load
- [x] Proverb detail page (`/proverbs/[id]`) — hero layout, translations, meanings, share/copy/random actions, metadata, error states, SEO meta tags

### In Progress
- [ ] Dark mode toggle
- [ ] Documentation page content
- [ ] Nav link fix (`/docs` → `/documentation`)

### Up Next
- [ ] Dashboard profile page
- [ ] 404 error page
- [ ] Loading states
- [ ] Proverbs search integration

---

## Database Schema

### Tables

| Table | Rows (est.) | Purpose |
|-------|-------------|---------|
| `proverbs` | 3,200+ | Core proverb records with text, source, status |
| `interpretations` | 6,400+ | Translations and meanings (2+ per proverb) |
| `proverb_stats` | 3,200+ | View and forward counters |
| `users` | ~50 | Registered users (admin, user, api_client roles) |
| `api_keys` | ~100 | Hashed API keys linked to users |
| `votes` | ~200 | User votes on interpretations (+1/-1) |

### Key Relationships
- Proverb 1:N Interpretation (proverbs store text, interpretations store translations/meanings)
- Proverb 1:1 ProverbStats (views and forwards)
- User 1:N ApiKey
- User 1:N Vote
- Interpretation 1:N Vote

---

## Frontend Route Map

### Web App Routes

```
/                          → Landing page
/about                     → About page
/auth/login                → Login
/auth/signup               → Registration
/dashboard                 → Dashboard layout (sidebar)
/dashboard/overview        → Dashboard home
/dashboard/api-keys        → API key management
/dashboard/usage           → Usage analytics
/dashboard/playground      → API playground (dashboard)
/dashboard/profile         → Profile (empty)
/dashboard/admin/users     → User management (admin)
/dashboard/admin/proverbs  → Proverb management (admin)
/documentation             → API docs (empty)
/download                  → Download page
/playground                → Public API playground
/proverbs                  → Proverb listing
/proverbs/[id]             → Proverb detail (empty)
```

### Mobile App Routes

```
/                          → Proverb feed (infinite scroll)
/search                    → Search proverbs
/random                    → Random proverb
/saved                     → Saved bookmarks
/profile                   → User profile
/proverb-detail            → Proverb detail view
```

---

## Deployment

| App | Adapter | Platform |
|-----|---------|----------|
| API | NestJS built-in | Render.com (https://abbabal-api.onrender.com) |
| Web | @sveltejs/adapter-auto | TBD |
| Mobile | @sveltejs/adapter-static | Google Play Store |

No CI/CD pipeline is configured. Deployment is currently manual.
