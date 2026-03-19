# AGENTS.md

Guidelines for AI agents (Claude, Copilot, Cursor, etc.) working in this repository.
**Read this file in full before making any changes.**

---

## Repo at a Glance

```
based/                          ← monorepo root (Bun workspaces + Turborepo)
├── packages/
│   ├── utils/                  → @almach/utils   (cn, types, date, url)
│   ├── ui/                     → @almach/ui      (Radix UI + Tailwind components)
│   ├── forms/                  → @almach/forms   (TanStack Form + Zod fields)
│   └── query/                  → @almach/query   (TanStack Query factories)
├── apps/
│   └── docs/                   → Astro docs + showcase site
│       ├── src/layouts/        → Layout.astro (shell, header, sidebar)
│       ├── src/pages/          → Astro page files (route = file)
│       ├── src/components/     → Shared React + Astro components
│       │   └── pages/          → Per-page React content components
│       └── src/styles/         → globals.css (Tailwind v4 tokens, themes)
├── .github/workflows/          → CI, npm release, Cloudflare Pages deploy
└── .changeset/                 → Changesets for versioning
```

**Package manager:** Bun (`bun install` — never `npm` or `pnpm`)
**Build orchestration:** Turborepo (`bun run build`)
**Language:** TypeScript strict mode throughout
**CSS:** Tailwind CSS **v4** — CSS-first, no `tailwind.config.js`, no `postcss.config.js`
**Docs framework:** Astro 6 (file-based routing, React islands via `client:only="react"`)

---

## Essential Commands

```bash
bun install                        # install all workspace deps
bun run build                      # build all packages (Turborepo dep order)
bun run build --filter=!docs       # build packages only (skip docs app)
bun run build --filter=docs        # build docs app only
bun run dev                        # run all dev watchers
bun run docs                       # run Astro docs dev server only
bun run typecheck                  # type-check all packages
bun run clean                      # remove all dist/ and node_modules
bun changeset                      # create a changeset for a release
```

**Never run bare `tsc`** — always go through `bun run build` so Turborepo
handles inter-package dependency order correctly.

---

## Package Dependency Graph

```
@almach/utils   (no internal deps)
    ↑
@almach/ui      (depends on @almach/utils)
    ↑
@almach/forms   (depends on @almach/ui, @almach/utils)

@almach/query   (depends on @almach/utils)

docs app            (depends on all four packages via workspace:*)
```

When adding a new file to a package that imports from a sibling package,
verify the sibling is listed in `dependencies` as `"workspace:*"` and that
`tsconfig.json` `paths` and `references` are updated accordingly.

---

## Adding a New UI Component

1. Create `packages/ui/src/components/<name>.tsx`
2. Follow the existing pattern — `React.forwardRef`, `displayName`, named exports
3. Export from `packages/ui/src/index.ts`
4. If it uses a new Radix primitive, add it to `packages/ui/package.json` deps
5. Create `apps/docs/src/components/pages/components/<name>.tsx` — interactive demo
6. Register the new page in `apps/docs/src/components/AppShell.tsx` (`componentPages` map)
7. Add a sidebar entry in `apps/docs/src/layouts/Layout.astro` (`sidebarGroups`)
8. Create `apps/docs/src/pages/components/<name>.astro` (copies the pattern of any existing one)

Component checklist:
- [ ] `React.forwardRef` for DOM-wrapping components
- [ ] `className` prop merged with `cn()`
- [ ] `error?: boolean` for inputs (sets `aria-invalid`, destructive ring)
- [ ] `disabled` state handled
- [ ] `displayName` set
- [ ] Exported from `packages/ui/src/index.ts`

---

## Adding a New Form Field

1. Create `packages/forms/src/fields/<name>-field.tsx`
2. Accept `name`, `label`, `description`, `required`, and native input props
3. Compose with `FormField`, `FormItem`, `FormControl`, `FormMessage`
4. Export from `packages/forms/src/index.ts`
5. Demonstrate on the forms page: `apps/docs/src/components/pages/forms.tsx`

---

## Adding a Query/Mutation Utility

