# @almach/ui

## 3.3.1

### Patch Changes

- auto release from 904716b..eb09803
- eb09803: Fix `Input.Date` and `Input.DateRange` focus/typing bugs:

  - Clicking padding/gaps inside the field no longer jumps to the first segment — it focuses whichever segment is nearest the click (previously any such click on `Input.DateRange` jumped to the "from" group's first field even when clicking near "to").
  - Segment focus now only advances to the next segment once the current one is fully typed (month/day/year all require their full digit count) instead of guessing early on a single ambiguous digit, so typing stays in the segment you're editing until it's complete.

## 3.3.0

### Minor Changes

- auto release from 3391866..1d028d1

## 3.2.0

### Minor Changes

- auto release from 1a9b1e2..32ba4a4

## 3.1.0

### Minor Changes

- auto release from 9738fa5..bdc6e22

## 2.2.0

### Minor Changes

- auto release from 547e6df..1a05024

## 2.1.5

### Patch Changes

- auto release from a8ccc04..3448c12

## 2.1.4

### Patch Changes

- auto release from 6824af6..3a2e9ca

## 2.1.2

### Patch Changes

- auto release from 06bf754..2f8f0dd
- 06bf754: Fix `Dialog.Content` applying its desktop rounded-corner treatment below the `md` breakpoint (now square until `md:`, matching where `Modal` switches to rendering `Drawer` instead). Fix `Drawer`'s panel inheriting an unintended `border` from the shared `DIALOG_SURFACE` token that `Dialog` also uses.

  Tighten `exactOptionalPropertyTypes` correctness on optional controlled-value props across `Sidebar.MenuButton`/`MenuItem`, `Select`, `Tabs`, `Calendar`, `Input.Currency`, `Progress`, `TagInput`, `Dialog`, `Drawer`, `Popover`, `Modal`, and `Command.Dialog` (`value`/`selected`/`open`/`defaultOpen`-shaped props now correctly accept `T | undefined`, not just absence of the key).

  Remove unsound `any` casts in `Button` (href/anchor prop spreading) and `DropdownMenu` (`asChild` trigger child), and non-null assertions in `Input.DateRange`'s segment ref lookup — no behavior change, all internal type-soundness fixes.

## 2.1.0

### Minor Changes

- c8f1bff: Add `Input.DateRange` — a two-field (from/to) segmented date-range input sharing one bordered field, with continuous keyboard navigation across both groups and an optional `withCalendar` two-month range picker popover. Uses the existing `DateRange` type and `Calendar` `mode="range"`.

  Add `size` (`"sm" | "default" | "lg"`) support to `Input.Date` and `Input.Currency`, matching the base `Input` component.

  Fix: `Input`'s `rightElement` icon (e.g. the password-visibility toggle, or any icon passed via `rightElement`) rendered unpositioned and overlapped the input text at `sm` and `default` sizes. The positioning class was built at runtime via `.replace("left", "right")`, which Tailwind's static content scanner can never see, so the `right-*` utility was never generated. Replaced with a static per-size class map.

  Standardize `Input.Date`'s container onto the shared `FIELD_GROUP`/`fieldErrorClass` tokens (previously hand-rolled, causing `rounded-lg` instead of the rest of the library's `rounded-md`, and a slightly different focus/error ring implementation).

### Patch Changes

- auto release from 11f8c8c..5be8875

## 2.0.0

### Major Changes

- Release v2 — UI standardization, docs overhaul, and aligned package versions.

### Patch Changes

- Updated dependencies
  - @almach/utils@2.0.0

## 1.0.0

### Major Changes

- auto release from 3b8fdc2..229907b
- edfb7ad: ### Breaking changes

  - **Removed exports:** `Combobox` and `LayeredCard` (use `Select` and `Card` instead).
  - **`SwipeButton`:** `resetOnSuccess` now defaults to `true` (was `false`); `resetDelay` defaults to `800ms` (was `1200ms`).
  - **`Popover`:** `isNonModal` now defaults to `true` for dropdown-style overlays.
  - **Shared tokens:** several components moved to `_styles.ts` shared class tokens (visual/API surface unchanged for most).

  ### Fixes & improvements

  - Swipe button pointer capture, geometry sync, and spring-back reset.
  - Drawer panel horizontal padding; currency input popover interaction.
  - Select and component standardization across the library.

## 0.3.15

### Patch Changes

- auto release from f167ee2..e573be7

## 0.3.14

### Patch Changes

- auto release from 3bdd0ae..2962da4
- Updated dependencies
  - @almach/utils@0.0.4

## 0.3.13

### Patch Changes

- auto release from f95fcf0..66d87f9
- Updated dependencies
  - @almach/utils@0.0.3

## 0.3.12

### Patch Changes

- auto release from 3bdd0ae..d8ea8b3

## 0.3.11

### Patch Changes

- auto release from 119bc1e..2c42cc3

## 0.3.10

### Patch Changes

- auto release from 3bdd0ae..119bc1e

## 0.3.9

### Patch Changes

- auto release from 3bdd0ae..3b9d7ed

## 0.3.8

### Patch Changes

- auto release from d920f22..f3be10f

## 0.3.7

### Patch Changes

- auto release from 47303d1..134472c

## 0.3.6

### Patch Changes

- auto release from ccb1ea5..598b1a1

## 0.3.5

### Patch Changes

- auto release from 669ed68..8ba6998

## 0.3.4

### Patch Changes

- auto release from be1a39b..e0fe2ea

## 0.3.3

### Patch Changes

- auto release from a8c4d5d..f0732a2

## 0.3.2

### Patch Changes

- auto release from 72b9252..4a9a89f

## 0.3.1

### Patch Changes

- auto release from 22170c9..72b9252

## 0.3.0

### Minor Changes

- Enhance Switch component styles and functionality with improved visual design and interaction states.

## 0.2.0

### Minor Changes

- auto release from 205258a..1cdb1f3

## 0.1.1

### Patch Changes

- auto release from 2404ed9..0ccc096

## 0.1.0

### Minor Changes

- auto release from 0d702a3..ef123b3

## 0.0.10

### Patch Changes

- auto release from 229e7f1..9afe2b7

## 0.0.9

### Patch Changes

- auto release from 8fa54bb..eddacb5

## 0.0.8

### Patch Changes

- auto release from c501a96..3080752

## 0.0.7

### Patch Changes

- auto release from ba7d6a2..bae156a

## 0.0.6

### Patch Changes

- Align theme tokens and customizer output to channel-based CSS variables and ensure consistent light/dark Tailwind token consumption.

## 0.0.5

### Patch Changes

- auto release from 82e035d..391a0fd

## 0.0.4

### Patch Changes

- auto release from 93e2593..8f30350

## 0.0.3

### Patch Changes

- Fix Sonner CSS import behavior to improve SSR compatibility across frameworks (Astro/Next/Remix) by avoiding runtime CSS loading pitfalls.

## 0.0.2

### Patch Changes

- auto release from dcdaaf0..8e847f7
- Updated dependencies
  - @almach/utils@0.0.2

## 0.0.1

### Patch Changes

- Reset release baseline to 0.0.1.
