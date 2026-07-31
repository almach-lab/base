"use client";

import { cn } from "@almach/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { Button } from "./button.js";
import { Select } from "./select.js";

export interface MonthPickerProps {
  id?: string;
  /** Controlled month (any date within the target month; day is ignored). */
  value?: Date;
  /** Initial month when uncontrolled. Defaults to the current month. */
  defaultValue?: Date;
  /** Fires with the 1st of the newly selected month. */
  onChange?: (date: Date) => void;
  /** Earliest selectable month (day/time ignored). */
  minDate?: Date;
  /** Latest selectable month (day/time ignored). */
  maxDate?: Date;
  disabled?: boolean;
  /** @default "long" */
  monthFormat?: "long" | "short";
  className?: string;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

export const MonthPicker = React.forwardRef<HTMLDivElement, MonthPickerProps>(
  function MonthPicker(
    {
      id,
      value,
      defaultValue,
      onChange,
      minDate,
      maxDate,
      disabled,
      monthFormat = "long",
      className,
    },
    ref,
  ) {
    const [internal, setInternal] = React.useState<Date>(() =>
      startOfMonth(defaultValue ?? new Date()),
    );
    const current = startOfMonth(value ?? internal);
    const month = current.getMonth();
    const year = current.getFullYear();

    const minMonth = minDate ? startOfMonth(minDate) : undefined;
    const maxMonth = maxDate ? startOfMonth(maxDate) : undefined;

    const isOutOfRange = (candidate: Date) =>
      (!!minMonth && candidate < minMonth) ||
      (!!maxMonth && candidate > maxMonth);

    const commit = (next: Date) => {
      if (isOutOfRange(next)) return;
      if (value === undefined) setInternal(next);
      onChange?.(next);
    };

    const monthNames = React.useMemo(() => {
      const fmt = new Intl.DateTimeFormat(undefined, { month: monthFormat });
      return Array.from({ length: 12 }, (_, i) =>
        fmt.format(new Date(2000, i, 1)),
      );
    }, [monthFormat]);

    const years = React.useMemo(() => {
      const span = 10;
      let lo = year - span;
      let hi = year + span;
      if (minMonth) lo = Math.max(lo, minMonth.getFullYear());
      if (maxMonth) hi = Math.min(hi, maxMonth.getFullYear());
      const out: number[] = [];
      for (let y = Math.min(lo, year); y <= Math.max(hi, year); y++)
        out.push(y);
      return out;
    }, [year, minMonth, maxMonth]);

    const atMin = !!minMonth && current <= minMonth;
    const atMax = !!maxMonth && current >= maxMonth;

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        aria-label="Month picker"
        className={cn("flex w-full items-center gap-1", className)}
      >
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Previous month"
          isDisabled={disabled || atMin}
          onPress={() => commit(addMonths(current, -1))}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="flex min-w-0 flex-1 items-center gap-1">
          <Select
            value={String(month)}
            onValueChange={(next) => commit(new Date(year, Number(next), 1))}
            isDisabled={!!disabled}
          >
            <Select.Trigger
              aria-label="Month"
              className="min-w-0 w-auto flex-1 basis-0"
            >
              <span className="min-w-0 flex-1 truncate text-left">
                {monthNames[month]}
              </span>
            </Select.Trigger>
            <Select.Content>
              {monthNames.map((name, i) => (
                <Select.Item
                  key={name}
                  value={String(i)}
                  disabled={isOutOfRange(new Date(year, i, 1))}
                >
                  {name}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>

          <Select
            value={String(year)}
            onValueChange={(next) => commit(new Date(Number(next), month, 1))}
            isDisabled={!!disabled}
          >
            <Select.Trigger
              aria-label="Year"
              className="min-w-0 w-auto shrink-0 basis-[5.5rem]"
            >
              <span className="min-w-0 flex-1 truncate text-left">{year}</span>
            </Select.Trigger>
            <Select.Content>
              {years.map((y) => (
                <Select.Item key={y} value={String(y)}>
                  {y}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Next month"
          isDisabled={disabled || atMax}
          onPress={() => commit(addMonths(current, 1))}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    );
  },
);
MonthPicker.displayName = "MonthPicker";
