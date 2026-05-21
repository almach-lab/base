import { cn } from "@almach/utils";
import * as React from "react";
import {
  composeRenderProps,
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
} from "react-aria-components";

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
  > {
  label?: string;
  description?: string;
  children?: React.ReactNode;
}

const RadioItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(
  ({ className, label, description, children, ...props }, ref) => (
    <RadioPrimitive
      ref={ref}
      className={composeRenderProps(className, (nextClassName, renderProps) =>
        cn(
          "group flex items-start gap-3 cursor-pointer select-none",
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
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input bg-background",
              "transition-all duration-150 ease-out",
              isFocusVisible &&
                "ring-2 ring-ring ring-offset-2 ring-offset-background",
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
                <span className="text-sm font-medium leading-none text-foreground">
                  {label ?? children}
                </span>
              )}
              {description && (
                <span className="text-xs leading-relaxed text-muted-foreground">
                  {description}
                </span>
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