- **Read data:** `createQuery({ queryKey, queryFn, staleTime? })`
- **Write data:** `createMutation({ mutationFn, invalidates? })`
- **Server actions (Next.js):** `createServerAction({ action })` — expects `ActionResult<T>`
- Export from `packages/query/src/index.ts`

`ActionResult<T>` shape (always use this for server actions):
```ts
type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: { code?: string; message: string; fields?: Record<string, string[]> } }
```

---

## TypeScript Rules

- `strict: true` + `exactOptionalPropertyTypes: true` + `noUncheckedIndexedAccess: true`
- No `any` — use `unknown` and narrow with guards
- No type assertions (`as Foo`) unless unavoidable; add a comment explaining why
- Generic params: `TData`, `TError`, `TVariables`
- `interface` for public API shapes; `type` for unions/utilities
- All public APIs exported from the package `index.ts`

---

## Styling Rules (Tailwind CSS v4)

This repo uses **Tailwind CSS v4**. The rules differ from v3 — read carefully.

### What changed from v3

| v3 | v4 |
|----|----|
| `tailwind.config.js` | Deleted — config lives in CSS |
| `postcss.config.js` | Deleted — Vite/Astro plugin handles it |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| `darkMode: 'class'` in config | `@custom-variant dark (&:where(.dark, .dark *))` in CSS |
| `theme.extend.colors` in config | `@theme inline { --color-*: ... }` in CSS |
| `content: [...]` array | Auto-detected by `@tailwindcss/vite` plugin |

### Rules

