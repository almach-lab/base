---
"@almach/ui": minor
---

Structured, resizable Modal layout, Card surface variants, and a soft ToggleGroup.

**Modal**

- `Modal.Content` takes `size` — `"sm" | "default" | "lg" | "xl" | "2xl"` —
  mapping to desktop max widths of `max-w-sm`, `lg`, `2xl`, `3xl` and `5xl`.
  The size classes are exported as `modalSizeVariants`. The mobile drawer is
  unaffected.
- `Modal.Content` is now a flex column capped at `max-h-[min(88svh,56rem)]`.
  `Modal.Header` and `Modal.Footer` stay pinned and `Modal.Body` scrolls
  between them, so long content no longer pushes the actions off screen.
- `Modal.Body` animates its height whenever its content grows or shrinks,
  using a ResizeObserver. The first measurement is applied without a
  transition, and reduced motion is respected. Height stays put during the
  open and close zoom so the panel does not resize while it fades. Opt out
  with `animateHeight={false}`. `className` now applies to the inner content
  box. `Modal.AnimatedViewContainer` shares the same implementation.
- Desktop open and close is a shadcn-style fade and 95% zoom. The centering
  translate is not part of that animation, so the panel does not jump. The
  mobile drawer slides on `translate` for the same reason. Closing a
  multi-view modal waits until the panel has left before restoring the
  default view.
- `Modal.Title` and `Modal.Description` wire `aria-labelledby` and
  `aria-describedby` on the content automatically, only when they are
  rendered. For a visually hidden title, render
  `<Modal.Title className="sr-only">`.
- New exported types: `ModalContentProps`, `ModalBodyProps`.

**Visual change:** `Modal.Content` is now borderless on desktop, and its
padding moved from the content box to the sections — Header, Body and Footer
each own their horizontal padding (`px-6` on desktop, `px-5` in the mobile
drawer). Custom children placed directly inside `Modal.Content`, outside
those sections, no longer inherit padding; wrap them in `Modal.Body`.

**Card**

`Card` takes `variant` — `"default" | "flat" | "muted" | "ghost"`. `default`
is unchanged and keeps the border. `flat` is `bg-card` with `shadow-sm` and no
border, `muted` is a borderless `bg-muted` surface, and `ghost` is
transparent. `CardProps` is now exported.

**ToggleGroup**

`ToggleGroup` takes `variant="soft"`: a borderless `rounded-lg bg-muted p-1`
shell where the selected item is raised with `bg-background shadow-xs`,
matching the pill Tabs list. `Toggle` has a matching `variant="soft"`, which
items pick up automatically inside a soft group.

**Fixes**

- `Select.Value` shows the selected item's label on first render. Items now
  stay mounted (hidden) while the list is closed, so their labels register
  before the first open instead of the trigger showing the raw value.
- `Badge` renders a `<span>` (was `<div>`) so it is valid inside buttons and
  inline text. Its ref type is now `HTMLSpanElement`.
- `Switch`'s unselected track uses `bg-input` instead of `bg-muted`, so it
  stays visible on muted surfaces.
- Menu items (DropdownMenu, Menubar, context menus) size only icons without
  an explicit `size-*` class, so a small icon inside a nested Badge keeps its
  own size.
