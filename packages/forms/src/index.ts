// Form primitives
export {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form";

// Field context hooks
export { useFieldContext, useFormContext } from "./form-context";

// High-level field components
export { TextField } from "./fields/text-field";
export { TextareaField } from "./fields/textarea-field";
export { SelectField } from "./fields/select-field";
export { CheckboxField } from "./fields/checkbox-field";
export { SwitchField } from "./fields/switch-field";
export { CurrencyField } from "./fields/currency-field";
export type { SelectOption } from "./fields/select-field";
export type { CurrencyFieldProps } from "./fields/currency-field";

// Form builder hook
export { useBasedForm } from "./use-based-form";

// TanStack Form re-exports
export { useForm } from "@tanstack/react-form";
export type { AnyFieldApi, FormApi } from "@tanstack/react-form";

// Zod
export { z } from "zod";
export type { ZodSchema, infer as ZodInfer } from "zod";

