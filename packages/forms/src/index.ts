// Form primitives
export {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  useFormField,
} from "./form.js";

// Field context hooks
export { useFieldContext, useFormContext } from "./form-context.js";

// High-level field components
export { TextField } from "./fields/text-field.js";
export { TextareaField } from "./fields/textarea-field.js";
export { SelectField } from "./fields/select-field.js";
export { CheckboxField } from "./fields/checkbox-field.js";
export { SwitchField } from "./fields/switch-field.js";
export type { SelectOption } from "./fields/select-field.js";

// Form builder hook
export { useBasedForm } from "./use-based-form.js";

// TanStack Form re-exports
export { useForm } from "@tanstack/react-form";
export type { AnyFieldApi, FormApi } from "@tanstack/react-form";

// Zod
export { z } from "zod";
export type { ZodSchema, infer as ZodInfer } from "zod";

