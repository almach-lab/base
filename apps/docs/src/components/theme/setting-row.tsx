import { Popover } from "@almach/ui";
import { cn } from "@almach/utils";
import { Check } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

/**
 * Compact settings rail, in the shape of a control panel rather than a form:
 * each row states what it controls and what it is currently set to, and opens
 * its choices in a popover. Rows are grouped, so related settings read as a
 * block without needing a heading each.
 */

export function SettingGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col divide-y divide-border/60", className)}
      {...props}
    />
  );
}

interface SettingRowProps {
  label: string;
  /** The current setting, shown as the row's primary text. */
  value: React.ReactNode;
  /** Trailing affordance — a swatch, a glyph, a small preview. */
  affordance?: React.ReactNode;
  /** Popover width. */
  width?: string;
  /** Receives `close` so a choice can dismiss the popover. */
  children: (close: () => void) => React.ReactNode;
}

export function SettingRow({
  label,
  value,
  affordance,
  width = "w-64",
  children,
}: SettingRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          className={cn(
            "flex w-full cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-left",
            "transition-colors hover:bg-accent/40",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
            open && "bg-accent/40",
          )}
        >
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[11px] leading-none text-muted-foreground">
              {label}
            </span>
            <span className="truncate text-sm font-medium leading-tight">
              {value}
            </span>
          </span>
          {affordance && <span className="shrink-0">{affordance}</span>}
        </button>
      </Popover.Trigger>

      <Popover.Content align="end" sideOffset={6} className={cn(width, "p-2")}>
        {children(() => setOpen(false))}
      </Popover.Content>
    </Popover>
  );
}

interface ChoiceListProps<T extends string> {
  options: Array<{ id: T; label: string; hint?: string; swatch?: string }>;
  selected: T | null;
  onSelect: (id: T) => void;
  /** Scroll after this many rows rather than growing the popover. */
  maxVisible?: number;
}

/** Single-select list for a row's popover. */
export function ChoiceList<T extends string>({
  options,
  selected,
  onSelect,
  maxVisible = 8,
}: ChoiceListProps<T>) {
  const scrolls = options.length > maxVisible;

  return (
    <div
      role="listbox"
      aria-label="Options"
      className={cn(
        "flex flex-col gap-0.5",
        scrolls && "max-h-64 overflow-y-auto",
      )}
    >
      {options.map((option) => {
        const isSelected = option.id === selected;

        return (
          <button
            key={option.id}
            type="button"
            role="option"
            aria-selected={isSelected}
            onClick={() => onSelect(option.id)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-left",
              "transition-colors hover:bg-accent focus-visible:outline-none focus-visible:bg-accent",
            )}
          >
            {option.swatch && (
              <span
                aria-hidden="true"
                className="size-3.5 shrink-0 rounded-full border border-border"
                style={{ background: option.swatch }}
              />
            )}
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm">{option.label}</span>
              {option.hint && (
                <span className="truncate text-[11px] text-muted-foreground">
                  {option.hint}
                </span>
              )}
            </span>
            {isSelected && (
              <Check
                aria-hidden="true"
                className="size-3.5 shrink-0 text-primary"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Section label inside a popover, for panels with more than one control. */
export function PopoverLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-1 pb-1.5 text-[11px] font-medium text-muted-foreground">
      {children}
    </p>
  );
}