- All styling via Tailwind utility classes — no inline `style` props except for dynamic/computed values
- Use `cn()` from `@almach/utils` to merge classes (never `clsx` or `twMerge` directly)
- **Semantic tokens only** — never hard-code colors:
  - Text: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`
  - Bg: `bg-background`, `bg-card`, `bg-muted`, `bg-primary`
  - Border: `border-border`, `border-input`
- Variants via `class-variance-authority` (`cva`) — see `button.tsx` for the pattern
- **Dark mode:** `dark:` utility prefix responds to `.dark` on a parent element
  (wired via `@custom-variant dark` in `globals.css`)
- To add a token: add CSS var in `:root` / `.dark` blocks **and** a `--color-*` in `@theme inline {}` — both in `packages/ui/src/styles/globals.css`
- The docs app can override tokens in `apps/docs/src/styles/globals.css`
- **Never** create `tailwind.config.js`, `postcss.config.js`, or use `@tailwind` directives

---

## Docs App Conventions (`apps/docs`)

- **Routing:** Astro file-based (`src/pages/<name>.astro` → `/<name>`)
- **Shell:** `src/layouts/Layout.astro` — header, sidebar, footer, mobile nav, theme toggle
- **Page content:** each page uses `<AppShell page="..." client:only="react" />`
- **React content components:** live in `src/components/pages/`
  - `home.tsx` — landing page
  - `getting-started.tsx`, `forms.tsx`, `query.tsx`
  - `components/<name>.tsx` — one per UI component
- **Sidebar nav:** defined in `src/layouts/Layout.astro` → `sidebarGroups` array
- **Component registry:** `src/components/AppShell.tsx` → `componentPages` map (lazy imports)
- **Code blocks:** use `<CodeBlock code="..." lang="tsx" filename="..." />` — Shiki dual-theme
- **Logo:** `src/components/Logo.astro` (Astro) or `src/components/Logo.tsx` (React)
- **Theme customizer:** `src/components/ThemeCustomizer.tsx` — slide-in panel, triggered by header button
- **Smooth navigation:** Astro `ClientRouter` (View Transitions) — no full page reloads

---

## Git & Branching

- **Main branch:** `main` — protected, all changes via PR
- **Agent branches:** prefix with `claude/` (e.g. `claude/add-accordion-k8Xp2`)
- **Feature branches:** `feat/<description>`
- **Fix branches:** `fix/<description>`
- Commit messages follow Conventional Commits:
  - `feat:` new feature
  - `fix:` bug fix
  - `chore:` tooling, deps, config
  - `docs:` documentation only
  - `refactor:` no behavior change

---

## Releasing Packages

1. Make changes in a branch and open a PR
2. Run `bun changeset` locally to describe the change (patch / minor / major)
3. Commit the generated `.changeset/*.md` file
4. Merge PR → CI opens a **"Version Packages"** PR automatically
5. Merge the version PR → all changed packages are published to npm

Never manually edit `package.json` version fields — changesets handles that.

---

## CI / Deployment

| Workflow | Trigger | What happens |
|----------|---------|--------------|
| `ci.yml` | Every push / PR | typecheck + build |
| `release.yml` | Push to `main` | changesets → npm publish |
| `deploy-docs.yml` | Push to `main` | Astro build → Cloudflare Pages (production) |
| `preview-docs.yml` | PRs to `main` | Astro build → Cloudflare Pages (preview URL posted to PR) |

Required GitHub secrets: `NPM_TOKEN`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`
See `SETUP.md` for how to create and configure them.

---

## What Agents Should NOT Do

- Do not run `npm install` or `pnpm install` — use `bun install`
- Do not push directly to `main`
- Do not manually bump versions in `package.json` — use `bun changeset`
- Do not add `"use client"` to `@almach/utils` or `@almach/query` server-safe modules
- Do not import across package boundaries with relative paths — use the package name
  (e.g. `import { cn } from "@almach/utils"`, not `import { cn } from "../../utils/src/cn"`)
- Do not add component-level CSS files — Tailwind utility classes only
- Do not create `tailwind.config.js` or `postcss.config.js` — those are v3 artifacts
- Do not use `@tailwind base`, `@tailwind components`, `@tailwind utilities` — use `@import "tailwindcss"` (v4)
- Do not hard-code colors like `bg-blue-500` — use semantic tokens only
- Do not add default exports to packages — named exports only for tree-shaking
- Do not modify `.changeset/config.json` without a clear reason
- Do not add pages as `.tsx` files directly in `src/pages/` — Astro pages must be `.astro`

---

## Common Patterns (Quick Reference)

### New component with variants
```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@almach/utils";

const thingVariants = cva("base-classes", {
  variants: { variant: { default: "...", outline: "..." } },
  defaultVariants: { variant: "default" },
});

interface ThingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof thingVariants> {}

const Thing = React.forwardRef<HTMLDivElement, ThingProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(thingVariants({ variant }), className)} {...props} />
  )
);
Thing.displayName = "Thing";

export { Thing, thingVariants };
```

### Typed query factory
```ts
import { createQuery } from "@almach/query";

export const userQuery = createQuery({
  queryKey: (id: string) => ["users", id],
  queryFn: (id) => fetchUser(id),
  staleTime: 5 * 60 * 1000,
});

// Usage: useQuery(userQuery.options(userId))
```

### Mutation with invalidation
```ts
import { createMutation } from "@almach/query";

export const useUpdateUser = createMutation({
  mutationFn: (input: UpdateUserInput) => updateUser(input),
  invalidates: [["users"]],
});
```

### Form with Zod schema
```tsx
import { Form, TextField, useBasedForm, z } from "@almach/forms";
import { Button } from "@almach/ui";

const schema = z.object({ email: z.string().email() });

function MyForm() {
  const form = useBasedForm({
    schema,
    defaultValues: { email: "" },
    onSubmit: async (values) => { /* fully typed */ },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <TextField name="email" label="Email" required />
        <Button type="submit" loading={form.formState.isSubmitting}>Submit</Button>
      </form>
    </Form>
  );
}
```

### Server action (Next.js compatible)
```ts
// server action
import type { ActionResult } from "@almach/query";

export async function createPostAction(input: CreatePostInput): Promise<ActionResult<Post>> {
  try {
    const post = await db.post.create({ data: input });
    return { success: true, data: post };
  } catch {
    return { success: false, error: { message: "Failed to create post" } };
  }
}

// client hook
import { createServerAction } from "@almach/query";

export const useCreatePost = createServerAction({
  action: createPostAction,
  invalidates: [["posts"]],
});
```
