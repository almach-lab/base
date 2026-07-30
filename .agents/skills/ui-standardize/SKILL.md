---
name: ui-standardize
description: Standardize @almach/ui components and docs to shared tokens, consistent APIs, and clean Tailwind v4 styling. Use when refactoring components, cleaning UI code, aligning overlays/menus/forms, or executing the UI standardization plan.
---

# UI Standardize

Align `@almach/ui` and `apps/docs` to shadcn-quality: shared tokens, consistent APIs, semantic colors, no visual regressions.

**Plan:** `docs/superpowers/plans/2026-06-30-ui-standardization-plan.md`

---

## Before touching any file

1. Read `packages/ui/src/components/_styles.ts` — single source for field/control/overlay tokens
2. Read `packages/ui/src/components/_motion.ts` — motion tokens
3. Check if component already uses shared tokens (Button, Input, Checkbox, Switch, Radio, Alert, Card, Badge, Progress, Label, Textarea are done)
4. Run `bun run lint:ui` on files you change

---

## Token hierarchy

| Layer          | Source                                                                     | Use for                               |
| -------------- | -------------------------------------------------------------------------- | ------------------------------------- |
| Field controls | `inputVariants`, `textareaVariants`, `FOCUS_RING`, `DISABLED_DATA`         | inputs, selects, triggers             |
| Overlays       | `OVERLAY_SURFACE`, `OVERLAY_BACKDROP`, `DIALOG_CONTENT`, `TOOLTIP_SURFACE` | popover, dialog, tooltip, command     |
| Menus          | `MENU_ITEM`, `MENU_SEPARATOR`, `MENU_LABEL`                                | dropdown, select items, command items |
| Motion         | `MOTION_INTERACTIVE`, `MOTION_OVERLAY`                                     | controls vs popovers                  |
| Variants       | `cva` + `*Variants` export                                                 | button, badge, card                   |

**Never** hard-code `rounded-xl`, `border-border/60`, `shadow-2xl`, `duration-200 ease-[...]` on components — use shared tokens.

---

## Component checklist (every touched file)

- [ ] `React.forwardRef` for DOM-wrapping components
- [ ] `displayName` set
- [ ] `className` merged last via `cn(..., className)`
- [ ] `error?: boolean` → `aria-invalid` + `fieldErrorClass()` for inputs
- [ ] Controlled: `open`/`onOpenChange`, `value`/`onValueChange`
- [ ] Semantic colors only (`bg-primary`, `text-muted-foreground`, never `bg-blue-500`)
- [ ] Radius: `rounded-md` controls/menus, `rounded-lg` cards/dialogs
- [ ] Export `*Variants` from component file
- [ ] No decorative comments or AI prose in component files

---

## Migration order

```
1. Extend _styles.ts (overlay/menu tokens)
2. Overlays: popover → dropdown-menu → tooltip → dialog → command
3. Forms: select → calendar → currency-input → tag-input
4. Layout: table → scroll-area → collapsible → tabs → sidebar
5. Heavy: modal → drawer → swipe → chart (style only, keep APIs)
6. Docs: registry cleanup, ThemeCustomizer → /theme, simplify blocks
```

---

## Docs app rules

- Demo pages show realistic product layouts, not placeholder boxes
- Use `ComponentDoc` stacked sections — no duplicate styling in demos
- Nav registry: `apps/docs/src/lib/doc-components.ts` is source of truth
- Theme tokens: `apps/docs/src/styles/globals.css` overrides only

---

## Verify after each component

```bash
bun run build:packages
bun run lint:ui
```

Manual: open `/components/<name>` — light + dark mode, keyboard nav, error states.

---

## Anti-patterns

| Pattern                               | Fix                                    |
| ------------------------------------- | -------------------------------------- |
| `bg-blue-500`, `text-gray-900`        | Semantic token from `globals.css`      |
| Inline `style={{}}` for static values | Tailwind utilities                     |
| `clsx` / `twMerge` directly           | `cn()` from `@almach/utils`            |
| `tailwind.config.js`                  | CSS-first Tailwind v4 in `globals.css` |
| Duplicate nav in AppShell + Layout    | Single registry                        |
