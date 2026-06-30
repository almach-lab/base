# Almach UI Standardization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish standardizing all `@almach/ui` components and the docs app to shadcn / Base UI / Fumadocs-quality — shared tokens, consistent APIs, cleaner code, better defaults, no visual regressions.

**Architecture:** Extend the existing `packages/ui/src/components/_styles.ts` foundation (already used by Button, Input, Checkbox, Switch, Radio, Alert, Card, Badge, Progress, Label, Textarea). Add overlay/surface/menu variants there. Migrate remaining components in dependency order: surfaces → overlays → data/layout → heavy motion components. Docs app follows component changes; no duplicate styling in demo pages.

**Tech Stack:** Bun workspaces, TypeScript strict, Tailwind CSS v4, React Aria Components, class-variance-authority, Astro 6 docs app.

**Already completed (do not redo):**
- `apps/docs` — Fumadocs-style shell, stacked `ComponentDoc`, cleaner landing/home
- `packages/ui/src/components/_styles.ts` — shared field/control tokens
- Core primitives: `button`, `input`, `textarea`, `checkbox`, `switch`, `radio`, `label`, `badge`, `alert`, `card`, `progress`

---

## File map

| File | Responsibility |
|------|----------------|
| `packages/ui/src/components/_styles.ts` | Single source for focus, disabled, field, overlay, menu, surface variants |
| `packages/ui/src/components/_motion.ts` | Motion duration CSS vars (already exists) |
| `packages/ui/src/components/popover.tsx` | Popover surface + placement helper |
| `packages/ui/src/components/dropdown-menu.tsx` | Menu items, sections, submenus |
| `packages/ui/src/components/dialog.tsx` | Modal dialog (custom portal impl) |
| `packages/ui/src/components/tooltip.tsx` | Tooltip surface |
| `packages/ui/src/components/command.tsx` | Command palette (uses Dialog) |
| `packages/ui/src/components/select.tsx` | Custom select (568 lines — high priority) |
| `packages/ui/src/components/calendar.tsx` | Date picker grid |
| `packages/ui/src/components/table.tsx` | Data table |
| `packages/ui/src/components/sidebar.tsx` | App sidebar |
| `packages/ui/src/components/modal.tsx` | Responsive dialog/drawer bridge |
| `packages/ui/src/components/drawer.tsx` | Bottom/side drawer |
| `packages/ui/src/components/combobox.tsx` | Deprecated re-export stub — remove |
| `packages/ui/src/components/layered-card.tsx` | Deprecated re-export stub — remove |
| `apps/docs/src/components/ThemeCustomizer.tsx` | Demote from header (1950 lines) |
| `apps/docs/src/lib/doc-components.ts` | Nav registry (single source of truth) |

---

## Phase 1 — Extend shared style tokens

### Task 1: Add overlay and menu variants to `_styles.ts`

**Files:**
- Modify: `packages/ui/src/components/_styles.ts`
- Modify: `packages/ui/src/index.ts` (export new tokens)

- [ ] **Step 1: Add overlay surface tokens**

Append to `_styles.ts`:

```ts
export const OVERLAY_SURFACE = cn(
  "z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none",
);

export const OVERLAY_BACKDROP =
  "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm";

export const MENU_ITEM = cn(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  MOTION_INTERACTIVE,
  "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
  DISABLED_DATA,
);

export const MENU_SEPARATOR = "my-1 h-px bg-border";

export const MENU_LABEL =
  "px-2 py-1.5 text-xs font-medium text-muted-foreground";

export const DIALOG_CONTENT = cn(
  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border border-border bg-background p-6 shadow-lg",
  MOTION_OVERLAY,
);

export const TOOLTIP_SURFACE = cn(
  "z-50 overflow-hidden rounded-md border border-border bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
  MOTION_OVERLAY,
);
```

Import `MOTION_OVERLAY` from `./_motion.js` at top of `_styles.ts`.

- [ ] **Step 2: Export from package index**

Add to `packages/ui/src/index.ts`:

