export const MOTION_EASE_STANDARD = "cubic-bezier(0.22,1,0.36,1)";

export const MOTION_DURATION_FAST = 120;
export const MOTION_DURATION_BASE = 160;
export const MOTION_DURATION_SLOW = 220;

export const MOTION_VAR_OVERLAY_DURATION = "--theme-motion-overlay-duration";
export const MOTION_VAR_INTERACTIVE_DURATION =
  "--theme-motion-interactive-duration";
export const MOTION_VAR_EASE = "--theme-motion-ease-standard";

function parseDurationToMs(raw: string): number | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;

  if (value.endsWith("ms")) {
    const ms = Number(value.slice(0, -2).trim());
    return Number.isFinite(ms) && ms >= 0 ? ms : null;
  }

  if (value.endsWith("s")) {
    const seconds = Number(value.slice(0, -1).trim());
    return Number.isFinite(seconds) && seconds >= 0 ? seconds * 1000 : null;
  }

  const numeric = Number(value);
  return Number.isFinite(numeric) && numeric >= 0 ? numeric : null;
}

export function resolveMotionDurationMs(
  variableName: string,
  fallbackMs: number,
): number {
  if (typeof window === "undefined") return fallbackMs;
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();
  const parsed = parseDurationToMs(raw);
  return parsed ?? fallbackMs;
}

export const MOTION_INTERACTIVE =
  "transition-[background-color,color,border-color,box-shadow,transform,opacity] [--tw-duration:var(--theme-motion-interactive-duration,0.15s)] [--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none";

export const MOTION_OVERLAY =
  "transition-[opacity,transform] [--tw-duration:var(--theme-motion-overlay-duration,0.16s)] [--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none";

/** Fallback used when the overlay duration variable is unset. */
export const MOTION_OVERLAY_DURATION_MS = 220;

/** Builds a `var()` reference for inline styles, so no literal is duplicated. */
export function motionVar(name: string, fallback: string): string {
  return `var(${name}, ${fallback})`;
}

/* ── Hand-rolled overlays (dialog, drawer, select) ───────────────────────── */
/* These drive visibility from a `data-state` attribute we set ourselves. */

export const MOTION_OVERLAY_ENTER =
  "data-[state=open]:opacity-100 data-[state=open]:scale-100";

export const MOTION_OVERLAY_EXIT =
  "data-[state=closed]:opacity-0 data-[state=closed]:scale-[0.98]";

/* ── React Aria overlays (popover, tooltip, menu, hover card) ────────────── */
/* React Aria exposes `data-entering` / `data-exiting` instead, and animates
   with keyframes rather than transitions. Timing still comes from the same
   theme variables, so the customizer affects every overlay alike. */

const OVERLAY_KEYFRAME_TIMING = [
  "data-[entering]:[animation-duration:var(--theme-motion-overlay-duration,0.16s)]",
  "data-[entering]:[animation-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))]",
  "data-[exiting]:[animation-duration:var(--theme-motion-overlay-duration,0.16s)]",
  "data-[exiting]:[animation-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))]",
];

export const MOTION_OVERLAY_RAC = [
  ...OVERLAY_KEYFRAME_TIMING,
  "data-[entering]:animate-in data-[entering]:fade-in-0 data-[entering]:zoom-in-95",
  "data-[exiting]:animate-out data-[exiting]:fade-out-0 data-[exiting]:zoom-out-95",
  "motion-reduce:animate-none",
].join(" ");

/** Directional slide matched to the placement React Aria resolved. */
export const MOTION_OVERLAY_RAC_SLIDE = [
  "data-[entering]:placement-bottom:slide-in-from-top-1",
  "data-[entering]:placement-top:slide-in-from-bottom-1",
  "data-[entering]:placement-left:slide-in-from-right-1",
  "data-[entering]:placement-right:slide-in-from-left-1",
  "data-[exiting]:placement-bottom:slide-out-to-top-1",
  "data-[exiting]:placement-top:slide-out-to-bottom-1",
  "data-[exiting]:placement-left:slide-out-to-right-1",
  "data-[exiting]:placement-right:slide-out-to-left-1",
].join(" ");

/* ── Expand / collapse and layout ────────────────────────────────────────── */

/** Grid-rows expand used by Accordion and Collapsible. */
export const MOTION_COLLAPSE = [
  "transition-[grid-template-rows,opacity]",
  "[--tw-duration:var(--theme-motion-overlay-duration,0.2s)]",
  "[--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))]",
  "motion-reduce:transition-none",
].join(" ");

/** Width/height changes, such as the sidebar collapsing. */
export const MOTION_LAYOUT = [
  "[--tw-duration:var(--theme-motion-overlay-duration,0.2s)]",
  "[--tw-ease:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))]",
  "motion-reduce:transition-none",
].join(" ");
