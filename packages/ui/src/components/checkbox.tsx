import { cn } from "@almach/utils";
import { Check } from "lucide-react";
import * as React from "react";
import {
  Checkbox as CheckboxPrimitive,
  composeRenderProps,
} from "react-aria-components";

type CheckboxPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive
>;

export interface CheckboxProps
  extends Omit<CheckboxPrimitiveProps, "children"> {
  error?: boolean;
  children?: React.ReactNode;
}

const Checkbox = React.forwardRef<HTMLLabelElement, CheckboxProps>(
  ({ className, error, children, ...props }, ref) => (
    <CheckboxPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          "group flex items-center gap-2.5 cursor-pointer select-none",
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
              "flex size-4 shrink-0 items-center justify-center rounded-sm border border-input bg-background",
              "transition-all duration-150 ease-out",
              isFocusVisible &&
                "ring-2 ring-ring ring-offset-2 ring-offset-background",
              isSelected && "border-primary bg-primary text-primary-foreground",
              isHovered && !isSelected && "border-muted-foreground",
              isPressed && "scale-[0.92]",
              error && !isSelected && "border-destructive",
              error && isFocusVisible && "ring-destructive",
            )}
          >
            <Check
              className={cn(
                "h-3 w-3 transition-transform duration-100",
                isSelected ? "scale-100" : "scale-0",
              )}
              strokeWidth={3}
              aria-hidden="true"
            />
          </div>
          {children && (
            <span className="text-sm font-medium leading-none text-foreground">
              {children}
            </span>
          )}
        </>
      )}
    </CheckboxPrimitive>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
