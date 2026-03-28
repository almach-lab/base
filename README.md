# Almach

A modern, accessible React UI component library monorepo.
Built on Radix UI · Tailwind CSS v4 · TanStack Query · Zod · Astro.

**Docs:** [almach.kita.blue](https://almach.kita.blue)

---

## Packages

| Package | Description |
|---------|-------------|
| `@almach/ui` | 30+ accessible components built on Radix UI and Tailwind CSS v4 |
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

# Build all packages (respects dep order via Turborepo)
bun run build

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
│   ├── ui/      — @almach/ui      (Radix + Tailwind components)
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

---

## License

MIT
