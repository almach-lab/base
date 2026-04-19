import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { Switch as SwitchPrimitive } from "react-aria-components";

const switchTrack = cva(
  [
    "relative inline-flex shrink-0 cursor-pointer items-center rounded-full border border-transparent",
    "bg-muted text-foreground shadow-inner transition-[background-color,box-shadow,opacity] duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
    "disabled:cursor-not-allowed disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-[22px] w-[38px]",
        default: "h-[28px] w-[48px]",
        lg: "h-[34px] w-[60px]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const switchThumb = cva(
  [
    "pointer-events-none block rounded-full bg-background shadow-sm ring-1 ring-border/80",
    "transition-transform duration-150 ease-out",
  ],
  {
    variants: {
      size: {
        sm: "h-[16px] w-[16px]",
        default: "h-[22px] w-[22px]",
        lg: "h-[28px] w-[28px]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type SwitchPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive
>;

export interface SwitchProps
  extends SwitchPrimitiveProps,
    VariantProps<typeof switchTrack> {}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  ({ className, size, ...props }, ref) => (
    <SwitchPrimitive
      ref={ref}
      className={cn(switchTrack({ size }), className)}
      {...props}
    >
      {({ isSelected }) => (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "absolute inset-0 rounded-full transition-colors duration-150 ease-out",
              isSelected ? "bg-primary" : "bg-muted",
            )}
          />
          <span
            className={cn(
              "relative z-10",
              relativeThumbClass(size),
              isSelected ? selectedTranslate(size) : "translate-x-0",
            )}
          />
        </>
      )}
    </SwitchPrimitive>
  ),
);

function relativeThumbClass(size: VariantProps<typeof switchTrack>["size"]) {
  return cn("relative", switchThumb({ size }));
}

function selectedTranslate(size: VariantProps<typeof switchTrack>["size"]) {
  if (size === "sm") return "translate-x-[18px]";
  if (size === "lg") return "translate-x-[28px]";
  return "translate-x-[22px]";
}

Switch.displayName = "Switch";

export { Switch };
