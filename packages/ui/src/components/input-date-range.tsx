"use client";

import { cn } from "@almach/utils";
import { ArrowRight, CalendarIcon } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  FOCUS_RING,
  FOCUS_RING_WITHIN_INVALID,
  fieldErrorClass,
} from "./_styles.js";
import { Calendar, type DateRange } from "./calendar.js";
import {
  applySegmentDigits,
  createFocusController,
  createGroupClickFocusFirst,
  dateToSegments,
  makeFlatId,
  parseFormat,
  type SegKey,
  SegmentGroup,
  segmentsToDate,
  stepSegmentValue,
} from "./input-date-shared.js";
import { Popover } from "./popover.js";

export interface InputDateRangeProps {
  id?: string;
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  disabled?: boolean;
  error?: boolean;
  /** Show calendar picker button inside the input */
  withCalendar?: boolean;
  size?: FieldSize;
  /**
   * Date format controlling segment order and separator, applied to both the
   * "from" and "to" groups.
   * Tokens: MM (month), DD (day), YYYY (year).
   * @example "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY"
   * @default "MM/DD/YYYY"
   */
  format?: string;
  className?: string;
}

type Group = "from" | "to";

function splitFlatId(flatId: string): { group: Group; key: SegKey } {
  const [group, key] = flatId.split(":") as [Group, SegKey];
  return { group, key };
}

const EMPTY_SEG: Record<SegKey, string> = { month: "", day: "", year: "" };

// refMap is always built from the same flatIds it's looked up with; this
// fallback keeps lookups total (no non-null assertion) without ever being hit.
const NOOP_REF: React.RefObject<HTMLInputElement | null> = { current: null };

export const InputDateRange = React.forwardRef<
  HTMLDivElement,
  InputDateRangeProps
