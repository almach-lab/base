"use client";

import { cn } from "@almach/utils";
import {
  CalendarDate,
  getLocalTimeZone,
  type DateValue,
} from "@internationalized/date";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as AriaRangeCalendar,
  Text,
  useLocale,
} from "react-aria-components";

type CalendarMode = "single" | "multiple" | "range";

type Matcher =
  | Date
  | Date[]
  | { before?: Date; after?: Date }
  | ((date: Date) => boolean);

export interface DateRange {
  from?: Date;
  to?: Date;
}

export interface CalendarProps {
  mode?: CalendarMode;
  selected?: Date | Date[] | DateRange;
  onSelect?: (value: Date | Date[] | DateRange | undefined) => void;
  className?: string;
  numberOfMonths?: number;
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  showOutsideDays?: boolean;
  disabled?: Matcher | Matcher[];
  initialFocus?: boolean;
  errorMessage?: string;
}

function toDateValue(date?: Date) {
  if (!date || Number.isNaN(date.getTime())) return undefined;
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
  );
}

function toJsDate(value: DateValue | null | undefined) {
  if (!value) return undefined;
  return value.toDate(getLocalTimeZone());
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function normalizeMatchers(disabled?: Matcher | Matcher[]) {
  if (!disabled) return [] as Matcher[];
  return Array.isArray(disabled) ? disabled : [disabled];
}

function isUnavailableByMatcher(date: Date, matcher: Matcher) {
  if (typeof matcher === "function") return matcher(date);
  if (matcher instanceof Date) return isSameDay(date, matcher);
  if (Array.isArray(matcher))
    return matcher.some((item) => isSameDay(date, item));

  if (matcher.before && date < matcher.before) return true;
  if (matcher.after && date > matcher.after) return true;
  return false;
}

function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <header className="flex items-center gap-1 pb-3 px-1">
      <Button
        slot="previous"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground",
          "transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        {direction === "rtl" ? (
          <ChevronRight aria-hidden className="h-4 w-4" />
        ) : (
          <ChevronLeft aria-hidden className="h-4 w-4" />
        )}
      </Button>

      <Heading className="mx-2 flex-1 text-center text-sm font-semibold text-foreground" />

      <Button
        slot="next"
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground",
          "transition-colors duration-150 hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-40",
        )}
      >
        {direction === "rtl" ? (
          <ChevronLeft aria-hidden className="h-4 w-4" />
        ) : (
          <ChevronRight aria-hidden className="h-4 w-4" />
        )}
      </Button>
    </header>
  );
}

