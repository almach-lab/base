"use client";

import { cn } from "@almach/utils";
import type { VariantProps } from "class-variance-authority";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  FOCUS_RING,
  FOCUS_RING_WITHIN_INVALID,
  fieldErrorClass,
  inputVariants,
} from "./_styles.js";
import { Calendar } from "./calendar.js";
import { InputCurrency } from "./currency-input.js";
import { InputDateRange } from "./input-date-range.js";
import {
  applySegmentDigits,
  createFocusController,
  createGroupClickFocusNearest,
  dateToSegments,
  makeFlatId,
  parseFormat,
  SegmentGroup,
  segmentsToDate,
  stepSegmentValue,
} from "./input-date-shared.js";
import { Popover } from "./popover.js";

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: boolean;
}

// Written as static literals (not built via string concat/replace) so Tailwind's
// content scanner can actually find "right-2.5"/"right-3"/"right-4" and generate
// the CSS for them — a runtime .replace("left", "right") produces a class name
// Tailwind never sees in source, so the utility never gets compiled.
const inputSideOffset: Record<
  "sm" | "default" | "lg",
  { left: string; right: string }
> = {
  sm: { left: "left-2.5", right: "right-2.5" },
  default: { left: "left-3", right: "right-3" },
  lg: { left: "left-4", right: "right-4" },
};

const inputPadding: Record<
  "sm" | "default" | "lg",
  {
    withLeft: string;
    withoutLeft: string;
    withRight: string;
    withoutRight: string;
  }
