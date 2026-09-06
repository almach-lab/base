import { cn } from "@almach/utils";
import * as React from "react";
import {
  DateInput,
  DateSegment,
  Label,
  Text,
  TimeField as AriaTimeField,
  type TimeValue,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  CONTROL_DESCRIPTION,
  CONTROL_LABEL,
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  fieldErrorClass,
} from "./_styles.js";

type AriaTimeFieldProps = React.ComponentPropsWithoutRef<
  typeof AriaTimeField<TimeValue>
>;

export interface TimeFieldProps extends Omit<
  AriaTimeFieldProps,
  "className" | "children"
> {
  className?: string;
  /** Visible field label. */
  label?: React.ReactNode;
  /** Helper text under the field. */
  description?: React.ReactNode;
  /** Error message under the field. Implies `error`. */
  errorMessage?: React.ReactNode;
  /** Mark the field invalid. */
  error?: boolean;
  size?: FieldSize;
}

const TimeFieldComponent = React.forwardRef<HTMLDivElement, TimeFieldProps>(
  (
    {
      className,
      label,
      description,
      errorMessage,
      error,
      size = "default",
      ...props
    },
    ref,
  ) => {
    const isInvalid = error ?? Boolean(errorMessage);
    const scale = FIELD_SIZE[size];

    return (
      <AriaTimeField
        ref={ref}
        className={cn("flex w-full flex-col gap-1.5", className)}
        isInvalid={isInvalid}
        {...props}
      >
        {label && <Label className={CONTROL_LABEL}>{label}</Label>}

        <DateInput
          className={cn(
            FIELD_GROUP,
            scale.height,
            scale.padding,
            scale.text,
            "gap-px tabular-nums",
            fieldErrorClass(isInvalid),
          )}
        >
          {(segment) => (
            <DateSegment
              segment={segment}
              className={cn(
                "rounded-sm px-0.5 text-center outline-none",
                MOTION_INTERACTIVE,
                "data-[placeholder]:text-muted-foreground",
                "data-[focused]:bg-primary data-[focused]:text-primary-foreground",
                "data-[disabled]:text-muted-foreground",
                "type-literal:px-0 type-literal:text-muted-foreground",
              )}
            />
          )}
        </DateInput>

        {description && !errorMessage && (
          <Text slot="description" className={CONTROL_DESCRIPTION}>
            {description}
          </Text>
        )}
        {errorMessage && (
          <Text
            slot="errorMessage"
            className="text-xs leading-relaxed text-destructive"
          >
            {errorMessage}
          </Text>
        )}
      </AriaTimeField>
    );
  },
);
TimeFieldComponent.displayName = "TimeField";

export { TimeFieldComponent as TimeField };
