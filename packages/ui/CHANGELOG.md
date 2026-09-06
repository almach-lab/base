# @almach/ui

## 3.6.0

### Minor Changes

- auto release from 910e9f0..7918c6c
- a3a97f9: Add 20 components and fix three token bugs that only affected consumers.

  **New components**

  - Inputs: `Slider`, `Toggle` / `ToggleGroup`, `NumberField`, `InputOtp`,
    `TimeField`, `ColorPicker`, `Input.Color`, `FileUpload`
  - Display: `Meter`, `Empty`, `Stepper`
  - Layout: `Accordion`, `Breadcrumb`, `Resizable`, `Toolbar`
  - Overlay: `HoverCard`, `Menubar`, `NavigationMenu`
  - Data: `Pagination` (plus the exported `getPaginationRange` helper), `Tree`

  `Input.Color` mounts on the `Input` compound alongside `Input.Date` and
  `Input.Currency`. It pairs an inline swatch trigger with the popover picker and
  keeps the text field editable, so a colour can be typed or pasted; a draft that
  does not parse is reverted on blur rather than emitted. `format` drives both the
  displayed text and `onChange`, and the alpha slider appears only for formats
  that can carry alpha. Modern space-separated notation (`hsl(43 90% 44%)`,
  `rgb(59 130 246 / 0.5)`) is accepted for `value`, `defaultValue` and
  `swatches` — React Aria's parser only takes the comma form — and a swatch that
  still cannot be parsed is dropped rather than thrown during render. Also
  exported standalone as `InputColor`.

  All follow the existing conventions — `forwardRef`, `displayName`, `cva`
  variants, shared `_styles` tokens, and React Aria Components wherever a
  primitive exists. `Menubar` reuses `DropdownMenu`'s items, and
  `NavigationMenu` is built on `HoverCard`, so item styling stays shared.

  **`Skeleton`**

  Gains shape variants (`rect`, `text`, `circle`, `button`, `input`, `avatar`)
  and a `Skeleton.Text` part for multi-line paragraph placeholders. Existing
  `className`-only usage is unchanged, but the root is now always
  `aria-hidden="true"`.

  **Popover fixes**

  - Clicking outside a popover now closes it. React Aria derives outside-press
    dismissal from `isDismissable`, which it computes as `!isNonModal` — so the
    non-modal popovers this library ships never dismissed on an outside click.
    Going modal instead would trap focus and lock page scrolling, so the
    dismissal is handled in the wrapper; presses on the trigger are ignored,
    since React Aria already toggles there.
  - `Popover.Close` worked: it previously returned `null`, silently dropping
    whatever you put inside it. It now renders a button (or clones an `asChild`
    child) wired to dismiss the popover.

  **Consistent motion**

  Every overlay, expand and layout transition now reads the same three theme
  variables, so `--theme-motion-overlay-duration`,
  `--theme-motion-interactive-duration` and `--theme-motion-ease-standard`
  actually retune the whole library:

  - New tokens in `_motion.ts`: `MOTION_OVERLAY_RAC` and
    `MOTION_OVERLAY_RAC_SLIDE` for React Aria overlays, `MOTION_COLLAPSE` for
    expand/collapse, `MOTION_LAYOUT` for width and height changes, plus
    `motionVar()` and `MOTION_OVERLAY_DURATION_MS` for inline styles.
  - Popover, Tooltip, DropdownMenu and HoverCard previously rewrote the
    `data-state` tokens into `data-entering` ones with `String.replaceAll` at
    runtime; they now use the React Aria tokens directly.
  - Dialog dropped its private 260ms duration and easing literals, Modal and
    Drawer their duplicated easing strings, and Accordion, Collapsible, Sidebar,
    Carousel, Stepper, CurrencyInput and SwipeButton their hardcoded
    `duration-*` / bare `transition-*` classes.
  - The skeleton shimmer reads `--theme-motion-shimmer-duration` (default 2s)
    rather than a baked-in 2s.

  Deliberate spring curves in `SwipeButton` and `SwipeActions` are left as they
  are — they are physical, not themeable.

  **`Toaster`**

  Now accepts Sonner's props, so position, duration and the close button are
  configurable instead of hardcoded, plus a `width` prop. Sonner's container
  rule is `width: var(--width)`, which collapses to `auto` when nothing defines
  that variable — long titles then ran past the edge of the toast instead of
  wrapping. `--width` is set explicitly, and the title and description wrap.
  The redundant inline `style` that duplicated the class overrides is gone.

  **Field standardization**

  The plain `Input` and `Textarea` spread onto a real `<input>`, so browser
  attributes always worked there. The composite fields build their own inner
  inputs and had closed prop types, so they silently swallowed autofill hints,
  keyboard hints and form association — several could not even take a `name`,
  which meant they could not participate in a plain form at all.

  - New `FieldBrowserProps` contract (`name`, `autoComplete`, `inputMode`,
    `enterKeyHint`, `spellCheck`, `autoCapitalize`, `autoCorrect`, `autoFocus`,
    `readOnly`, `required`, `form`), applied to `Input.Date`,
    `Input.DateRange` and `Input.Currency`.
  - Those three now render hidden inputs when `name` is set, posting the parsed
    value rather than the on-screen text: `Input.Date` posts an ISO string,
    `Input.DateRange` posts `${name}From` / `${name}To`, and `Input.Currency`
    posts the amount plus `${name}Currency`.
  - Autofilled fields keep their theme colours. Chrome paints
    `:-webkit-autofill` with its own background and ignores `background-color`,
    so `FIELD_AUTOFILL` fakes the fill with an inset shadow via Tailwind's
    `autofill:` variant. It is applied to the shared field bases, and reaches
    the inner inputs of composite fields through `FIELD_GROUP`.

  **Token fixes**

  - `@almach/ui/styles` now declares `@custom-variant dark`. It previously
    lived only in the docs app, so `dark:` utilities silently did nothing for
    anyone importing the stylesheet on its own.
  - The derived radius scale (`--radius-sm` … `--radius-3xl`) ships with the
    package instead of being redefined per app, so `rounded-md` and friends
    track `--radius`.
  - `--theme-motion-interactive-duration`, `--theme-motion-overlay-duration`
    and `--theme-motion-ease-standard` are now defined. Components already
    read them through `var()` and were falling back to inline literals, so
    overriding them had no effect.
  - `--color-sidebar-primary-foreground`, `--color-sidebar-accent-foreground`
    and `--color-sidebar-ring` are mapped in `@theme`; the underlying
    variables existed but no utility was generated for them.

  **Package changes**

  - Per-component subpaths in `exports` are now generated from the component
    files, adding the four that had drifted out (`sidebar`, `month-picker`,
    `input-date-range`, `swipe-button`).
  - Removes six dependencies with no imports anywhere in the source:
    `framer-motion`, `embla-carousel-react`, `embla-carousel-autoplay`,
    `date-fns`, `react-aria`, `react-stately`. Depend on them directly if your
    app was relying on them being hoisted.

