---
"@almach/ui": major
---

Rework `@almach/ui` to React Aria foundations and remove Base UI primitives.

### Breaking changes

- Removed `@base-ui/react` from `@almach/ui`.
- Reworked interactive components to React Aria / React Aria Components behavior and state models.
- Unified compound component anatomy across form, overlay, and selection primitives.
- Updated data-attribute/state handling and internal composition paths.
- Removed legacy Radix/Base UI-specific selector assumptions.

### Migration notes

- Audit custom CSS selectors and update state hooks to the new React Aria-driven attributes/classes.
- Review trigger/content/item/value composition for overlays and selection controls.
- Re-test keyboard and focus-visible behavior for all wrapped primitives.
- See `packages/ui/MIGRATION.md` for detailed old-to-new API notes.
