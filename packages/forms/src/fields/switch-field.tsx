"use client";

import { Switch } from "@almach/ui";
import { cn } from "@almach/utils";
import { useFieldContext } from "../form-context.js";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";

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
          checked={field.state.value ?? false}
          onCheckedChange={field.handleChange}
          onBlur={field.handleBlur}
          disabled={disabled ?? false}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