>(function InputDateRange(
  {
    id,
    value,
    onChange,
    disabled,
    error,
    withCalendar = false,
    size = "default",
    format = "MM/DD/YYYY",
    className,
  },
  ref,
) {
  const { order, sep } = React.useMemo(() => parseFormat(format), [format]);
  const flatIds = React.useMemo(
    () => [
      ...order.map((key) => makeFlatId("from", key)),
      ...order.map((key) => makeFlatId("to", key)),
    ],
    [order],
  );

  const [fromSeg, setFromSeg] = React.useState(() =>
    value?.from && !Number.isNaN(value.from.getTime())
      ? dateToSegments(value.from)
      : EMPTY_SEG,
  );
  const [toSeg, setToSeg] = React.useState(() =>
    value?.to && !Number.isNaN(value.to.getTime())
      ? dateToSegments(value.to)
      : EMPTY_SEG,
  );
  const [active, setActive] = React.useState<string | null>(null);
  const [calOpen, setCalOpen] = React.useState(false);
  // emit() can omit a side's key entirely when it's still incomplete (e.g.
  // editing "from" while "to" was already complete), which makes value?.from
  // transition to undefined even though nothing external changed. Without
  // this flag the sync effects below would read that as an external reset
  // and wipe the in-progress segments the user is still typing.
  const skipFromSyncRef = React.useRef(false);
  const skipToSyncRef = React.useRef(false);

  const fromRefs = {
    month: React.useRef<HTMLInputElement>(null),
    day: React.useRef<HTMLInputElement>(null),
    year: React.useRef<HTMLInputElement>(null),
  };
  const toRefs = {
    month: React.useRef<HTMLInputElement>(null),
    day: React.useRef<HTMLInputElement>(null),
    year: React.useRef<HTMLInputElement>(null),
  };
  const refMap: Record<string, React.RefObject<HTMLInputElement | null>> = {
    [makeFlatId("from", "month")]: fromRefs.month,
    [makeFlatId("from", "day")]: fromRefs.day,
    [makeFlatId("from", "year")]: fromRefs.year,
    [makeFlatId("to", "month")]: toRefs.month,
    [makeFlatId("to", "day")]: toRefs.day,
    [makeFlatId("to", "year")]: toRefs.year,
  };
  const { focus, focusNext, focusPrev } = createFocusController(
    flatIds,
    refMap,
  );

  React.useEffect(() => {
    if (skipFromSyncRef.current) {
      skipFromSyncRef.current = false;
      return;
    }
    if (!value?.from) {
      setFromSeg(EMPTY_SEG);
      return;
    }
    if (Number.isNaN(value.from.getTime())) return;
    const next = dateToSegments(value.from);
    setFromSeg((prev) =>
      prev.month === next.month &&
      prev.day === next.day &&
      prev.year === next.year
        ? prev
        : next,
    );
  }, [value?.from]);

  React.useEffect(() => {
    if (skipToSyncRef.current) {
      skipToSyncRef.current = false;
      return;
    }
    if (!value?.to) {
      setToSeg(EMPTY_SEG);
      return;
    }
    if (Number.isNaN(value.to.getTime())) return;
    const next = dateToSegments(value.to);
    setToSeg((prev) =>
      prev.month === next.month &&
      prev.day === next.day &&
      prev.year === next.year
        ? prev
        : next,
    );
  }, [value?.to]);

  const emit = (
    nextFrom: Record<SegKey, string>,
    nextTo: Record<SegKey, string>,
  ) => {
    const from = segmentsToDate(nextFrom);
    const to = segmentsToDate(nextTo);
    const next: DateRange = {};
    if (from) next.from = from;
    if (to) next.to = to;
    skipFromSyncRef.current = true;
    skipToSyncRef.current = true;
    onChange?.(Object.keys(next).length ? next : undefined);
  };

  const handleKeyDown = (
    flatId: string,
    key: SegKey,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const { group } = splitFlatId(flatId);
    const seg = group === "from" ? fromSeg : toSeg;

    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const nextSeg = stepSegmentValue(seg, key, e.key === "ArrowUp" ? 1 : -1);
      if (group === "from") {
        setFromSeg(nextSeg);
        emit(nextSeg, toSeg);
      } else {
        setToSeg(nextSeg);
        emit(fromSeg, nextSeg);
      }
      return;
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      focusPrev(flatId);
    }
    if (e.key === "ArrowRight" || e.key === sep) {
      e.preventDefault();
      focusNext(flatId);
    }
    if (e.key === "Backspace" && !seg[key]) focusPrev(flatId);
  };

  const handleChange = (
    flatId: string,
    key: SegKey,
    raw: string,
    insertedData?: string | null,
  ) => {
    const { group } = splitFlatId(flatId);
    const seg = group === "from" ? fromSeg : toSeg;
    const { seg: nextSeg, advance } = applySegmentDigits(
      seg,
      key,
      raw,
      insertedData,
    );
    if (group === "from") {
      setFromSeg(nextSeg);
      emit(nextSeg, toSeg);
    } else {
      setToSeg(nextSeg);
      emit(fromSeg, nextSeg);
    }
    if (advance) focusNext(flatId);
  };

  const handleCalendarRangeSelect = (range: DateRange | undefined) => {
    if (range?.from) setFromSeg(dateToSegments(range.from));
    if (range?.to) setToSeg(dateToSegments(range.to));
    onChange?.(range);
    // AriaRangeCalendar fires onSelect once per endpoint pick — only close once
    // both ends are chosen, otherwise the user can never pick the end date.
    if (range?.from && range?.to) setCalOpen(false);
  };

  const fromDate = segmentsToDate(fromSeg);

  return (
    <div
      ref={ref}
      id={id}
      role="group"
      aria-label="Date range input"
      aria-invalid={error || undefined}
      className={cn(
        FIELD_GROUP,
        FIELD_SIZE[size].height,
        FIELD_SIZE[size].padding,
        FIELD_SIZE[size].text,
        fieldErrorClass(error),
        error && FOCUS_RING_WITHIN_INVALID,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      onClick={createGroupClickFocusFirst(active, flatIds, focus)}
    >
      <SegmentGroup
        idPrefix="from"
        order={order}
        sep={sep}
        seg={fromSeg}
        active={active}
        disabled={disabled}
        size={size}
        getRef={(flatId) => refMap[flatId] ?? NOOP_REF}
        onChangeSeg={handleChange}
        onKeyDownSeg={handleKeyDown}
        onFocusSeg={setActive}
        onBlurSeg={() => setActive(null)}
      />

      <ArrowRight
        aria-hidden="true"
        className="mx-1.5 h-4 w-4 shrink-0 text-muted-foreground"
      />

      <SegmentGroup
        idPrefix="to"
        order={order}
        sep={sep}
        seg={toSeg}
        active={active}
        disabled={disabled}
        size={size}
        getRef={(flatId) => refMap[flatId] ?? NOOP_REF}
        onChangeSeg={handleChange}
        onKeyDownSeg={handleKeyDown}
        onFocusSeg={setActive}
        onBlurSeg={() => setActive(null)}
      />

      {withCalendar && (
        <Popover open={calOpen} onOpenChange={setCalOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label="Open calendar"
              aria-haspopup="dialog"
              aria-expanded={calOpen}
              className={cn(
                "ml-auto flex items-center justify-center rounded-md p-0.5",
                "text-muted-foreground",
                MOTION_INTERACTIVE,
                "hover:bg-accent hover:text-foreground",
                FOCUS_RING,
                "disabled:pointer-events-none",
              )}
            >
              <CalendarIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </Popover.Trigger>

          <Popover.Content
            align="end"
            sideOffset={6}
            className="z-50 overflow-hidden rounded-xl border bg-popover shadow-xl"
          >
            <Calendar
              mode="range"
              numberOfMonths={2}
              {...(value ? { selected: value } : {})}
              onSelect={(next) => {
                handleCalendarRangeSelect(
                  next && !(next instanceof Date) && !Array.isArray(next)
                    ? next
                    : undefined,
                );
              }}
              defaultMonth={fromDate ?? new Date()}
              initialFocus
            />
          </Popover.Content>
        </Popover>
      )}
    </div>
  );
});
InputDateRange.displayName = "Input.DateRange";
