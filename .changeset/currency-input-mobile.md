---
"@almach/ui": minor
---

`Input.Currency`: the currency list opens in a bottom sheet on phones instead of a popover that could run off the screen, with roomier rows. The desktop popover is capped to the viewport width. The default flag is now the country's emoji flag (`CurrencyFlagEmoji`, newly exported), falling back to the two-letter badge for codes without a flag.
