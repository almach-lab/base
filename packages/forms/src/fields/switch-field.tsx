"use client";

import { Switch } from "@almach/ui";
import { cn } from "@almach/utils";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";
import { useFieldContext } from "../form-context.js";

export interface SwitchFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function SwitchField({
  label,
  description,
  required,
  disabled,
  className,
}: SwitchFieldProps) {
  const field = useFieldContext<boolean>();

  return (
    <FormItem
      className={cn(
        "flex flex-row items-center justify-between rounded-lg border p-4",
        className,
      )}
    >
      <div className="space-y-0.5">
        {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
        {description && <FormDescription>{description}</FormDescription>}
      </div>
      <FormControl>
        <Switch
          isSelected={field.state.value ?? false}
          onChange={field.handleChange}
          onBlur={field.handleBlur}
          isDisabled={disabled ?? false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
