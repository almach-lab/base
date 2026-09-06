/**
 * Browser-facing configuration shared by every field.
 *
 * The plain `Input` and `Textarea` forward these natively because they spread
 * onto a real `<input>`. The composite fields (date, date range, currency,
 * colour, OTP, tags) build their own inner inputs, so without this they
 * silently swallowed autofill hints, keyboard hints and form association —
 * meaning they could not participate in a normal form at all.
 */
export interface FieldBrowserProps {
  /** Form field name. Composite fields post through a hidden input. */
  name?: string;
  /** Autofill hint, e.g. `"cc-number"`, `"bday"`, `"off"`. */
  autoComplete?: string;
  /** On-screen keyboard to request. */
  inputMode?:
    | "none"
    | "text"
    | "tel"
    | "url"
    | "email"
    | "numeric"
    | "decimal"
    | "search";
  /** Label for the virtual keyboard's action key. */
  enterKeyHint?:
    | "enter"
    | "done"
    | "go"
    | "next"
    | "previous"
    | "search"
    | "send";
  spellCheck?: boolean;
  autoCapitalize?: "off" | "none" | "on" | "sentences" | "words" | "characters";
  /** Safari-only, but harmless elsewhere. */
  autoCorrect?: "on" | "off";
  autoFocus?: boolean;
  readOnly?: boolean;
  required?: boolean;
  /** Associates the field with a form by id, for fields rendered outside it. */
  form?: string;
}

/** Keys that belong on the inner `<input>`, not on the wrapper. */
const BROWSER_PROP_KEYS = [
  "autoComplete",
  "inputMode",
  "enterKeyHint",
  "spellCheck",
  "autoCapitalize",
  "autoCorrect",
  "autoFocus",
  "readOnly",
  "required",
  "form",
] as const satisfies ReadonlyArray<keyof FieldBrowserProps>;

/**
 * Picks the browser attributes off a props object so they can be spread onto
 * an inner input. `name` is deliberately excluded: composite fields render a
 * hidden input for it rather than putting it on a display field, so the posted
 * value is the parsed one rather than whatever text is on screen.
 *
 * Defaults are applied only where the caller left a value unset.
 */
export function browserFieldProps(
  props: FieldBrowserProps,
  defaults: Partial<FieldBrowserProps> = {},
): Record<string, unknown> {
  const merged: Record<string, unknown> = {};

  for (const key of BROWSER_PROP_KEYS) {
    const value = props[key] ?? defaults[key];
    if (value !== undefined) merged[key] = value;
  }

  return merged;
}
