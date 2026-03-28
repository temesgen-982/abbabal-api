# Abbabal Monorepo

This repository now uses a `pnpm` workspace layout:

- `apps/api`: NestJS API backend
- `apps/web`: SvelteKit frontend
- `packages/shared`: shared app contracts and types

## Getting Started

```bash
pnpm install
pnpm dev:api
pnpm dev:web
```

To run both apps together:

```bash
pnpm dev
```

## Workspace Scripts

```bash
pnpm build
pnpm lint
pnpm check
pnpm test
pnpm test:e2e
pnpm prisma:generate
pnpm prisma:seed
```

## Environment

The API continues to read backend environment variables from the workspace root `.env`.
The SvelteKit frontend can use `apps/web/.env` for browser-safe `PUBLIC_*` variables.

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

## Shared Package

Use `packages/shared` for common API request and response types that both the
backend and frontend can depend on as the product grows.
