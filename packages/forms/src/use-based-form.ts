import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context.js";
import { CheckboxField } from "./fields/checkbox-field.js";
import { SelectField } from "./fields/select-field.js";
import { SwitchField } from "./fields/switch-field.js";
import { TextareaField } from "./fields/textarea-field.js";
import { TextField } from "./fields/text-field.js";

/**
 * Opinionated form hook built on TanStack Form. Zod schemas (and any other
 * Standard Schema-compatible library) can be passed directly to `validators`
 * without a separate adapter.
 *
 * @example
 * const form = useBasedForm({
 *   defaultValues: { email: "", password: "" },
 *   validators: { onChange: myZodSchema },
 *   onSubmit: async ({ value }) => { ... },
 * });
 *
 * // In JSX:
 * <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
 *   <form.AppField name="email" validators={{ onChange: z.string().email() }}>
 *     {() => <form.TextField label="Email" type="email" required />}
 *   </form.AppField>
 * </form>
 */
const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    TextField,
    TextareaField,
    SelectField,
    CheckboxField,
    SwitchField,
  },
  formComponents: {},
});

export const useBasedForm = useAppForm;
