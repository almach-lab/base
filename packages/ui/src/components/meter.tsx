import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Label, Meter as AriaMeter } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { CONTROL_LABEL } from "./_styles.js";

const meterVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1",
      default: "h-1.5",
      lg: "h-2.5",
    },
    variant: {
      default: "[&_.meter-fill]:bg-primary",
      success: "[&_.meter-fill]:bg-success",
      warning: "[&_.meter-fill]:bg-warning",
      destructive: "[&_.meter-fill]:bg-destructive",
    },
  },
  defaultVariants: { size: "default", variant: "default" },
});

type AriaMeterProps = React.ComponentPropsWithoutRef<typeof AriaMeter>;

export interface MeterProps
  extends
    Omit<AriaMeterProps, "className" | "children">,
    VariantProps<typeof meterVariants> {
  className?: string;
  /** Visible label rendered above the bar. */
  label?: React.ReactNode;
  /** Render the formatted value opposite the label. */
  showValue?: boolean;
}

const Meter = React.forwardRef<HTMLDivElement, MeterProps>(
  ({ className, size, variant, label, showValue = true, ...props }, ref) => (
    <AriaMeter
      ref={ref}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {({ percentage, valueText }) => (
        <>
          {(label || showValue) && (
            <div className="flex items-center justify-between gap-3">
              {label ? (
                <Label className={CONTROL_LABEL}>{label}</Label>
              ) : (
                <span aria-hidden="true" />
              )}
              {showValue && (
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {valueText}
                </span>
              )}
            </div>
          )}

          <div className={cn(meterVariants({ size, variant }))}>
            <div className="absolute inset-0 rounded-full bg-secondary" />
            <div
              className={cn(
                "meter-fill absolute inset-y-0 left-0 rounded-full",
                MOTION_INTERACTIVE,
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </>
      )}
    </AriaMeter>
  ),
);
Meter.displayName = "Meter";

export { Meter, meterVariants };
