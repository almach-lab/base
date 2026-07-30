---
"@almach/ui": patch
---

Fix `Dialog.Content` applying its desktop rounded-corner treatment below the `md` breakpoint (now square until `md:`, matching where `Modal` switches to rendering `Drawer` instead). Fix `Drawer`'s panel inheriting an unintended `border` from the shared `DIALOG_SURFACE` token that `Dialog` also uses.

Tighten `exactOptionalPropertyTypes` correctness on optional controlled-value props across `Sidebar.MenuButton`/`MenuItem`, `Select`, `Tabs`, `Calendar`, `Input.Currency`, `Progress`, `TagInput`, `Dialog`, `Drawer`, `Popover`, `Modal`, and `Command.Dialog` (`value`/`selected`/`open`/`defaultOpen`-shaped props now correctly accept `T | undefined`, not just absence of the key).

Remove unsound `any` casts in `Button` (href/anchor prop spreading) and `DropdownMenu` (`asChild` trigger child), and non-null assertions in `Input.DateRange`'s segment ref lookup — no behavior change, all internal type-soundness fixes.