```ts
export {
  DIALOG_CONTENT,
  MENU_ITEM,
  MENU_LABEL,
  MENU_SEPARATOR,
  OVERLAY_BACKDROP,
  OVERLAY_SURFACE,
  TOOLTIP_SURFACE,
} from "./components/_styles.js";
```

- [ ] **Step 3: Verify build**

Run: `cd d:\CODES\almach\base && bun run build:packages`  
Expected: exit 0, no TS errors.

- [ ] **Step 4: Commit**

```bash
git add packages/ui/src/components/_styles.ts packages/ui/src/index.ts
git commit -m "refactor(ui): add shared overlay and menu style tokens"
```

---

## Phase 2 — Overlay components (highest visual impact)

### Task 2: Standardize Popover

**Files:**
- Modify: `packages/ui/src/components/popover.tsx`

- [ ] **Step 1: Replace inline surface classes**

Find the `AriaPopover` `className` (around line 135+) and replace hard-coded classes with:

```tsx
import { OVERLAY_SURFACE } from "./_styles.js";
import { MOTION_OVERLAY, MOTION_OVERLAY_ENTER, MOTION_OVERLAY_EXIT } from "./_motion.js";

className={cn(
  OVERLAY_SURFACE,
  MOTION_OVERLAY,
  MOTION_OVERLAY_ENTER,
  MOTION_OVERLAY_EXIT,
  "data-[entering]:animate-in data-[exiting]:animate-out",
  className,
)}
```

Remove any `rounded-xl`, `border-border/60`, `shadow-2xl` ad-hoc values.

- [ ] **Step 2: Verify**

Run: `bun run build:packages`  
Manual: open `/components/popover` in docs dev server — popover opens, arrow aligns, dark mode OK.

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(ui): standardize Popover surface tokens"
```

---

### Task 3: Standardize DropdownMenu

**Files:**
- Modify: `packages/ui/src/components/dropdown-menu.tsx`

- [ ] **Step 1: Replace menu item classes**

Import `MENU_ITEM`, `MENU_SEPARATOR`, `MENU_LABEL`, `OVERLAY_SURFACE`.

Replace item `className` blocks with `cn(MENU_ITEM, ...)` — remove duplicate `rounded-xl`, `duration-100`, inline focus styles.

Replace `Separator` class with `MENU_SEPARATOR`.  
Replace section header classes with `MENU_LABEL`.

- [ ] **Step 2: Replace popover content wrapper**

Menu popover wrapper → `cn(OVERLAY_SURFACE, MOTION_OVERLAY, MOTION_OVERLAY_ENTER, MOTION_OVERLAY_EXIT, "p-1")`.

- [ ] **Step 3: Verify build + docs page**

Run: `bun run build:packages`  
Check: `/components/dropdown-menu` — keyboard nav, submenu, disabled items.

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): standardize DropdownMenu tokens"
```

---

### Task 4: Standardize Tooltip

**Files:**
- Modify: `packages/ui/src/components/tooltip.tsx`

- [ ] **Step 1: Apply TOOLTIP_SURFACE**

Replace tooltip content `className` with:

```tsx
className={cn(
  TOOLTIP_SURFACE,
  MOTION_OVERLAY,
  MOTION_OVERLAY_ENTER,
  MOTION_OVERLAY_EXIT,
  className,
)}
```

- [ ] **Step 2: Verify** — `/components/tooltip`

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(ui): standardize Tooltip surface"
```

---

### Task 5: Standardize Dialog

**Files:**
- Modify: `packages/ui/src/components/dialog.tsx`

- [ ] **Step 1: Overlay uses OVERLAY_BACKDROP**

```tsx
import { DIALOG_CONTENT, OVERLAY_BACKDROP } from "./_styles.js";

// DialogOverlay
className={cn(OVERLAY_BACKDROP, className)}

