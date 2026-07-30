---
name: component-conventions
description: Almach UI component authoring conventions — forwardRef, cva variants, React Aria, shared _styles tokens, compound components. Use when creating, scaffolding, or reviewing packages/ui components.
---

# Component Conventions (`@almach/ui`)

React Aria Components + Tailwind v4 + `class-variance-authority`. Parent: root `AGENTS.md`, child: `packages/ui/AGENTS.md`.

---

## File layout

```
packages/ui/src/components/
├── _styles.ts          # Shared tokens (import here first)
├── _motion.ts          # Motion duration/easing CSS vars
├── button.tsx          # Flat file per component
├── dialog.tsx          # Compound components in one file
└── index.ts            # Barrel export (named exports only)
```

Scaffold checklist: component → `index.ts` export → docs demo → `doc-components.ts` → `Layout.astro` sidebar → `pages/components/<name>.astro`

---

## Required pattern

```tsx
import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { FOCUS_RING, DISABLED_DATA } from "./_styles.js";
import { MOTION_INTERACTIVE } from "./_motion.js";

const thingVariants = cva(
  ["base-classes", MOTION_INTERACTIVE, FOCUS_RING, DISABLED_DATA],
  {
    variants: {
      variant: { default: "...", outline: "..." },
      size: { sm: "...", default: "..." },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ThingProps
  extends
    React.ComponentPropsWithoutRef<"div">,
    VariantProps<typeof thingVariants> {
  error?: boolean;
}

const Thing = React.forwardRef<HTMLDivElement, ThingProps>(
  ({ className, variant, size, error, ...props }, ref) => (
    <div
      ref={ref}
      aria-invalid={error || undefined}
      className={cn(thingVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Thing.displayName = "Thing";

export { Thing, thingVariants };
```

---

## Compound components

```tsx
const DialogRoot = React.forwardRef<...>(...);
const DialogTrigger = React.forwardRef<...>(...);

export const Dialog = Object.assign(DialogRoot, {
  Root: DialogRoot,
  Trigger: DialogTrigger,
});

DialogRoot.displayName = "Dialog";
DialogTrigger.displayName = "Dialog.Trigger";
```

---

## Styling rules

- **Always** `cn(base, conditional && "extra", className)` — never bare `className="..."` without passthrough
- **Semantic tokens only**: `text-foreground`, `bg-muted`, `border-border`, `ring-ring`
- **Dark mode**: `dark:` prefix on parent `.dark` (via `@custom-variant dark` in globals.css)
- **State**: React Aria `data-[hovered]`, `data-[focused]`, `data-[pressed]` — not `hover:` for RAC components
- **Motion**: `MOTION_INTERACTIVE` on controls, `MOTION_OVERLAY` on popovers/dialogs

---

## API conventions

| Concern          | Standard                                         |
| ---------------- | ------------------------------------------------ |
| Controlled open  | `open` + `onOpenChange`                          |
| Controlled value | `value` + `onValueChange`                        |
| Disabled         | `isDisabled` (React Aria) or `disabled` (native) |
| Error            | `error?: boolean`                                |
| className        | Always merged last                               |

---

## Anti-patterns

| Pattern                   | Instead                          |
| ------------------------- | -------------------------------- |
| Missing `displayName`     | Set after every `forwardRef`     |
| Raw Tailwind colors       | Semantic tokens                  |
| `as any`                  | Model types correctly            |
| Per-component CSS files   | Tailwind utilities only          |
| `rounded-2xl` on inputs   | `rounded-md` via `inputVariants` |
| Long narrative comments   | Self-explanatory code            |
| `{cond && A}{!cond && B}` | `{cond ? A : B}`                 |

---

## Lint enforcement

Run `bun run lint:ui` — checks displayName, cn() usage, primitive colors, cross-package imports.
