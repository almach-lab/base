---
name: tailwind-semantic
description: Enforce Almach semantic Tailwind v4 tokens — no primitive colors, correct dark mode, CSS-first config. Use when styling components, reviewing className strings, or adding design tokens.
---

# Tailwind Semantic Tokens

Tailwind CSS **v4** — CSS-first. No `tailwind.config.js`. Tokens in `packages/ui/src/styles/globals.css`.

---

## Allowed color utilities

Parse from `@theme inline { --color-* }` in globals.css:

**Surfaces:** `background`, `foreground`, `card`, `popover`, `muted`, `accent`
**Brand:** `primary`, `secondary`, `destructive`, `success`, `warning`
**UI:** `border`, `input`, `ring`
**Charts:** `chart-1` … `chart-5`
**Sidebar:** `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-border`, `sidebar-accent`

**Foreground pairs:** `*-foreground` variants (e.g. `text-primary-foreground`)

**Exceptions:** `bg-white`, `bg-black`, `text-white`, `text-black`, `transparent`, `current`

---

## Forbidden

```
bg-blue-500    text-gray-900    border-slate-200
bg-red-600     text-zinc-500    ring-indigo-500
from-purple-500 via-pink-500 to-orange-400
```

Use semantic equivalents:

| Instead of | Use |
|------------|-----|
| `bg-gray-100` | `bg-muted` |
| `text-gray-500` | `text-muted-foreground` |
| `border-gray-200` | `border-border` |
| `bg-red-500` | `bg-destructive` |
| `bg-green-500` | `bg-success` |
| `bg-yellow-500` | `bg-warning` |
| `bg-pink-500` | `bg-primary` |

---

## Dark mode

```css
/* globals.css */
@custom-variant dark (&:where(.dark, .dark *));
```

- Use `dark:` prefix when needed (Almach uses class-based dark mode)
- Prefer tokens that adapt via CSS vars in `:root` / `.dark` blocks
- Add token in **both** `:root`/`.dark` **and** `@theme inline { --color-* }`

---

## Adding a new token

1. Add HSL var in `:root` and `.dark` in `globals.css`
2. Add `--color-{name}: hsl(var(--{name}))` in `@theme inline`
3. Docs overrides go in `apps/docs/src/styles/globals.css` only

---

## Class composition

```tsx
import { cn } from "@almach/utils";

// CORRECT
className={cn("bg-background text-foreground", isActive && "bg-accent", className)}

// WRONG — loses passthrough
className="bg-background text-foreground"
```

---

## Radius & shadow conventions

| Element | Radius | Shadow |
|---------|--------|--------|
| Inputs, buttons, menu items | `rounded-md` | `shadow-xs` |
| Cards, dialogs | `rounded-lg` | `shadow-lg` |
| Badges, chips | `rounded-sm` / `rounded-full` | none |
| Popovers | `rounded-md` | `shadow-md` |

---

## Lint

```bash
bun run lint:ui   # catches primitive colors in className
bun run lint      # Biome formatting + JS rules
```

---

## Anti-patterns

| Pattern | Why |
|---------|-----|
| `@tailwind base/components/utilities` | v3 artifact — use `@import "tailwindcss"` |
| `tailwind.config.js` | v4 is CSS-first |
| Arbitrary hex `bg-[#ff0000]` | Use semantic token |
| Dynamic class construction `` `bg-${color}-500` `` | JIT can't detect — use static strings |
| Inline `style` for static values | Tailwind utilities |
