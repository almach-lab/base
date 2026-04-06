"use client";

import { Textarea, type TextareaProps } from "@almach/ui";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";
import { useFieldContext } from "../form-context.js";

export interface TextareaFieldProps
  extends Omit<TextareaProps, "name" | "value" | "onChange" | "onBlur"> {
  label?: string;
  description?: string;
  required?: boolean;
}

export function TextareaField({
  label,
  description,
  required,
  ...props
}: TextareaFieldProps) {
  const field = useFieldContext<string>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormItem>
      {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
      <FormControl>
        <Textarea
          {...props}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          error={hasError}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
