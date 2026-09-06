"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import type { FieldSize } from "./_styles.js";

export type SegKey = "month" | "day" | "year";

export const SEG_LIMITS: Record<
  SegKey,
  { min: number; max: number; len: number }
> = {
  month: { min: 1, max: 12, len: 2 },
  day: { min: 1, max: 31, len: 2 },
  year: { min: 1900, max: 2100, len: 4 },
};

export const SEG_PLACEHOLDER: Record<SegKey, string> = {
  month: "MM",
  day: "DD",
  year: "YYYY",
};

const SEG_WIDTH: Record<FieldSize, Record<SegKey, string>> = {
  sm: { month: "w-6", day: "w-6", year: "w-11" },
  default: { month: "w-8", day: "w-8", year: "w-[3.2rem]" },
  lg: { month: "w-10", day: "w-10", year: "w-16" },
};

/** Supported tokens: MM, DD, YYYY. Separator = first non-token char. */
export function parseFormat(fmt: string): { order: SegKey[]; sep: string } {
  const sep = fmt.replace(/MM|DD|YYYY/g, "")[0] ?? "/";
  const order: SegKey[] = fmt
    .split(sep)
    .map((p) => (p === "MM" ? "month" : p === "DD" ? "day" : "year"));
  return { order, sep };
}

export function dateToSegments(date: Date): Record<SegKey, string> {
  return {
    month: String(date.getMonth() + 1).padStart(2, "0"),
    day: String(date.getDate()).padStart(2, "0"),
    year: String(date.getFullYear()),
  };
}

/** Parses a segment record into a valid Date, or undefined if incomplete/invalid. */
export function segmentsToDate(seg: Record<SegKey, string>): Date | undefined {
  const m = parseInt(seg.month, 10);
  const d = parseInt(seg.day, 10);
  const y = parseInt(seg.year, 10);
  // Every segment must be at its full length, not just numerically parseable —
  // otherwise a still-being-typed leading digit ("1" en route to "12") reads as
  // a complete date the moment day/year are already valid, gets emitted, and
  // echoes back through `value` before the second keystroke can land.
  if (
    m &&
    d &&
    y &&
    seg.month.length === SEG_LIMITS.month.len &&
    seg.day.length === SEG_LIMITS.day.len &&
    seg.year.length === SEG_LIMITS.year.len
  ) {
    const date = new Date(y, m - 1, d);
    if (!Number.isNaN(date.getTime()) && date.getMonth() === m - 1) {
      return date;
    }
  }
  return undefined;
}

export function segmentInputClassName(
  key: SegKey,
  active: boolean,
  size: FieldSize,
) {
  return cn(
    "bg-transparent text-center outline-none tabular-nums caret-transparent select-none",
    // select-none only blocks user drag-selection; .select() on focus (for
    // replace-on-type) still triggers the browser's native selection paint,
    // which can't be transition-eased and visually fights the smooth
    // active-segment fade below. Make the native selection invisible so the
    // only visible highlight is the eased one.
    "selection:bg-transparent",
    "rounded",
    MOTION_INTERACTIVE,
    "placeholder:text-muted-foreground/50",
    SEG_WIDTH[size][key],
    active && "bg-primary/10 text-primary",
  );
}

/** ArrowUp/ArrowDown clamp+pad step. */
export function stepSegmentValue(
  seg: Record<SegKey, string>,
  key: SegKey,
  direction: 1 | -1,
): Record<SegKey, string> {
  const { min, max, len } = SEG_LIMITS[key];
  const cur = parseInt(seg[key], 10) || min;
  const next = String(Math.min(Math.max(cur + direction, min), max)).padStart(
    len,
    "0",
  );
  return { ...seg, [key]: next };
}

/**
 * Digit-entry parse+clamp; reports whether focus should advance to the next segment.
 *
 * `insertedData` is the browser's own record of exactly what was just typed
 * (from InputEvent.data), passed whenever available. When the segment was
 * already at full length, we prefer this over diffing `raw` — a `.select()`
 * call on focus (used so retyping a full segment replaces it) doesn't
 * reliably collapse the cursor to a consistent position across browsers, so
 * diffing the post-selection `raw` value can silently reconstruct the OLD
 * value instead of the new keystroke, which then reads as "complete" and
 * advances focus away — the segment never visibly changes and typing seems
 * to do nothing. Reading the actually-typed character straight from the
 * event sidesteps that ambiguity entirely. Only applies to insertions; a
 * shrinking `raw` (backspace/delete, where `data` is null) always uses the
 * normal diff path below.
 */
export function applySegmentDigits(
  seg: Record<SegKey, string>,
  key: SegKey,
  raw: string,
  insertedData?: string | null,
): { seg: Record<SegKey, string>; advance: boolean } {
  const { min, max, len } = SEG_LIMITS[key];
  const wasFull = seg[key].length === len;
  const insertedDigits = insertedData ? insertedData.replace(/\D/g, "") : "";
  const digits =
    wasFull && insertedDigits
      ? insertedDigits.slice(-len)
      : raw.replace(/\D/g, "").slice(-len);
  let val = digits;
  if (digits.length === len) {
    const n = parseInt(digits, 10);
    if (n > max) val = String(max).padStart(len, "0");
    else if (n < min) val = String(min).padStart(len, "0");
  }
  // Advance only once the segment reaches its full length (e.g. year needs
  // all 4 digits) — keeps focus in place for a single ambiguous digit like
  // month "2" instead of jumping away before the user can correct it.
  const advance = val.length === len;
  return { seg: { ...seg, [key]: val }, advance };
}

