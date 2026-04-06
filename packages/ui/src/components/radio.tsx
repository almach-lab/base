import { cn } from "@almach/utils";
import * as React from "react";
import {
  RadioGroup as RadioGroupPrimitive,
  Radio as RadioPrimitive,
} from "react-aria-components";

const RadioGroupRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive>
>(({ className, ...props }, ref) => (
  <RadioGroupPrimitive
    ref={ref}
    className={cn("grid gap-2", className)}
    {...props}
  />
));
RadioGroupRoot.displayName = "Radio.Group";

interface RadioItemProps
  extends React.ComponentPropsWithoutRef<typeof RadioPrimitive> {
  label?: string;
  description?: string;
}

const RadioItem = React.forwardRef<HTMLLabelElement, RadioItemProps>(
  ({ className, label, description, ...props }, ref) => (
    <RadioPrimitive
      ref={ref}
      className={cn(
        "flex cursor-pointer items-start gap-3",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {({ isSelected }) => (
        <>
          <span
            className={cn(
              "mt-0.5 inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-input bg-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
              isSelected && "border-foreground bg-foreground",
            )}
          >
            <span
              className={cn(
                "block h-2 w-2 rounded-full bg-background",
                !isSelected && "opacity-0",
              )}
            />
          </span>
          {(label || description) && (
            <div className="flex flex-col gap-0.5">
              {label ? (
                <span className="text-sm font-medium leading-none">
                  {label}
                </span>
              ) : null}
              {description ? (
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </span>
              ) : null}
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
