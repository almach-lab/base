"use client";

import {
  InputCurrency,
  type CurrencyDef,
  type CurrencySelectorMode,
  type CurrencyValue,
  type InputCurrencyProps,
} from "@almach/ui";
import { useFieldContext } from "../form-context";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form";

export interface CurrencyFieldProps
  extends Omit<InputCurrencyProps, "value" | "onChange" | "error"> {
  label?: string;
  description?: string;
  required?: boolean;
}

export function CurrencyField({
  label,
  description,
  required,
  ...inputProps
}: CurrencyFieldProps) {
  const field = useFieldContext<CurrencyValue>();
  const hasError = field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormItem>
      {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
      <FormControl>
        <InputCurrency
          {...inputProps}
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
          error={hasError}
        />
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
