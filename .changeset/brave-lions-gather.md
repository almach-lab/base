---
"@almach/ui": minor
---

Add 20 components and fix three token bugs that only affected consumers.

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