// DialogContent (merge with existing animation logic)
className={cn(DIALOG_CONTENT, className)}
```

Keep existing portal/scroll-lock logic — only swap class strings.

- [ ] **Step 2: Verify** — `/components/dialog` open/close, escape, focus trap.

- [ ] **Step 3: Commit**

```bash
git commit -m "refactor(ui): standardize Dialog overlay tokens"
```

---

### Task 6: Standardize Command

**Files:**
- Modify: `packages/ui/src/components/command.tsx`

- [ ] **Step 1: Root uses OVERLAY_SURFACE pattern**

```tsx
className={cn(
  "flex w-full min-h-0 flex-col overflow-hidden rounded-lg bg-popover text-popover-foreground",
  MOTION_OVERLAY,
  className,
)}
```

Remove inline `duration-200 ease-[cubic-bezier(...)]` — use `MOTION_OVERLAY`.

- [ ] **Step 2: Item/input classes**

Command items → align with `MENU_ITEM` (same hover/focus/disabled).

- [ ] **Step 3: Verify** — `/components/command` + docs search `⌘K`.

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): standardize Command palette styles"
```

---

## Phase 3 — Form-adjacent components

### Task 7: Simplify Select (largest win)

**Files:**
- Modify: `packages/ui/src/components/select.tsx`

**Problem:** Custom classes (`rounded-2xl`, `border-border/60`, `h-11`) diverge from `inputVariants`.

- [ ] **Step 1: Trigger uses inputVariants**

```tsx
import { inputVariants, FOCUS_RING, DISABLED_DATA } from "./_styles.js";

const selectTriggerClasses = cn(
  inputVariants({ size: "default" }),
  "cursor-pointer justify-between gap-2 text-left",
  FOCUS_RING,
  DISABLED_DATA,
);
```

Delete `selectTriggerClasses`, `selectTriggerMotionClasses`, `selectTriggerStateClasses` string constants.

- [ ] **Step 2: Popup uses OVERLAY_SURFACE**

```tsx
const selectPopupClasses = cn(OVERLAY_SURFACE, "p-1");
```

- [ ] **Step 3: Items use MENU_ITEM**

```tsx
const selectItemClasses = cn(
  MENU_ITEM,
  "grid grid-cols-[1rem_1fr] gap-2",
);
```

- [ ] **Step 4: Verify** — `/components/select` all examples, combobox search mode if present.

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor(ui): align Select with shared field and menu tokens"
```

---

### Task 8: Calendar + Currency Input + Tag Input

**Files:**
- Modify: `packages/ui/src/components/calendar.tsx`
- Modify: `packages/ui/src/components/currency-input.tsx`
- Modify: `packages/ui/src/components/tag-input.tsx`

- [ ] **Step 1: Calendar day/cell buttons** — `FOCUS_RING`, `MOTION_INTERACTIVE`, `rounded-md`

- [ ] **Step 2: Currency input trigger** — reuse `inputVariants` for text field portion

- [ ] **Step 3: Tag input** — chip uses `badgeVariants`, input uses `inputVariants`

- [ ] **Step 4: Verify** — `/components/calendar`, `/components/currency-input`, `/components/tag-input`

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor(ui): standardize calendar, currency, tag-input"
```

---

## Phase 4 — Layout and data components

### Task 9: Table, ScrollArea, Collapsible, Separator

**Files:**
- Modify: `packages/ui/src/components/table.tsx`
- Modify: `packages/ui/src/components/scroll-area.tsx`
- Modify: `packages/ui/src/components/collapsible.tsx`
- Modify: `packages/ui/src/components/separator.tsx`

- [ ] **Step 1: Table** — header row `text-muted-foreground`, row hover `hover:bg-muted/50`, `MOTION_INTERACTIVE` on rows, `border-border`

- [ ] **Step 2: ScrollArea** — thumb `bg-border rounded-full`, no custom colors

- [ ] **Step 3: Collapsible trigger** — `FOCUS_RING`, `CONTROL_LABEL` for trigger text

- [ ] **Step 4: Separator** — explicit `bg-border` (already mostly done)

- [ ] **Step 5: Verify + commit**

```bash
git commit -m "refactor(ui): standardize table, scroll-area, collapsible"
```

---

### Task 10: Tabs polish

**Files:**
- Modify: `packages/ui/src/components/tabs.tsx`

