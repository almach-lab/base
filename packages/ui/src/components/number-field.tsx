import { cn } from "@almach/utils";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import {
  Button,
  Group,
  Input,
  Label,
  NumberField as AriaNumberField,
  Text,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  CONTROL_DESCRIPTION,
  CONTROL_LABEL,
  DISABLED_DATA,
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  fieldErrorClass,
} from "./_styles.js";

type AriaNumberFieldProps = React.ComponentPropsWithoutRef<
  typeof AriaNumberField
>;

export interface NumberFieldProps extends Omit<
  AriaNumberFieldProps,
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
  /** Hide the increment/decrement buttons. */
  hideStepper?: boolean;
}

const stepperClasses = cn(
  "flex w-8 shrink-0 cursor-pointer items-center justify-center self-stretch text-muted-foreground",
  MOTION_INTERACTIVE,
  DISABLED_DATA,
  "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
  "data-[pressed]:bg-accent",
  "focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground",
  "[&_svg]:size-3.5",
);

const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  (
    {
      className,
      label,
      description,
      errorMessage,
      error,
      size = "default",
      hideStepper = false,
      ...props
    },
    ref,
  ) => {
    const isInvalid = error ?? Boolean(errorMessage);
    const scale = FIELD_SIZE[size];

    return (
      <AriaNumberField
        ref={ref}
        className={cn("flex w-full flex-col gap-1.5", className)}
        isInvalid={isInvalid}
        {...props}
      >
        {label && <Label className={CONTROL_LABEL}>{label}</Label>}

        <Group
          className={cn(
            FIELD_GROUP,
            scale.height,
            scale.text,
            fieldErrorClass(isInvalid),
          )}
        >
          {!hideStepper && (
            <Button
              slot="decrement"
              className={cn(stepperClasses, "border-r border-input")}
            >
              <Minus aria-hidden="true" />
            </Button>
          )}

          <Input
            className={cn(
              "min-w-0 flex-1 bg-transparent text-center tabular-nums outline-none",
              scale.padding,
              "placeholder:text-muted-foreground",
              "disabled:cursor-not-allowed",
            )}
          />

          {!hideStepper && (
            <Button
              slot="increment"
              className={cn(stepperClasses, "border-l border-input")}
            >
              <Plus aria-hidden="true" />
            </Button>
          )}
        </Group>

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
      </AriaNumberField>
    );
  },
);
NumberField.displayName = "NumberField";

export { NumberField };
