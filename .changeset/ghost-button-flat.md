---
"@almach/ui": patch
---

Smoother sheets and tidier modal spacing.

- `Button variant="ghost"` no longer draws the base `shadow-xs`. A ghost
  button has no surface, so the shadow showed up as a faint line under ghost
  rows stacked in a list (menus, pickers, settings rows).
- `Modal.Body` gets its full bottom padding when it is the last section on
  desktop. The dialog's close button is rendered after the sections, so the
  `:last-child` check never matched; it now uses `:last-of-type`.
- `Drawer` runs on its own clock: `--theme-motion-drawer-duration` (default
  320ms) and `--theme-motion-drawer-ease` (default the iOS sheet curve,
  `cubic-bezier(0.32,0.72,0,1)`). The backdrop fades on the same clock, and the
  sheet unmounts slightly after the exit finishes so its last frames are never
  cut.
- Dismissing a drawer by dragging continues the exit from where the finger let
  go instead of snapping back to the resting position first.
