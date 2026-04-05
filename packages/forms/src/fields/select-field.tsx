"use client";

import {
  Select,
} from "@almach/ui";
import { useFieldContext } from "../form-context.js";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectFieldProps {
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
  required?: boolean;
  disabled?: boolean;
}

export function SelectField({
  label,
  description,
  placeholder = "Select an option",
  options,
  required,
  disabled,
}: SelectFieldProps) {
  const field = useFieldContext<string>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormItem>
      {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
      <FormControl>
        <Select
          value={field.state.value}
          onValueChange={(value) => field.handleChange(value)}
          isDisabled={disabled ?? false}
        >
          <Select.Trigger error={hasError} onBlur={field.handleBlur}>
            <Select.Value placeholder={placeholder} />
          </Select.Trigger>
          <Select.Content>
            {options.map((option) => (
              <Select.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled ?? false}
              >
                {option.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}

