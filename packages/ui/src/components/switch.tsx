import { cn } from "@almach/utils";
import * as React from "react";
import {
  composeRenderProps,
  Switch as SwitchPrimitive,
} from "react-aria-components";

type SwitchPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive
>;

export interface SwitchProps extends Omit<SwitchPrimitiveProps, "children"> {
  size?: "sm" | "default" | "lg";
  children?: React.ReactNode;
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  ({ className, size = "default", children, ...props }, ref) => (
    <SwitchPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          "group flex items-center gap-2.5 cursor-pointer select-none",
          renderProps.isDisabled && "cursor-not-allowed opacity-50",
          nextClassName,
        ),
      )}
      {...props}
    >
      {({ isSelected, isHovered, isPressed, isFocusVisible }) => (
        <>
          <div
            className={cn(
              "relative inline-flex shrink-0 items-center rounded-full border border-transparent",
              "transition-all duration-150 ease-out",
              isSelected ? "bg-primary" : "bg-muted",
              isHovered && (isSelected ? "bg-primary/90" : "bg-muted/80"),
              isPressed && "scale-[0.96]",
              isFocusVisible &&
                "ring-2 ring-ring ring-offset-2 ring-offset-background",
              size === "sm" && "h-[22px] w-[38px]",
              size === "default" && "h-[28px] w-[48px]",
              size === "lg" && "h-[34px] w-[60px]",
            )}
          >
            <span
              className={cn(
                "pointer-events-none block rounded-full bg-background shadow-sm ring-1 ring-border/80",
                "transition-transform duration-150 ease-out",
                size === "sm" && "h-[18px] w-[18px]",
                size === "default" && "h-[24px] w-[24px]",
                size === "lg" && "h-[30px] w-[30px]",
                isSelected
                  ? size === "sm"
                    ? "translate-x-[18px]"
                    : size === "lg"
                      ? "translate-x-[28px]"
                      : "translate-x-[22px]"
                  : "translate-x-[2px]",
              )}
            />
          </div>
          {children && (
            <span className="text-sm font-medium leading-none text-foreground">
              {children}
            </span>
          )}
        </>
      )}
    </SwitchPrimitive>
  ),
);
Switch.displayName = "Switch";

export { Switch };
