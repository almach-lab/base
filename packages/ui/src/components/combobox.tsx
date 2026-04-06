/**
 * @deprecated Use `Select.Searchable` from `@almach/ui` instead.
 * Combobox has been merged into the Select component for a cleaner API.
 *
 * @example
 * import { Select } from "@almach/ui";
 * <Select.Searchable options={options} value={value} onChange={setValue} />
 */

export type {
  SelectSearchableOption as ComboboxOption,
  SelectSearchableProps as ComboboxProps,
} from "./select.js";
export { Select as Combobox } from "./select.js";
