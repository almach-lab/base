"use client";

import { Input, type InputProps } from "@almach/ui";
import { useFieldContext } from "../form-context";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

export interface TextFieldProps
  extends Omit<InputProps, "name" | "value" | "onChange" | "onBlur"> {
  label?: string;
  description?: string;
  required?: boolean;
}

export function TextField({
  label,
  description,
  required,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string>();
  const errors = field.state.meta.errors as string[];
  const hasError = field.state.meta.isTouched && errors.length > 0;

  return (
    <FormItem>
      {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
      <FormControl>
        <Input
          {...inputProps}
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
