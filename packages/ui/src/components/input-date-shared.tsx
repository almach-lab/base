"use client";

import { cn } from "@almach/utils";
import * as React from "react";
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
  if (m && d && y && seg.year.length === 4) {
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
    "rounded transition-colors duration-100",
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

/** Digit-entry parse+clamp; reports whether focus should advance to the next segment. */
export function applySegmentDigits(
  seg: Record<SegKey, string>,
  key: SegKey,
  raw: string,
): { seg: Record<SegKey, string>; advance: boolean } {
  const { min, max, len } = SEG_LIMITS[key];
  const digits = raw.replace(/\D/g, "").slice(-len);
  let val = digits;
  if (digits.length === len) {
    const n = parseInt(digits, 10);
    if (n > max) val = String(max).padStart(len, "0");
    else if (n < min) val = String(min).padStart(len, "0");
  }
  const advance =
    val.length === len ||
    (key === "month" && parseInt(val, 10) > 1 && val.length === 1) ||
    (key === "day" && parseInt(val, 10) > 3 && val.length === 1);
  return { seg: { ...seg, [key]: val }, advance };
}

export function makeFlatId(prefix: string, key: SegKey): string {
  return prefix ? `${prefix}:${key}` : key;
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
  onChangeSeg: (flatId: string, key: SegKey, raw: string) => void;
  onKeyDownSeg: (
    flatId: string,
    key: SegKey,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  onFocusSeg: (flatId: string) => void;
  onBlurSeg: () => void;
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
              ref={getRef(flatId)}
              type="text"
              value={seg[key]}
              placeholder={SEG_PLACEHOLDER[key]}
              maxLength={SEG_LIMITS[key].len}
              disabled={disabled}
              inputMode="numeric"
              aria-label={idPrefix ? `${idPrefix} ${key}` : key}
              className={segmentInputClassName(key, active === flatId, size)}
              onChange={(e) => onChangeSeg(flatId, key, e.target.value)}
              onKeyDown={(e) => onKeyDownSeg(flatId, key, e)}
              onFocus={() => onFocusSeg(flatId)}
              onBlur={onBlurSeg}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