export function makeFlatId(prefix: string, key: SegKey): string {
  return prefix ? `${prefix}:${key}` : key;
}

/** Click-to-focus-nearest-segment guard shared by Input.Date and Input.DateRange's
 * group container: a click directly on a segment input already receives native
 * focus before this handler runs, but `active` (React state) hasn't caught up
 * yet within this same event, so without this guard every click on a
 * freshly-mounted field reads `active` as stale `null` and steals focus. A click
 * lands here (rather than on an `<input>`) when it hits the separators, padding,
 * or the gap between the "from" and "to" groups — picking the segment whose
 * bounding box is horizontally closest to the click keeps that redirect
 * pointed at whichever side the user actually meant, instead of always
 * snapping to the first segment of the first group. */
export function createGroupClickFocusNearest(
  active: string | null,
  flatIds: string[],
  refs: Record<string, React.RefObject<HTMLInputElement | null>>,
  focus: (id: string | undefined) => void,
) {
  return (e: React.MouseEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (active) return;
    const x = e.clientX;
    let closestId: string | undefined;
    let closestDist = Number.POSITIVE_INFINITY;
    for (const id of flatIds) {
      const rect = refs[id]?.current?.getBoundingClientRect();
      if (!rect) continue;
      const dist = Math.abs(x - (rect.left + rect.width / 2));
      if (dist < closestDist) {
        closestDist = dist;
        closestId = id;
      }
    }
    focus(closestId ?? flatIds[0]);
  };
}

/** Flat-list focus controller — crossing group boundaries is just index +/- 1, no special-casing needed. */
export function createFocusController(
  ids: string[],
  refs: Record<string, React.RefObject<HTMLInputElement | null>>,
) {
  const focus = (id: string | undefined) => {
    if (!id) return;
    refs[id]?.current?.focus();
  };
  const focusNext = (id: string) => focus(ids[ids.indexOf(id) + 1]);
  const focusPrev = (id: string) => focus(ids[ids.indexOf(id) - 1]);
  return { focus, focusNext, focusPrev };
}

export interface SegmentGroupProps {
  /** "" for a single-group field (Input.Date), "from"/"to" for Input.DateRange. */
  idPrefix?: string;
  order: SegKey[];
  sep: string;
  seg: Record<SegKey, string>;
  /** Currently focused flat id (as produced by makeFlatId), or null. */
  active: string | null;
  disabled?: boolean | undefined;
  size: FieldSize;
  getRef: (flatId: string) => React.RefObject<HTMLInputElement | null>;
  onChangeSeg: (
    flatId: string,
    key: SegKey,
    raw: string,
    insertedData?: string | null,
  ) => void;
  onKeyDownSeg: (
    flatId: string,
    key: SegKey,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  onFocusSeg: (flatId: string) => void;
  onBlurSeg: () => void;
  /** Browser attributes forwarded onto each segment input. */
  inputProps?: Record<string, unknown> | undefined;
}

export function SegmentGroup({
  idPrefix = "",
  order,
  sep,
  seg,
  active,
  disabled,
  size,
  getRef,
  onChangeSeg,
  onKeyDownSeg,
  onFocusSeg,
  onBlurSeg,
  inputProps,
}: SegmentGroupProps) {
  return (
    <>
      {order.map((key, i) => {
        const flatId = makeFlatId(idPrefix, key);
        return (
          <React.Fragment key={flatId}>
            {i > 0 && (
              <span
                className="mx-0.5 select-none text-muted-foreground/40"
                aria-hidden="true"
              >
                {sep}
              </span>
            )}
            <input
              {...inputProps}
              ref={getRef(flatId)}
              type="text"
              value={seg[key]}
              placeholder={SEG_PLACEHOLDER[key]}
              maxLength={SEG_LIMITS[key].len}
              disabled={disabled}
              inputMode="numeric"
              aria-label={idPrefix ? `${idPrefix} ${key}` : key}
              className={segmentInputClassName(key, active === flatId, size)}
              onChange={(e) =>
                onChangeSeg(
                  flatId,
                  key,
                  e.target.value,
                  (e.nativeEvent as InputEvent).data,
                )
              }
              onKeyDown={(e) => onKeyDownSeg(flatId, key, e)}
              onFocus={(e) => {
                onFocusSeg(flatId);
                // A pre-filled segment is already at maxLength, so without
                // selecting its text on focus, the browser's native maxLength
                // silently blocks the first keystroke — nothing gets typed
                // until the user manually clears it, which isn't discoverable
                // since the caret is hidden (caret-transparent above).
                e.target.select();
              }}
              onBlur={onBlurSeg}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
