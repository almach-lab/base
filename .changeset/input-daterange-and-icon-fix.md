---
"@almach/ui": minor
---

Add `Input.DateRange` — a two-field (from/to) segmented date-range input sharing one bordered field, with continuous keyboard navigation across both groups and an optional `withCalendar` two-month range picker popover. Uses the existing `DateRange` type and `Calendar` `mode="range"`.

Add `size` (`"sm" | "default" | "lg"`) support to `Input.Date` and `Input.Currency`, matching the base `Input` component.

Fix: `Input`'s `rightElement` icon (e.g. the password-visibility toggle, or any icon passed via `rightElement`) rendered unpositioned and overlapped the input text at `sm` and `default` sizes. The positioning class was built at runtime via `.replace("left", "right")`, which Tailwind's static content scanner can never see, so the `right-*` utility was never generated. Replaced with a static per-size class map.

Standardize `Input.Date`'s container onto the shared `FIELD_GROUP`/`fieldErrorClass` tokens (previously hand-rolled, causing `rounded-lg` instead of the rest of the library's `rounded-md`, and a slightly different focus/error ring implementation).