> = {
  sm: {
    withLeft: "pl-8",
    withoutLeft: "pl-2.5",
    withRight: "pr-8",
    withoutRight: "pr-2.5",
  },
  default: {
    withLeft: "pl-9",
    withoutLeft: "pl-3",
    withRight: "pr-9",
    withoutRight: "pr-3",
  },
  lg: {
    withLeft: "pl-11",
    withoutLeft: "pl-4",
    withRight: "pr-11",
    withoutRight: "pr-4",
  },
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      size = "default",
      leftElement,
      rightElement,
      error,
      ...props
    },
    ref,
  ) => {
    const activeSize = (size ?? "default") as "sm" | "default" | "lg";
    const pad = inputPadding[activeSize];
    const sideOffset = inputSideOffset[activeSize];
    return (
      <div className="relative flex items-center w-full">
        {leftElement && (
          <div
            className={cn(
              "pointer-events-none absolute flex items-center text-muted-foreground [&_svg]:size-4",
              sideOffset.left,
            )}
          >
            {leftElement}
          </div>
        )}
        <input
          type={type}
          className={cn(
            inputVariants({ size }),
            leftElement ? pad.withLeft : pad.withoutLeft,
            rightElement ? pad.withRight : pad.withoutRight,
            error && fieldErrorClass(true),
            className,
          )}
          ref={ref}
          aria-invalid={error || undefined}
          {...props}
        />
        {rightElement && (
          <div
            className={cn(
              "absolute flex items-center text-muted-foreground [&_svg]:size-4",
              sideOffset.right,
            )}
          >
            {rightElement}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

/* ── Date Input ───────────────────────────────────────────────────────────── */
export interface InputDateProps {
  id?: string;
  value?: Date | undefined;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  error?: boolean;
  /** Show calendar picker button inside the input */
  withCalendar?: boolean;
  size?: FieldSize;
  /**
   * Date format controlling segment order and separator.
   * Tokens: MM (month), DD (day), YYYY (year).
   * @example "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY"
   * @default "MM/DD/YYYY"
   */
  format?: string;
  className?: string;
}

const InputDate = React.forwardRef<HTMLDivElement, InputDateProps>(
  function InputDate(
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
      () => order.map((key) => makeFlatId("", key)),
      [order],
    );

    const [seg, setSeg] = React.useState(() =>
      value && !Number.isNaN(value.getTime())
        ? dateToSegments(value)
        : { month: "", day: "", year: "" },
    );
    const [active, setActive] = React.useState<string | null>(null);
    const [calOpen, setCalOpen] = React.useState(false);
    const prevFormatRef = React.useRef(format);
    // See input-date-range.tsx's matching flags: emit()'s own onChange echoes
    // back through `value` (even a plain useState consumer stores it verbatim),
    // and without this the sync effect below would re-derive segments from
    // that echo and could stomp on a keystroke that landed between the emit
    // and the resulting re-render.
    const skipSyncRef = React.useRef(false);

    const refs = {
      month: React.useRef<HTMLInputElement>(null),
      day: React.useRef<HTMLInputElement>(null),
      year: React.useRef<HTMLInputElement>(null),
    };
    const { focus, focusNext, focusPrev } = createFocusController(
      flatIds,
      refs,
    );

    React.useEffect(() => {
      if (skipSyncRef.current) {
        skipSyncRef.current = false;
        return;
      }
      if (!value) {
        setSeg({ month: "", day: "", year: "" });
        return;
      }
      if (Number.isNaN(value.getTime())) return;
      const next = dateToSegments(value);
      setSeg((prev) =>
        prev.month === next.month &&
        prev.day === next.day &&
        prev.year === next.year
          ? prev
          : next,
      );
    }, [value]);

    const emit = (next: Record<"month" | "day" | "year", string>) => {
      skipSyncRef.current = true;
      onChange?.(segmentsToDate(next));
    };

    // Only move focus on an actual format change while this field is active.
    // This avoids offscreen docs thumbnails stealing focus and causing scroll jumps.
    React.useEffect(() => {
      if (prevFormatRef.current === format) return;
      prevFormatRef.current = format;
      if (!active || disabled) return;
      const target = flatIds.includes(active) ? active : flatIds[0];
      if (target) focus(target);
    }, [active, disabled, format, flatIds, focus]);

    const handleKeyDown = (
      flatId: string,
      key: "month" | "day" | "year",
      e: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const nextSeg = stepSegmentValue(
          seg,
          key,
          e.key === "ArrowUp" ? 1 : -1,
        );
        setSeg(nextSeg);
        emit(nextSeg);
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
      key: "month" | "day" | "year",
      raw: string,
      insertedData?: string | null,
    ) => {
      const { seg: nextSeg, advance } = applySegmentDigits(
        seg,
        key,
        raw,
        insertedData,
      );
      setSeg(nextSeg);
      emit(nextSeg);
      if (advance) focusNext(flatId);
    };

    const handleCalendarSelect = (date: Date | undefined) => {
      if (date) {
        setSeg(dateToSegments(date));
        onChange?.(date);
      }
      setCalOpen(false);
    };

    const calValue = segmentsToDate(seg);

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-label="Date input"
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
        onClick={createGroupClickFocusNearest(active, flatIds, refs, focus)}
      >
        <SegmentGroup
          order={order}
          sep={sep}
          seg={seg}
          active={active}
          disabled={disabled}
          size={size}
          getRef={(flatId) => refs[flatId as "month" | "day" | "year"]}
          onChangeSeg={handleChange}
          onKeyDownSeg={handleKeyDown}
          onFocusSeg={(flatId) => setActive(flatId)}
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
                mode="single"
                {...(calValue ? { selected: calValue } : {})}
                onSelect={(value) => {
                  handleCalendarSelect(
                    value instanceof Date ? value : undefined,
                  );
                }}
                defaultMonth={calValue ?? new Date()}
                initialFocus
              />
            </Popover.Content>
          </Popover>
        )}
      </div>
    );
  },
);
InputDate.displayName = "Input.Date";

/* ── Compound export ──────────────────────────────────────────────────────── */
const InputCompound = Object.assign(Input, {
  Date: InputDate,
  Currency: InputCurrency,
  DateRange: InputDateRange,
});

export { InputCompound as Input, inputVariants };

// Backward-compat alias
export const DateInput = InputDate;
export type { InputDateProps as DateInputProps };