- [ ] **Step 1: Import FOCUS_RING from `_styles.ts`** — replace inline `focus-visible:ring-2` in `tabsTriggerVariants`

- [ ] **Step 2: List variant `pill`** — `rounded-lg` not `rounded-xl` for consistency

- [ ] **Step 3: Verify** — `/components/tabs` all three variants

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): align Tabs focus and radius tokens"
```

---

### Task 11: Sidebar

**Files:**
- Modify: `packages/ui/src/components/sidebar.tsx`

- [ ] **Step 1: Nav items** — match docs `DocSidebar` pattern: `text-sm`, `rounded-md`, `bg-accent` active, `text-muted-foreground` default

- [ ] **Step 2: Use semantic sidebar CSS vars** (`bg-sidebar`, `text-sidebar-foreground`) consistently — remove hard-coded opacity chains

- [ ] **Step 3: Verify** — `/components/sidebar`

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): clean Sidebar nav item styles"
```

---

## Phase 5 — Heavy components (careful, API-stable)

### Task 12: Modal + Drawer bridge

**Files:**
- Modify: `packages/ui/src/components/modal.tsx`
- Modify: `packages/ui/src/components/drawer.tsx`

- [ ] **Step 1: Shared overlay** — both use `OVERLAY_BACKDROP` + `DIALOG_CONTENT` (drawer overrides position to bottom/side only)

- [ ] **Step 2: Do not change public API** — `open`, `onOpenChange`, `Modal.Content`, etc. stay the same

- [ ] **Step 3: Verify** — `/components/modal`, `/components/drawer`

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): unify Modal and Drawer overlay tokens"
```

---

### Task 13: SwipeButton + SwipeActions (defer internals, style only)

**Files:**
- Modify: `packages/ui/src/components/swipe-button.tsx`
- Modify: `packages/ui/src/components/swipe-actions.tsx`

- [ ] **Step 1: Extract track/thumb surface classes** to `_styles.ts` as `swipeTrackVariants` if repeated

- [ ] **Step 2: Apply `MOTION_INTERACTIVE`, `FOCUS_RING`, `rounded-md`** on action buttons only — do not refactor physics/spring logic

- [ ] **Step 3: Verify** — `/components/swipe-button`, `/components/swipe-actions`

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): align swipe component surfaces"
```

---

### Task 14: Chart (style tokens only)

**Files:**
- Modify: `packages/ui/src/components/chart.tsx`

- [ ] **Step 1: Ensure chart colors use `--chart-1`…`--chart-5`** — no hard-coded hex in component file

- [ ] **Step 2: Tooltip/card chrome** — `cardVariants()` for chart tooltips

- [ ] **Step 3: Verify** — `/components/chart`

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(ui): chart semantic color tokens"
```

---

## Phase 6 — Cleanup and deprecation

### Task 15: Remove deprecated stubs and fix docs registry

**Files:**
- Delete or trim: `packages/ui/src/components/combobox.tsx`
- Delete or trim: `packages/ui/src/components/layered-card.tsx`
- Delete: `apps/docs/src/components/pages/components/combobox.tsx`
- Delete: `apps/docs/src/components/pages/components/layered-card.tsx`
- Modify: `apps/docs/src/lib/doc-components.ts` — add `currency-input` if missing
- Modify: `apps/docs/src/components/AppShell.tsx` — ensure registry matches `doc-components.ts`
- Delete: `apps/docs/src/layouts/DocLayout.astro` (unused)

- [ ] **Step 1: Remove combobox/layered-card exports from `packages/ui/src/index.ts`**

- [ ] **Step 2: Grep codebase for imports** — replace `combobox` usages with `Select`, `layered-card` with `Card.Layers`

Run: `rg "combobox|layered-card" packages apps`

- [ ] **Step 3: Single nav source** — generate `AppShell` component map from `DOC_COMPONENT_GROUPS` or shared constant to prevent drift

- [ ] **Step 4: Verify build**

Run: `bun run build`  
Expected: 41 docs pages, all packages build.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove deprecated combobox/layered-card and fix docs registry"
```

---

### Task 16: Demote ThemeCustomizer