function createCellClassName(
  mode: CalendarMode,
  selectedDates: Date[],
  selectedRange?: DateRange,
) {
  const rangeFrom = selectedRange?.from ? startOfDay(selectedRange.from) : undefined;
  const rangeTo = selectedRange?.to ? startOfDay(selectedRange.to) : undefined;

  return (renderProps: unknown) => {
    const state = renderProps as {
      date: DateValue;
      isSelected?: boolean;
      isDisabled?: boolean;
      isOutsideMonth?: boolean;
      isUnavailable?: boolean;
      isInvalid?: boolean;
      isSelectionStart?: boolean;
      isSelectionEnd?: boolean;
    };

    const date = toJsDate(state.date);
    const isMultiSelected =
      mode === "multiple" &&
      !!date &&
      selectedDates.some((item) => isSameDay(item, date));

    const isRangeSelected =
      mode === "range" &&
      !!date &&
      !state.isOutsideMonth &&
      !!rangeFrom &&
      !!rangeTo &&
      startOfDay(date) >= rangeFrom &&
      startOfDay(date) <= rangeTo;

    const dayOfWeek = date?.getDay();
    const isWeekStart = dayOfWeek === 0;
    const isWeekEnd = dayOfWeek === 6;

    const isRangeStart = mode === "range" && !!state.isSelectionStart;
    const isRangeEnd = mode === "range" && !!state.isSelectionEnd;
    const isSingleDayRange = isRangeStart && isRangeEnd;
    const isRangeMiddle =
      mode === "range" && isRangeSelected && !isRangeStart && !isRangeEnd;

    const selected =
      mode === "multiple"
        ? isMultiSelected
        : mode === "range"
          ? isRangeSelected
          : !!state.isSelected;

    return cn(
      "relative mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium outline-none",
      "transition-colors duration-150 will-change-transform",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
      state.isOutsideMonth && "text-muted-foreground opacity-50",
      (state.isDisabled || state.isUnavailable) &&
        "text-muted-foreground opacity-50",
      !selected && "hover:bg-accent hover:text-accent-foreground",
      state.isInvalid && "text-destructive",

      mode !== "range" &&
        selected &&
        "bg-foreground text-background hover:bg-foreground/90",

      isRangeMiddle &&
        "rounded-none bg-primary/25 text-primary-foreground/95 hover:bg-primary/30",
      isRangeMiddle && isWeekStart && "rounded-l-full",
      isRangeMiddle && isWeekEnd && "rounded-r-full",

      (isRangeStart || isRangeEnd) &&
        "z-10 rounded-full bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",

      isRangeStart &&
        !isSingleDayRange &&
        "after:pointer-events-none after:absolute after:right-0 after:top-1/2 after:h-9 after:w-1/2 after:-translate-y-1/2 after:bg-primary/25",

      isRangeEnd &&
        !isSingleDayRange &&
        "before:pointer-events-none before:absolute before:left-0 before:top-1/2 before:h-9 before:w-1/2 before:-translate-y-1/2 before:bg-primary/25",

      isSingleDayRange && "rounded-full",
    );
  };
}

