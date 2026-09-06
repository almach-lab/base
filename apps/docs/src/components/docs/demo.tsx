import { cn } from "@almach/utils";
import type * as React from "react";

/**
 * Layout primitives for doc examples.
 *
 * Every example used to hand-pick its own `max-w-*` and `gap-*`, which made
 * previews inconsistent from page to page. These wrappers fix a single width
 * scale and rhythm so demos line up across the whole site.
 */

const WIDTHS = {
  /** Compact controls — a single field, an OTP row. */
  xs: "max-w-[16rem]",
  /** The default for one form control or a short stack. */
  sm: "max-w-sm",
  /** Multi-field forms, cards, drop zones. */
  md: "max-w-md",
  /** Wide previews — tables, panel splits, navigation. */
  lg: "max-w-2xl",
  /** Fill the example frame. */
  full: "w-full",
} as const;

export type DemoWidth = keyof typeof WIDTHS;

interface DemoLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Caps the preview width so demos stay comparable between pages. */
  width?: DemoWidth;
}

/** Vertical stack — the default shape for form-control examples. */
export function DemoStack({
  className,
  width = "sm",
  ...props
}: DemoLayoutProps) {
  return (
    <div
      className={cn("flex w-full flex-col gap-4", WIDTHS[width], className)}
      {...props}
    />
  );
}

/** Horizontal wrapping row — for variant and size galleries. */
export function DemoRow({
  className,
  width = "full",
  ...props
}: DemoLayoutProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        WIDTHS[width],
        className,
      )}
      {...props}
    />
  );
}

/** Two-column grid that collapses on narrow screens. */
export function DemoGrid({
  className,
  width = "md",
  ...props
}: DemoLayoutProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 gap-4 sm:grid-cols-2",
        WIDTHS[width],
        className,
      )}
      {...props}
    />
  );
}

interface DemoFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Short caption above the control, for unlabelled demos. */
  label: React.ReactNode;
}

/** Labels a control that has no label of its own. */
export function DemoField({
  className,
  label,
  children,
  ...props
}: DemoFieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}
