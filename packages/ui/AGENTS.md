# Component Library (`@almach/ui`)

React Aria Components + Tailwind v4 + CVA. ESM-only, tree-shakeable named exports.

**Parent:** See [root AGENTS.md](../../AGENTS.md).

## STRUCTURE

```
packages/ui/src/
├── components/
│   ├── _styles.ts       # Shared field/overlay/menu tokens — READ FIRST
│   ├── _motion.ts       # Motion CSS var tokens
│   ├── button.tsx       # Flat file per component
│   └── ...
├── styles/globals.css   # Design tokens (@theme inline)
└── index.ts             # Barrel export
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Shared style tokens | `components/_styles.ts` |
| Motion tokens | `components/_motion.ts` |
| Component source | `components/<name>.tsx` |
| Design tokens | `styles/globals.css` |
| Package exports | `index.ts` |

## CONVENTIONS

### Styling (CRITICAL)

- **ONLY semantic tokens**: `bg-background`, `text-foreground`, `border-border`, `ring-ring`
- **NEVER raw Tailwind colors**: `bg-blue-500`, `text-gray-900` → fails `lint:ui`
- **`cn()` always**: `cn(base, className)` — never lose passthrough
- **Shared tokens first**: import from `_styles.ts` before adding inline classes
- **Motion**: `MOTION_INTERACTIVE` (controls), `MOTION_OVERLAY` (popovers)

### Components

- `React.forwardRef` + `displayName` on all DOM wrappers
- Export `*Variants` via `cva`
- `error?: boolean` on inputs → `aria-invalid` + `fieldErrorClass()`
- Controlled: `open`/`onOpenChange`, `value`/`onValueChange`

### Already standardized

`button`, `input`, `textarea`, `checkbox`, `switch`, `radio`, `label`, `badge`, `alert`, `card`, `progress`

### Migration priority

Overlays (popover, dropdown-menu, tooltip, dialog, command) → select → layout (table, tabs, sidebar)

## COMMANDS

```bash
bun run --filter @almach/ui build
bun run lint:ui
```

## ANTI-PATTERNS

| Pattern | Instead |
|---------|---------|
| `bg-blue-500` | Semantic token |
| `rounded-2xl` on inputs | `inputVariants` (`rounded-md`) |
| `clsx` / `twMerge` | `cn()` from `@almach/utils` |
| Component CSS files | Tailwind utilities |
| Cross-package relative imports | `@almach/utils` package name |
