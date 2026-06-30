# Almach Lint Standardizers

Custom UI/style lint rules adapted from [Cloudflare Kumo](https://github.com/cloudflare/kumo) `lint/` directory.

Biome handles JS/TS formatting and general linting. These rules enforce design-system conventions Biome cannot express.

## Rules

| Rule | Scope | What it checks |
|------|-------|----------------|
| `no-primitive-colors` | `packages/ui`, `apps/docs` | No `bg-blue-500`, `text-gray-900` — semantic tokens only |
| `no-cross-package-imports` | All packages | No `../../ui/src/...` — use `@almach/ui` |
| `enforce-component-standard` | `packages/ui/src/components/*.tsx` | `displayName`, `cn()` from `@almach/utils` |
| `no-tailwind-config` | Root | No `tailwind.config.js` / `postcss.config.js` (Tailwind v4) |

## Run

```bash
bun run lint:ui          # UI standardizers only
bun run lint             # Biome + UI standardizers
```

## Valid semantic colors

Parsed from `packages/ui/src/styles/globals.css` `@theme inline`:

`background`, `foreground`, `primary`, `secondary`, `destructive`, `success`, `warning`, `muted`, `accent`, `border`, `input`, `ring`, `card`, `popover`, `chart-1`…`chart-5`, `sidebar-*`

Exceptions: `white`, `black`, `transparent`, `current`

## Agent skills

Related skills in `.agents/skills/`:

- `ui-standardize` — component migration workflow
- `component-conventions` — authoring patterns
- `tailwind-semantic` — token reference
- `docs-ux` — docs layout standards
- `index-knowledge` — AGENTS.md generation
