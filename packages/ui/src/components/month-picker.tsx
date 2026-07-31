"use client";

import { cn } from "@almach/utils";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING, MENU_ITEM } from "./_styles.js";
import { Button } from "./button.js";
import { Popover } from "./popover.js";

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

const pickerTriggerClasses = cn(
  "flex h-9 min-w-0 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-2.5 text-sm text-foreground shadow-xs",
  MOTION_INTERACTIVE,
  FOCUS_RING,
  DISABLED_DATA,
  "hover:bg-muted/40",
  "data-[popup-open=true]:bg-muted/40",
);

interface PickerOption {
  value: string;
  label: React.ReactNode;
  disabled?: boolean;
}

function PickerButton({
  ariaLabel,
  value,
  options,
  onSelect,
  disabled,
  triggerClassName,
}: {
  ariaLabel: string;
  value: string;
  options: PickerOption[];
  onSelect: (value: string) => void;
  disabled?: boolean;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          data-popup-open={open ? "true" : undefined}
          className={cn(pickerTriggerClasses, triggerClassName)}
        >
          <span className="min-w-0 flex-1 truncate text-left">
            {selected?.label}
          </span>
          <ChevronDown
            className={cn(
              "h-4 w-4 shrink-0 opacity-50",
              MOTION_INTERACTIVE,
              open && "rotate-180",
            )}
            aria-hidden="true"
          />
        </button>
      </Popover.Trigger>

      <Popover.Content
        align="start"
        sideOffset={6}
        className="max-h-64 min-w-32 overflow-y-auto overscroll-contain p-1"
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={isSelected}
              disabled={opt.disabled}
              className={cn(
                MENU_ITEM,
                "w-full justify-between",
                isSelected && "bg-accent/60",
              )}
              onClick={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && (
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </Popover.Content>
    </Popover>
  );
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

    const monthOptions = React.useMemo(
      () =>
        monthNames.map((name, i) => {
          const candidate = new Date(year, i, 1);
          return {
            value: String(i),
            label: name,
            disabled:
              (!!minMonth && candidate < minMonth) ||
              (!!maxMonth && candidate > maxMonth),
          };
        }),
      [monthNames, year, minMonth, maxMonth],
    );

    const yearOptions = React.useMemo(
      () => years.map((y) => ({ value: String(y), label: y })),
      [years],
    );

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
          <PickerButton
            ariaLabel="Month"
            value={String(month)}
            options={monthOptions}
            onSelect={(next) => commit(new Date(year, Number(next), 1))}
            disabled={!!disabled}
            triggerClassName="flex-1 basis-0"
          />

          <PickerButton
            ariaLabel="Year"
            value={String(year)}
            options={yearOptions}
            onSelect={(next) => commit(new Date(Number(next), month, 1))}
            disabled={!!disabled}
            triggerClassName="shrink-0 basis-[5.5rem]"
          />
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
