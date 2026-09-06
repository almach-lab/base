/** Overlay placement plumbing shared by Popover and HoverCard. */

export type OverlaySide = "top" | "right" | "bottom" | "left";
export type OverlayAlign = "start" | "center" | "end";

export type OverlayPlacement =
  | "top"
  | "top start"
  | "top end"
  | "right"
  | "right top"
  | "right bottom"
  | "bottom"
  | "bottom start"
  | "bottom end"
  | "left"
  | "left top"
  | "left bottom";

/**
 * Maps a shadcn-style `side` + `align` pair onto a React Aria placement.
 * Horizontal sides align on the cross axis, so `start`/`end` become
 * `top`/`bottom` there.
 */
export function toOverlayPlacement(
  side: OverlaySide = "bottom",
  align: OverlayAlign = "center",
): OverlayPlacement {
  if (align === "center") return side;

  const cross =
    side === "top" || side === "bottom"
      ? align
      : align === "start"
        ? "top"
        : "bottom";

  return `${side} ${cross}` as OverlayPlacement;
}
