import { cn } from "@almach/utils";
import { Check } from "lucide-react";
import * as React from "react";
import { Checkbox as CheckboxPrimitive } from "react-aria-components";

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
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-sm border border-input bg-background",
        "cursor-pointer select-none transition-[background-color,border-color,transform] duration-150 ease-out",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "active:scale-[0.98]",
        "data-[selected]:border-primary data-[selected]:bg-primary data-[selected]:text-primary-foreground",
        error && "aria-[invalid=true]:border-destructive",
        className,
      )}
      {...(error ? { "aria-invalid": true as const } : {})}
      {...props}
    >
      {({ isSelected }) => (
        <>
          <span
            className={cn(
              "flex items-center justify-center text-current",
              !isSelected && "hidden",
            )}
          >
            <Check className="h-3 w-3" strokeWidth={2.5} />
          </span>
          {children}
        </>
      )}
    </CheckboxPrimitive>
  ),
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