## 3.5.1

### Patch Changes

- auto release from f317484..4d5576f
- 4d5576f: Fix `MonthPicker` nav-arrow buttons using `icon-sm` (h-8) while the month/year triggers are `h-9` — both now use `icon` size so the row has a single consistent height.

## 3.5.0

### Minor Changes

- auto release from 0244fcb..91e252f

## 3.4.0

### Minor Changes

- auto release from 24e325c..5b9abae
- 24e325c: Add `MonthPicker` component (month/year dropdowns with prev/next arrows) and make `Input.DateRange` stack responsively on narrow viewports instead of clipping.

## 3.3.3

### Patch Changes

- auto release from 2d16fdd..19bd2e9
- 19bd2e9: Fix focus loss inside `Dialog`/`Drawer` while typing, and a batch of related correctness bugs found in a cross-component pass:

  - `Dialog` / `Drawer`: the keydown/focus-restore effect depended on `setOpen`, so any parent re-render that recreated `onOpenChange` (e.g. typing into a controlled input inside the modal) tore the effect down and its cleanup stole focus back to the trigger button — every keystroke unfocused the active input. The effect now only depends on `mounted`.
  - `Select`: closing via Escape, clicking an item, or selecting in `Select.Searchable` never restored focus to the trigger, dropping focus to `<body>` and breaking tab order.
  - `Input.Currency`: typing in the middle of a formatted amount always kicked the caret to the end because thousand-separator reformatting didn't preserve cursor position.
  - `Input.DateRange`: editing one side (`from`/`to`) could suppress a later, unrelated external update to the other side due to both skip-sync flags being set on every edit instead of just the changed side.
  - `TagInput`: reaching `max` tags unmounted the input, dropping focus to `<body>` and making the container's focus-on-click handler a permanent no-op.
  - `Carousel`: keyboard arrow navigation never fired — the keydown listener was attached to the scrollable content div instead of the focusable `role="region"` element.
  - `Table` (`DataTable`): pagination was uncontrolled internally (hardcoded `pageIndex: 0`, no `onPaginationChange`), so Next/Previous were silent no-ops.
  - `SwipeButton`: every arrow-key press snapped the thumb back to start and fired `onFail`, making keyboard-only completion impossible. Keyboard presses now accumulate position; success/fail is resolved on blur.
  - `SwipeActions`: `touch-action` was computed once on mount and never recalculated if action slots changed later; a pending full-swipe snap-back timer wasn't cancelled if a new drag started within its 300ms window, causing a visible jump.

## 3.3.2

### Patch Changes

- auto release from e204d02..c0f4b16

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
