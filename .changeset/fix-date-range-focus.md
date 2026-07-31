---
"@almach/ui": patch
---

Fix `Input.Date` and `Input.DateRange` focus/typing bugs:

- Clicking padding/gaps inside the field no longer jumps to the first segment — it focuses whichever segment is nearest the click (previously any such click on `Input.DateRange` jumped to the "from" group's first field even when clicking near "to").
- Segment focus now only advances to the next segment once the current one is fully typed (month/day/year all require their full digit count) instead of guessing early on a single ambiguous digit, so typing stays in the segment you're editing until it's complete.
