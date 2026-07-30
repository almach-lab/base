import { cn } from "@almach/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  composeRenderProps,
  Switch as SwitchPrimitive,
} from "react-aria-components";
import {
  CONTROL_LABEL,
  CONTROL_ROOT,
  DISABLED_DATA,
  FOCUS_RING,
  switchThumbVariants,
  switchTrackVariants,
} from "./_styles.js";

type SwitchPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive
>;

export interface SwitchProps
  extends
    Omit<SwitchPrimitiveProps, "children">,
    VariantProps<typeof switchTrackVariants> {
  children?: React.ReactNode;
}

const Switch = React.forwardRef<HTMLLabelElement, SwitchProps>(
  ({ className, size = "default", children, ...props }, ref) => (
    <SwitchPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          CONTROL_ROOT,
          DISABLED_DATA,
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
              switchTrackVariants({ size }),
              isSelected ? "bg-primary" : "bg-muted",
              isHovered && (isSelected ? "bg-primary/90" : "bg-muted/80"),
              isPressed && "scale-[0.96]",
              isFocusVisible && FOCUS_RING,
            )}
          >
            <span
              className={switchThumbVariants({
                size,
                selected: isSelected,
              })}
            />
          </div>
          {children && <span className={CONTROL_LABEL}>{children}</span>}
        </>
      )}
    </SwitchPrimitive>
  ),
);
Switch.displayName = "Switch";

export { Switch, switchTrackVariants };
