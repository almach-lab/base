---
"@almach/ui": patch
---

`Modal`'s close button now sits in the `Modal.Header` row on desktop, centred
on the title's first line, instead of at a fixed `top-4 right-4` offset that
never lined up with the title (and drifted further when the header held a
back button). Without a `Modal.Header` the dialog keeps its corner button.
