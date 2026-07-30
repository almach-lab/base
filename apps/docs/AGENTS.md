# Docs App (`apps/docs`)

Astro 6 docs + showcase site for `@almach/*` packages.

**Parent:** See [root AGENTS.md](../../AGENTS.md).

## STRUCTURE

```
apps/docs/src/
├── layouts/Layout.astro          # Shell: header, sidebar, footer
├── pages/                        # File-based routes (*.astro)
├── components/
│   ├── AppShell.tsx              # Lazy page router
│   ├── component-doc.tsx         # Stacked demo sections
│   ├── pages/                    # React page content
│   │   └── components/           # Per-component demos
│   └── navigation/               # Headers (docs + landing)
├── lib/doc-components.ts         # Nav registry (source of truth)
└── styles/globals.css            # Docs token overrides
```

## WHERE TO LOOK

| Task               | Location                                           |
| ------------------ | -------------------------------------------------- |
| Sidebar nav        | `layouts/Layout.astro` → `sidebarGroups`           |
| Component registry | `lib/doc-components.ts`                            |
| Page routing       | `components/AppShell.tsx`                          |
| Component demo     | `components/pages/components/<name>.tsx`           |
| Theme customizer   | `pages/theme.astro` + `components/pages/theme.tsx` |
| Search             | `components/SearchCommand.tsx`                     |

## CONVENTIONS

- Astro pages use `<AppShell page="..." client:only="react" />`
- Demos show realistic product UI, not placeholder boxes
- `ComponentDoc` for stacked examples — no duplicate component styling
- Theme mode toggle in header; full customizer on `/theme` only
- Semantic tokens only; overrides in `apps/docs/src/styles/globals.css`

## COMMANDS

```bash
bun run docs          # Dev server
bun run build:docs    # Static build
```

## ANTI-PATTERNS

| Pattern                            | Instead                      |
| ---------------------------------- | ---------------------------- |
| ThemeCustomizer in header          | `/theme` page                |
| Drift between AppShell and sidebar | `doc-components.ts` registry |
| `.tsx` files in `src/pages/`       | `.astro` pages only          |
| 800+ line showcase pages           | 3–4 representative examples  |
