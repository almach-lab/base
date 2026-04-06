# Almach

A modern, accessible React UI component library monorepo.
Built on React Aria · Tailwind CSS v4 · TanStack Query · Zod · Astro.

**Docs:** [almach.kita.blue](https://almach.kita.blue)

---

## Packages

| Package | Description |
|---------|-------------|
| `@almach/ui` | 30+ accessible components built on React Aria and Tailwind CSS v4 |
| `@almach/forms` | Type-safe forms with TanStack Form and Zod validation |
| `@almach/query` | Typed query factories and mutation builders on TanStack Query |
| `@almach/utils` | Tree-shakable utilities: `cn()`, date formatting, type helpers |

---

## Quick Start

```bash
bun add @almach/ui
```

```tsx
// 1. Wrap your app with providers
import { BasedQueryProvider } from "@almach/query";
import { Toaster } from "@almach/ui";

export function App({ children }) {
  return (
    <BasedQueryProvider>
      {children}
      <Toaster />
    </BasedQueryProvider>
  );
}

// 2. Use components
import { Button, Card } from "@almach/ui";

// 3. Type-safe forms
import { Form, TextField, useBasedForm, z } from "@almach/forms";

const schema = z.object({ email: z.string().email() });

function LoginForm() {
  const form = useBasedForm({ schema, onSubmit: async (v) => console.log(v) });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <TextField name="email" label="Email" required />
        <Button type="submit" loading={form.formState.isSubmitting}>Sign in</Button>
      </form>
    </Form>
  );
}

// 4. Typed data fetching
import { createQuery, createMutation } from "@almach/query";

export const usersQuery = createQuery({
  queryKey: () => ["users"],
  queryFn: () => fetch("/api/users").then((r) => r.json()),
});
```

---

## Migration Guide (v2: React Aria)

`@almach/ui` moved fully from Radix primitives to React Aria primitives in a major release.

- Composition changes:
  `asChild` composition now maps to React Aria `render` composition internally.
  Trigger/Close components still support `asChild`, but it must receive exactly one React element child.
- Select behavior:
  `Select` now follows React Aria value semantics; `onValueChange` can emit `null` when clearing/unsetting.
  Update handlers that previously assumed `string` only.
- Data attribute changes:
  animation/state selectors are now React Aria style (`data-[starting-style]`, `data-[ending-style]`, `data-[highlighted]`, `data-[checked]`, `data-[unchecked]`) instead of Radix `data-[state=...]` in affected primitives.
- Primitive internals:
  layered components (`Dialog`, `Popover`, `DropdownMenu`, `Tooltip`, `Select`) now use React Aria `Positioner` + `Popup` internals.
  Existing public compound exports remain (`.Trigger`, `.Content`, `.Item`, etc.), but custom CSS tied to old Radix internals should be updated.
- Label/slot-related differences:
  `Label` is now a native `<label>` wrapper in `@almach/ui`.
  Button/link composition no longer depends on `@radix-ui/react-slot`.

---

## Theming

All design tokens are plain CSS variables — override in your stylesheet, no config files:

```css
:root {
  --primary:   43 90% 44%;   /* golden, like Sandy (γ And) */
  --ring:      43 90% 44%;
  --radius:    0.625rem;
}
```

---

## Development

```bash
# Install all workspace dependencies
bun install

# Run the Astro docs dev server
bun run docs

# Build all packages
bun run build

# Build packages only (skip docs)
bun run build:packages

# Lint with Biome
bun run lint

# Check formatting with Biome
bun run format:check

# Type-check everything
bun run typecheck

# Run release publishing (CI uses this command)
bun run release
```

---

## Architecture

```
based/
├── packages/
│   ├── ui/      — @almach/ui      (React Aria + Tailwind components)
│   ├── forms/   — @almach/forms   (TanStack Form + Zod fields)
│   ├── query/   — @almach/query   (TanStack Query factories)
│   └── utils/   — @almach/utils   (cn, type helpers, formatters)
└── apps/
    └── docs/    — Astro docs site (deployed to Cloudflare Pages)
```

---

## Releasing

```bash
# 1. Use conventional commits (feat:, fix:, feat!:, BREAKING CHANGE)
# 2. Merge to main
# 3. release.yml auto-generates changesets from commits, versions, and publishes
```

### Resetting The Release Baseline

Published npm versions cannot be fully reset or deleted in a clean way once consumed.
The supported approach is to start a new baseline from the current code with a major bump:

```bash
bun run release:reset-baseline
```

This command creates a single changeset that marks all publishable packages as `major`.
It is idempotent: rerunning refreshes today's baseline file and removes stale `reset-baseline-*.md` files.
Then merge and run the normal release pipeline to publish the new baseline versions.

### About Starting Again From v0

You cannot reliably restart to `0.x` on the same published package names and call it a true reset.
For a clean v0 restart, use a new package line (for example a new scope/name such as `@almach-v0/*`) and publish that line separately.

Recommended clean strategy:
- Keep current `@almach/*` packages on their existing semver line.
- Start a new `@almach-v0/*` line at `0.1.0`.
- Mark old line status in README/changelog and guide consumers to the intended line.

### Remote Release Cleanup (GitHub + npm)

If you still want to clean old remote artifacts, use:

```bash
bun run release:reset-remote
```

Behavior:
- Default is `dry-run` (prints what would be removed/deprecated).
- Use `--apply` to execute real deletion/deprecation.
- Loads `.env` automatically if present.
- npm cleanup mode defaults to `auto`: tries `unpublish` first, falls back to `deprecate`.
- Processes versions `>= 0.0.1` by default (configurable with `--min-version`).

Setup:

```bash
cp .env.example .env
```

Examples:

```bash
# Preview only
node scripts/reset-remote-releases.mjs

# Apply all actions
node scripts/reset-remote-releases.mjs --apply

# Only GitHub releases
node scripts/reset-remote-releases.mjs --apply --skip-npm

# Only npm deprecations
node scripts/reset-remote-releases.mjs --apply --skip-github

# Force npm unpublish-only strategy
node scripts/reset-remote-releases.mjs --apply --skip-github --npm-mode=unpublish

# Restrict cleanup to versions >= 0.0.1 (default shown explicitly)
node scripts/reset-remote-releases.mjs --apply --min-version=0.0.1

# Publish reset baseline versions with explicit npm tag (for lower-version lines like 0.0.1)
bun run release:publish-env -- --tag=reset-v0
```

Important:
- npm unpublish is heavily restricted and often unavailable for old versions.
- This script uses deprecation for npm versions (safe and reversible with a new deprecate message).

---

## License

MIT

