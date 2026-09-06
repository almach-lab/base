---
"@almach/ui": minor
---

Modernize the chart components, and fix a colour palette that failed its own accessibility checks.

**Palette**

The chart tokens were re-stepped against the dataviz validator rather than by
eye. The previous dark palette **failed** the lightness band — four of five
hues sat above it and glared on a dark surface, because they were the light
steps lightened rather than chosen for dark. The light palette threw a
contrast warning, with four of five hues below 3:1 against the surface.

Both now pass every check in both modes: lightness band, chroma floor, CVD
separation of adjacent pairs, the normal-vision floor, and 3:1 contrast.
Lightness deliberately zigzags across the five hues, since equal-lightness
hues collapse into each other under deuteranopia — an earlier candidate with
uniform lightness dropped the violet/cyan pair to ΔE 0.7. Dark mode has its
own steps rather than a mechanical flip of the light ones.

Hues are unchanged, so series keep their identity; the steps moved.

**Marks**

The series wrappers now carry the mark specs, so callers stop restating them:
2px lines with dots hidden and an 8px active marker ringed in the surface
colour, bars with a 4px rounded data-end anchored to the baseline, a 2px
surface gap between stacked segments via `stacked`, and pie slices separated
the same way. `Chart.LineSeries` and friends were previously raw recharts
primitives with no defaults. They still accept every recharts prop, and the
unstyled primitives remain exported as the escape hatch.

This is safe on recharts 3, which registers children through its store; on
recharts 2 the same wrappers would have broken chart discovery.

**Chrome**

Gridlines were dashed, which reads as a threshold or projection when it is
just a grid. They are now solid hairlines, horizontal only. Axes are
recessive, the legend renders swatches with text in ink tokens rather than
series colours, and `Chart.Tooltip` takes a `cursor` of `line`, `band` or
`none` for the crosshair, bar highlight or neither. `Chart.TooltipContent`
gains an optional total row for stacked charts.
