---
name: docs-ux
description: Almach docs site UX and layout standards — Fumadocs-style shell, ComponentDoc demos, clean navigation, responsive sidebar, theme page. Use when building or refactoring apps/docs pages, landing, or component showcases.
---

# Docs UX (`apps/docs`)

Astro 6 + React islands. Goal: Fumadocs-quality docs — fast navigation, clean typography, realistic demos.

---

## Architecture

| Piece | File | Role |
|-------|------|------|
| Shell | `src/layouts/Layout.astro` | Header, sidebar, footer, mobile nav |
| Content | `src/components/AppShell.tsx` | Lazy page map |
| Component demos | `src/components/pages/components/*.tsx` | One per UI component |
| Nav registry | `src/lib/doc-components.ts` | Single source of truth |
| Doc sections | `src/components/component-doc.tsx` | Stacked examples + API table |
| TOC | `src/components/OnThisPage.tsx` | Heading anchors |
| Theme | `src/pages/theme.astro` + `ThemeCustomizer.tsx` | Full theme editor (not in header) |

---

## Page content rules

1. **Realistic layouts** — dashboard cards, settings forms, confirm dialogs. No gray placeholder boxes.
2. **Stacked sections** — title, description, live demo, code block per example via `ComponentDoc`.
3. **No duplicate styling** — demos consume `@almach/ui` as-is; don't re-style components in demo files.
4. **Code blocks** — `<CodeBlock code="..." lang="tsx" filename="..." />` with Shiki dual-theme.
5. **Prose** — short, direct copy. No AI filler paragraphs.

---

## Navigation

- Sidebar groups in `Layout.astro` `sidebarGroups` — must match `doc-components.ts`
- Search: `SearchCommand.tsx` with `⌘K`
- Mobile: `MobileMoreMenu.tsx` + collapsible `DocSidebar.tsx`
- View transitions: Astro `ClientRouter` — no full reloads

---

## Layout tokens

- Max content width: `max-w-3xl` for prose, wider for component demos
- Spacing: `space-y-8` between sections, `gap-4` in demo grids
- Semantic colors only — docs overrides in `apps/docs/src/styles/globals.css`
- Header: logo + search + theme toggle (mode only, not full customizer)

---

## Landing page (`home.tsx`)

- Hero with install command + package overview
- Feature sections with live component previews (`landing/hero-preview.tsx`)
- Link to getting-started, components index, theme page

---

## Checklist for new doc page

- [ ] Astro page in `src/pages/`
- [ ] React content in `src/components/pages/`
- [ ] Registered in `AppShell.tsx` + `doc-components.ts`
- [ ] Sidebar entry in `Layout.astro`
- [ ] `OnThisPage` headings (`id` on h2/h3)
- [ ] Light + dark mode verified
- [ ] Mobile layout verified

---

## Anti-patterns

| Pattern | Fix |
|---------|-----|
| ThemeCustomizer in header | Dedicated `/theme` page |
| 800+ line showcase pages | 3–4 representative examples |
| Drift between AppShell and sidebar | Single registry |
| `DocLayout.astro` duplicate shell | Use `Layout.astro` only |
| Hard-coded colors in demos | Semantic tokens |
