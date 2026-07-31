---
"@almach/ui": patch
---

Fix focus loss inside `Dialog`/`Drawer` while typing, and a batch of related correctness bugs found in a cross-component pass:

- `Dialog` / `Drawer`: the keydown/focus-restore effect depended on `setOpen`, so any parent re-render that recreated `onOpenChange` (e.g. typing into a controlled input inside the modal) tore the effect down and its cleanup stole focus back to the trigger button — every keystroke unfocused the active input. The effect now only depends on `mounted`.
- `Select`: closing via Escape, clicking an item, or selecting in `Select.Searchable` never restored focus to the trigger, dropping focus to `<body>` and breaking tab order.
- `Input.Currency`: typing in the middle of a formatted amount always kicked the caret to the end because thousand-separator reformatting didn't preserve cursor position.
- `Input.DateRange`: editing one side (`from`/`to`) could suppress a later, unrelated external update to the other side due to both skip-sync flags being set on every edit instead of just the changed side.
- `TagInput`: reaching `max` tags unmounted the input, dropping focus to `<body>` and making the container's focus-on-click handler a permanent no-op.
- `Carousel`: keyboard arrow navigation never fired — the keydown listener was attached to the scrollable content div instead of the focusable `role="region"` element.
- `Table` (`DataTable`): pagination was uncontrolled internally (hardcoded `pageIndex: 0`, no `onPaginationChange`), so Next/Previous were silent no-ops.
- `SwipeButton`: every arrow-key press snapped the thumb back to start and fired `onFail`, making keyboard-only completion impossible. Keyboard presses now accumulate position; success/fail is resolved on blur.
- `SwipeActions`: `touch-action` was computed once on mount and never recalculated if action slots changed later; a pending full-swipe snap-back timer wasn't cancelled if a new drag started within its 300ms window, causing a visible jump.
