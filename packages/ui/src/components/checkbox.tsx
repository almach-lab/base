import { cn } from "@almach/utils";
import { Check } from "lucide-react";
import * as React from "react";
import {
  Checkbox as CheckboxPrimitive,
  composeRenderProps,
} from "react-aria-components";
import { type VariantProps } from "class-variance-authority";
import {
  CONTROL_LABEL,
  CONTROL_ROOT,
  DISABLED_DATA,
  FOCUS_RING,
  FOCUS_RING_INVALID,
  checkboxVariants,
  fieldErrorClass,
} from "./_styles.js";

type CheckboxPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive
>;

export interface CheckboxProps
  extends Omit<CheckboxPrimitiveProps, "children">,
    VariantProps<typeof checkboxVariants> {
  error?: boolean;
  children?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ className, size = "default", error, children, ...props }, ref) => (
    <CheckboxPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          CONTROL_ROOT,
          DISABLED_DATA,
          renderProps.isDisabled && "cursor-not-allowed opacity-50",
          nextClassName,
        ),
      )}
      {...(error ? { "aria-invalid": true as const } : {})}
      {...props}
    >
      {({ isSelected, isHovered, isPressed, isFocusVisible }) => (
        <>
          <div
            className={cn(
              checkboxVariants({ size }),
              isFocusVisible && (error ? FOCUS_RING_INVALID : FOCUS_RING),
              isSelected && "border-primary bg-primary text-primary-foreground",
              isHovered && !isSelected && "border-muted-foreground",
              isPressed && "scale-[0.92]",
              fieldErrorClass(error && !isSelected),
            )}
          >
            <Check
              className={cn(
                "transition-transform duration-100",
                isSelected ? "scale-100" : "scale-0",
              )}
              strokeWidth={3}
              aria-hidden="true"
            />
          </div>
          {children && <span className={CONTROL_LABEL}>{children}</span>}
        </>
      )}
    </CheckboxPrimitive>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox, checkboxVariants };
