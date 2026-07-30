import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ProgressBar } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";

const progressVariants = cva("relative w-full overflow-hidden rounded-full", {
  variants: {
    size: {
      sm: "h-1",
      default: "h-1.5",
      md: "h-2",
      lg: "h-3",
    },
    variant: {
      default: "[&_.progress-fill]:bg-foreground",
      success: "[&_.progress-fill]:bg-success",
      warning: "[&_.progress-fill]:bg-warning",
      destructive: "[&_.progress-fill]:bg-destructive",
    },
  },
  defaultVariants: {
    size: "default",
    variant: "default",
  },
});

export interface ProgressProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof ProgressBar>, "value">,
    VariantProps<typeof progressVariants> {
  value?: number | undefined;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, size, variant, ...props }, ref) => (
    <ProgressBar
      ref={ref}
      value={value ?? 0}
      className={cn(progressVariants({ size, variant }), className)}
      {...props}
    >
      {({ percentage }) => (
        <>
          <div className="h-full w-full rounded-full bg-secondary" />
          <div
            className={cn(
              "progress-fill absolute inset-y-0 left-0 rounded-full",
              MOTION_INTERACTIVE,
            )}
            style={{ width: `${percentage}%` }}
          />
        </>
      )}
    </ProgressBar>
  ),
);
Progress.displayName = "Progress";

export { Progress, progressVariants };
