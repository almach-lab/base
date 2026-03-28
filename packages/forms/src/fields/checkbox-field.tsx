"use client";

import { Checkbox } from "@almach/ui";
import { cn } from "@almach/utils";
import { useFieldContext } from "../form-context.js";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";

export interface CheckboxFieldProps {
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function CheckboxField({
  label,
  description,
  required,
  disabled,
  className,
}: CheckboxFieldProps) {
  const field = useFieldContext<boolean>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormItem
      className={cn(
        "flex flex-row items-start space-x-3 space-y-0",
        className,
      )}
    >
      <FormControl>
        <Checkbox
          checked={field.state.value ?? false}
          onCheckedChange={(checked) => field.handleChange(Boolean(checked))}
          onBlur={field.handleBlur}
          disabled={disabled ?? false}
          error={hasError}
        />
      </FormControl>
      {(label ?? description) && (
        <div className="space-y-1 leading-none">
          {label && (
            <FormLabel required={required ?? false} className="cursor-pointer">
              {label}
            </FormLabel>
          )}
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </div>
      )}
    </FormItem>
  );
}