function CalendarGridView({
  months,
  mode,
  selectedDates,
  selectedRange,
}: {
  months: number;
  mode: CalendarMode;
  selectedDates: Date[];
  selectedRange?: DateRange;
}) {
  const className = createCellClassName(mode, selectedDates, selectedRange);

  return (
    <div className={cn("flex gap-4", months > 1 && "flex-col sm:flex-row")}>
      {Array.from({ length: months }).map((_, index) => (
        <CalendarGrid
          key={index}
          {...(index > 0 ? { offset: { months: index } } : {})}
          className="w-full border-collapse"
        >
          <CalendarGridHeader>
            {(day) => (
              <CalendarHeaderCell className="h-9 w-9 text-center text-[0.8rem] font-normal text-muted-foreground">
                {day}
              </CalendarHeaderCell>
            )}
          </CalendarGridHeader>
          <CalendarGridBody>
            {(date) => <CalendarCell date={date} className={className} />}
          </CalendarGridBody>
        </CalendarGrid>
      ))}
    </div>
  );
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  className,
  numberOfMonths = 1,
  defaultMonth,
  month,
  onMonthChange,
  disabled,
  initialFocus,
  errorMessage,
}: CalendarProps) {
  const [internalMulti, setInternalMulti] = React.useState<Date[]>([]);

  const selectedDates = React.useMemo(() => {
    if (mode !== "multiple") return [] as Date[];
    if (Array.isArray(selected)) return selected;
    return internalMulti;
  }, [internalMulti, mode, selected]);

  const selectedDate =
    mode === "single" && selected instanceof Date ? selected : undefined;

  const selectedRange =
    mode === "range" &&
    selected &&
    !Array.isArray(selected) &&
    !(selected instanceof Date)
      ? (selected as DateRange)
      : undefined;

  const matchers = React.useMemo(() => normalizeMatchers(disabled), [disabled]);

  const minValue = React.useMemo(() => {
    const lower = matchers.find(
      (matcher) =>
        typeof matcher === "object" &&
        !Array.isArray(matcher) &&
        !(matcher instanceof Date) &&
        !!matcher.before,
    ) as { before?: Date } | undefined;
    return toDateValue(lower?.before);
  }, [matchers]);

  const maxValue = React.useMemo(() => {
    const upper = matchers.find(
      (matcher) =>
        typeof matcher === "object" &&
        !Array.isArray(matcher) &&
        !(matcher instanceof Date) &&
        !!matcher.after,
    ) as { after?: Date } | undefined;
    return toDateValue(upper?.after);
  }, [matchers]);

  const isDateUnavailable = React.useCallback(
    (dateValue: DateValue) => {
      const date = toJsDate(dateValue);
      if (!date) return false;
      return matchers.some((matcher) => isUnavailableByMatcher(date, matcher));
    },
    [matchers],
  );

  const defaultFocusedValue = defaultMonth
    ? toDateValue(defaultMonth)
    : undefined;
  const focusedValue = month ? toDateValue(month) : undefined;

  const selectedDateValue = selectedDate
    ? toDateValue(selectedDate)
    : undefined;

  const rangeStart = selectedRange?.from
    ? toDateValue(selectedRange.from)
    : undefined;
  const rangeEnd = selectedRange?.to
    ? toDateValue(selectedRange.to)
    : undefined;
  const rangeValue =
    rangeStart && rangeEnd ? { start: rangeStart, end: rangeEnd } : undefined;

  const commonProps = {
    visibleDuration: { months: Math.max(1, numberOfMonths) },
    className: cn("w-fit max-w-full overflow-hidden p-3", className),
    ...(defaultFocusedValue ? { defaultFocusedValue } : {}),
    ...(focusedValue ? { focusedValue } : {}),
    ...(onMonthChange
      ? {
          onFocusChange: (next: DateValue) => {
            const js = toJsDate(next);
            if (js) onMonthChange(new Date(js.getFullYear(), js.getMonth(), 1));
          },
        }
      : {}),
    ...(minValue ? { minValue } : {}),
    ...(maxValue ? { maxValue } : {}),
    ...(matchers.length > 0 ? { isDateUnavailable } : {}),
    ...(initialFocus ? { autoFocus: true } : {}),
  };

  if (mode === "range") {
    return (
      <AriaRangeCalendar
        {...commonProps}
        {...(rangeValue ? { value: rangeValue } : {})}
        onChange={(next) => {
          const from = toJsDate(next?.start);
          const to = toJsDate(next?.end);
          if (!from && !to) {
            onSelect?.(undefined);
            return;
          }

          onSelect?.({
            ...(from ? { from } : {}),
            ...(to ? { to } : {}),
          });
        }}
      >
        <CalendarHeader />
        <CalendarGridView
          months={numberOfMonths}
          mode={mode}
          selectedDates={[]}
          {...(selectedRange ? { selectedRange } : {})}
        />
        {errorMessage ? (
          <Text slot="errorMessage" className="pt-2 text-sm text-destructive">
            {errorMessage}
          </Text>
        ) : null}
      </AriaRangeCalendar>
    );
  }

  return (
    <AriaCalendar
      {...commonProps}
      {...(selectedDateValue ? { value: selectedDateValue } : {})}
      onChange={(next) => {
        const picked = toJsDate(next);
        if (!picked) {
          onSelect?.(undefined);
          return;
        }

        if (mode === "multiple") {
          const exists = selectedDates.some((d) => isSameDay(d, picked));
          const nextValues = exists
            ? selectedDates.filter((d) => !isSameDay(d, picked))
            : [...selectedDates, picked];
          setInternalMulti(nextValues);
          onSelect?.(nextValues);
          return;
        }

        onSelect?.(picked);
      }}
    >
      <CalendarHeader />
      <CalendarGridView
        months={numberOfMonths}
        mode={mode}
        selectedDates={selectedDates}
      />
      {errorMessage ? (
        <Text slot="errorMessage" className="pt-2 text-sm text-destructive">
          {errorMessage}
        </Text>
      ) : null}
    </AriaCalendar>
  );
}
