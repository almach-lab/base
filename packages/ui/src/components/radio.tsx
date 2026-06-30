import { cn } from "@almach/utils";
import * as React from "react";
import {
  composeRenderProps,
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
} from "react-aria-components";
import type { VariantProps } from "class-variance-authority";
import {
  CONTROL_DESCRIPTION,
  CONTROL_LABEL,
  CONTROL_ROOT_START,
  DISABLED_DATA,
  FOCUS_RING,
  radioIndicatorVariants,
} from "./_styles.js";

const RadioGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive
    ref={ref}
    className={cn("grid gap-2.5", className)}
    {...props}
  />
));
RadioGroupRoot.displayName = "Radio.Group";

interface RadioItemProps
  extends Omit<
      React.ComponentPropsWithoutRef<typeof RadioPrimitive>,
      "children"
    >,
    VariantProps<typeof radioIndicatorVariants> {
  label?: string;
  description?: string;
  children?: React.ReactNode;
}

const RadioItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(
  (
    { className, size = "default", label, description, children, ...props },
    ref,
  ) => (
    <RadioPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          CONTROL_ROOT_START,
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
              radioIndicatorVariants({ size }),
              isFocusVisible && FOCUS_RING,
              isSelected && "border-primary bg-primary text-primary-foreground",
              isHovered && !isSelected && "border-muted-foreground",
              isPressed && "scale-[0.92]",
            )}
          >
            <span
              className={cn(
                "block size-1.5 rounded-full bg-background transition-transform duration-100",
                isSelected ? "scale-100" : "scale-0",
              )}
            />
          </div>
          {(label || description || children) && (
            <div className="flex flex-col gap-1">
              {(label || children) && (
                <span className={CONTROL_LABEL}>{label ?? children}</span>
              )}
              {description && (
                <span className={CONTROL_DESCRIPTION}>{description}</span>
              )}
            </div>
          )}
        </>
      )}
    </RadioPrimitive>
  ),
);
RadioItem.displayName = "Radio.Item";

export const Radio = Object.assign(RadioGroupRoot, {
  Item: RadioItem,
});
