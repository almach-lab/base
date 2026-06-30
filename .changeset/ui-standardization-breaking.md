---
"@almach/ui": major
---

### Breaking changes

- **Removed exports:** `Combobox` and `LayeredCard` (use `Select` and `Card` instead).
- **`SwipeButton`:** `resetOnSuccess` now defaults to `true` (was `false`); `resetDelay` defaults to `800ms` (was `1200ms`).
- **`Popover`:** `isNonModal` now defaults to `true` for dropdown-style overlays.
- **Shared tokens:** several components moved to `_styles.ts` shared class tokens (visual/API surface unchanged for most).

### Fixes & improvements

- Swipe button pointer capture, geometry sync, and spring-back reset.
- Drawer panel horizontal padding; currency input popover interaction.
- Select and component standardization across the library.
