"use client";

import { Input, type InputProps } from "@almach/ui";
import type { CurrencyValue, InputCurrencyProps } from "@almach/ui";
import { useFieldContext } from "../form-context.js";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../form.js";

interface BaseProps {
  label?: string;
  description?: string;
  required?: boolean;
}

type RegularTextFieldProps = BaseProps &
  Omit<InputProps, "name" | "value" | "onChange" | "onBlur"> & {
    type?: Exclude<string, "currency">;
  };

type CurrencyTextFieldProps = BaseProps &
  Omit<InputCurrencyProps, "value" | "onChange" | "error"> & {
    type: "currency";
  };

export type TextFieldProps = RegularTextFieldProps | CurrencyTextFieldProps;

export function TextField({
  label,
  description,
  required,
  ...inputProps
}: TextFieldProps) {
  const field = useFieldContext<string | CurrencyValue>();
  const hasError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0;

  return (
    <FormItem>
      {label && <FormLabel required={required ?? false}>{label}</FormLabel>}
      <FormControl>
        {inputProps.type === "currency" ? (
          <Input.Currency
            {...(inputProps as Omit<InputCurrencyProps, "value" | "onChange" | "error">)}
            value={field.state.value as CurrencyValue}
            onChange={(value) => field.handleChange(value)}
            error={hasError}
          />
        ) : (
          <Input
            {...(inputProps as Omit<InputProps, "name" | "value" | "onChange" | "onBlur">)}
            name={field.name}
            value={(field.state.value as string) ?? ""}
            onChange={(e) => field.handleChange(e.target.value)}
            onBlur={field.handleBlur}
            error={hasError}
          />
        )}
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
}