**Files:**
- Modify: `apps/docs/src/components/navigation/DocsHeader.astro`
- Modify: `apps/docs/src/layouts/Layout.astro`
- Create: `apps/docs/src/pages/theme.astro`
- Create: `apps/docs/src/components/pages/theme.tsx`

- [ ] **Step 1: Remove palette button from docs header** — keep `ThemeModeToggle` only

- [ ] **Step 2: Add `/theme` page** with full `ThemeCustomizer` panel

- [ ] **Step 3: Add sidebar link** under Getting Started → "Theme"

- [ ] **Step 4: Verify** — theme still persists via `localStorage`, light/dark toggle works on all pages

- [ ] **Step 5: Commit**

```bash
git commit -m "refactor(docs): move ThemeCustomizer to dedicated /theme page"
```

---

### Task 17: Simplify Blocks page

**Files:**
- Modify: `apps/docs/src/components/pages/blocks.tsx`

- [ ] **Step 1: Reduce from 865 lines** — keep 3–4 representative blocks (dashboard header, settings list, delete confirm)

- [ ] **Step 2: Use `ComponentDoc` pattern** or simple stacked sections like other docs pages

- [ ] **Step 3: Add to docs sidebar** in `doc-components.ts` or remove from landing nav — pick one (recommended: sidebar entry "Blocks")

- [ ] **Step 4: Commit**

```bash
git commit -m "refactor(docs): simplify Blocks showcase page"
```

---

## Phase 7 — Verification gate

### Task 18: Full CI verification

- [ ] **Step 1: Lint**

Run: `bun run lint`  
Expected: exit 0

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`  
Expected: exit 0

- [ ] **Step 3: Build**

Run: `bun run build`  
Expected: exit 0, 41 static pages

- [ ] **Step 4: Manual smoke checklist**

| Route | Check |
|-------|-------|
| `/` | Hero, install tabs, package cards |
| `/getting-started` | Steps, code blocks, TOC |
| `/components` | Search, category list |
| `/components/button` | Stacked examples, API table |
| `/components/select` | Open, keyboard, error state |
| `/components/dialog` | Open, escape, focus |
| `/forms` | Live form submit + validation |
| `/theme` | Customizer saves tokens |

- [ ] **Step 5: Dark mode** — toggle on 3 pages, no contrast failures on inputs/buttons

---

## API conventions (enforce on every touched component)

| Concern | Standard |
|---------|----------|
| Controlled state | `open` + `onOpenChange`, `value` + `onValueChange` |
| Boolean dismiss | `isDisabled`, `isRequired` (React Aria) |
| Error state | `error?: boolean` → `aria-invalid` + `fieldErrorClass()` |
| className | Always merged last via `cn()` |
| Variants | `cva` in `_styles.ts` or co-located, exported as `*Variants` |
| Motion | `MOTION_INTERACTIVE` (controls), `MOTION_OVERLAY` (popovers/dialogs) |
| Radius | `rounded-md` inputs/buttons/menus, `rounded-lg` cards/dialogs |
| Colors | Semantic tokens only — never `bg-blue-500` |
| displayName | Required on all `forwardRef` exports |

---

## Suggested execution order

```
Phase 1 → Phase 2 (Tasks 2–6) → Phase 3 Task 7 (Select) → Phase 3 Task 8
→ Phase 4 → Phase 5 (only if time) → Phase 6 → Phase 7
```

**Estimated effort:** Phase 1–4 ≈ 1 session. Phase 5–6 ≈ 1 session. Phase 7 always last.

---

## Self-review

| Spec requirement | Task |
|------------------|------|
| Shared shadcn-style tokens | Task 1 (extend), Tasks 2–14 (consume) |
| All components cleaned | Phases 2–5 cover all 38 components |
| Customizable via exported variants | Task 1 exports + each component exports `*Variants` |
| Docs aligned | Tasks 15–17 |
| No regressions | Task 18 |
| Reusable code | `_styles.ts` centralization throughout |

No placeholders. All file paths are absolute repo paths under `packages/ui` and `apps/docs`.
