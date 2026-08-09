# Abbabal Monorepo

`pnpm` workspace with three apps and one shared package:

- `apps/api`: NestJS API backend (SQLite)
- `apps/web`: SvelteKit web frontend
- `apps/mobile`: SvelteKit app wrapped with Capacitor for Android
- `packages/shared`: shared app contracts and types

## Getting Started

```bash
pnpm install
pnpm dev:api
pnpm dev:web
```

To run the API and web app together:

```bash
pnpm dev
```

For the mobile app (web UI only):

```bash
pnpm --filter @abbabal/mobile dev
```

## Mobile (Capacitor / Android)

The mobile app builds to `apps/mobile/build` which Capacitor serves as the native
WebView. Run these from `apps/mobile` or with `pnpm --filter @abbabal/mobile`.

| Command            | Description                                              |
| ------------------ | -------------------------------------------------------- |
| `android:sync`     | Copy the web build + plugins into the native project     |
| `android:run`      | Build the web app, then build, install, and launch on a device/emulator |
| `android:live`     | Live reload on device while `pnpm dev` is running        |

Typical workflow:

1. `pnpm dev` — start the Vite dev server
2. `pnpm --filter @abbabal/mobile android:live` — open the app on a device/emulator; edits hot-reload without rebuilding the native app
3. To ship: `pnpm --filter @abbabal/mobile android:run`

After adding/updating a Capacitor plugin, run `android:sync` to refresh the native project.

Launcher icons and splash screens are generated from the source logos in
`packages/shared/assets`:

```bash
pnpm --filter @abbabal/mobile assets:generate
```

## Workspace Scripts

```bash
pnpm build          # build all apps
pnpm lint           # lint all packages that define it
pnpm check          # type-check all packages that define it
pnpm test           # API unit tests
pnpm test:e2e       # API e2e tests
```

## Environment

The API reads environment variables from the workspace root `.env`.
The web frontend can use `apps/web/.env` for browser-safe `PUBLIC_*` variables.

```bash
cp .env.example .env
cp apps/web/.env.example apps/web/.env
```

## Internationalization

Both web and mobile use `wuchale` (compile-time i18n). After adding new UI
strings, regenerate the catalogs for each app:

```bash
pnpm --filter @abbabal/web i18n
pnpm --filter @abbabal/mobile i18n
```

## Shared Package

Use `packages/shared` for common API request and response types that both the
backend and frontend can depend on as the product grows.

## License

This project is dual-licensed:

- **Code** — the software in this repository is licensed under the
  [MIT License](LICENSE).
- **Data** — the Amharic proverb texts and their translations are licensed
  under the [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) license.
  The proverb texts were sourced from the "አማርኛ አባባሎች" Telegram channel
  (https://t.me/ababaloch); see [LICENSE-data](LICENSE-data) for full terms and
  attribution.

## Versioning

The whole product shares a single version, declared in the root `package.json`
and mirrored by every workspace package. The Android app reads that same
version at build time: `versionName` uses the version string and `versionCode`
is derived from it as `major * 10000 + minor * 100 + patch` (so it always
increases as the version does).

To bump the product version everywhere at once:

```bash
pnpm version:set 0.2.0
```

The version is also displayed as the Android app version. When shipping a new
Android build to the Play Store, the version must always increase.
