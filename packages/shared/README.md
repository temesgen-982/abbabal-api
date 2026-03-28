# @abbabal/shared

Starter workspace package for shared API contracts and type-safe cross-app
models.

Use it with type-only imports from either app:

```ts
import type { PaginatedProverbs, Proverb } from '@abbabal/shared';
```

The package is intentionally types-first right now so we can share request and
response shapes without introducing a separate build step yet.
