import * as React from "react";
import { Select, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

const FRAMEWORKS = [
	{ value: "react", label: "React" },
	{ value: "vue", label: "Vue" },
	{ value: "angular", label: "Angular" },
	{ value: "svelte", label: "Svelte" },
	{ value: "solid", label: "SolidJS" },
	{ value: "next", label: "Next.js" },
	{ value: "nuxt", label: "Nuxt" },
	{ value: "remix", label: "Remix" },
];

const COUNTRIES = [
	{ value: "us", label: "United States" },
	{ value: "gb", label: "United Kingdom" },
	{ value: "ca", label: "Canada" },
	{ value: "au", label: "Australia" },
	{ value: "de", label: "Germany" },
	{ value: "fr", label: "France" },
	{ value: "jp", label: "Japan" },
	{ value: "br", label: "Brazil" },
];

export function ComboboxPage() {
	return (
		<ComponentDoc
			name="Select.Searchable"
			description="Searchable select built with Popover and cmdk. Filters options as you type, marks the selected value with a checkmark, and clears on re-select. Previously known as Combobox — now part of Select."
			pkg="@almach/ui"
			examples={[
				{
					title: "Basic",
					description: "Open the dropdown and type to filter options.",
					preview: <FrameworkCombobox />,
					code: `const [value, setValue] = React.useState("");

<Select.Searchable
  options={frameworks}
  value={value}
  onChange={setValue}
  placeholder="Select framework…"
/>`,
				},
				{
					title: "With label",
					description: "Compose with Label for accessible form fields.",
					preview: (
						<div className="flex w-52 flex-col gap-1.5">
							<Label htmlFor="country">Country</Label>
							<CountryCombobox />
						</div>
					),
					code: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="country">Country</Label>
  <Select.Searchable
    options={countries}
    placeholder="Select country…"
    searchPlaceholder="Search countries…"
  />
</div>`,
				},
				{
					title: "Disabled option",
					description: "Mark specific options as disabled in the options array.",
					preview: (
						<Select.Searchable
							options={[
								{ value: "free", label: "Free" },
								{ value: "pro", label: "Pro" },
								{ value: "enterprise", label: "Enterprise (contact sales)", disabled: true },
							]}
							placeholder="Select plan…"
						/>
					),
					code: `<Select.Searchable
  options={[
    { value: "free",       label: "Free" },
    { value: "pro",        label: "Pro" },
    { value: "enterprise", label: "Enterprise (contact sales)", disabled: true },
  ]}
  placeholder="Select plan…"
/>`,
				},
				{
					title: "Disabled",
					description: "The entire select can be disabled.",
					preview: (
						<Select.Searchable
							options={FRAMEWORKS}
							value="react"
							placeholder="Select framework…"
							disabled
						/>
					),
					code: `<Select.Searchable options={frameworks} value="react" disabled />`,
				},
			]}
			props={[
				{
					name: "options",
					type: "SelectSearchableOption[]",
					required: true,
					description: "Array of { value, label, disabled? } objects.",
				},
				{
					name: "value",
					type: "string",
					description: "Controlled selected value.",
				},
				{
					name: "onChange",
					type: "(value: string) => void",
					description: "Called when selection changes. Re-selecting the same value clears it.",
				},
				{
					name: "placeholder",
					type: "string",
					description: "Text shown when nothing is selected.",
				},
				{
					name: "searchPlaceholder",
					type: "string",
					description: "Placeholder inside the search input.",
				},
				{
					name: "disabled",
					type: "boolean",
					description: "Disables the entire select.",
				},
				{
					name: "error",
					type: "boolean",
					description: "Applies destructive border and focus ring.",
				},
			]}
		/>
	);
}

function FrameworkCombobox() {
	const [value, setValue] = React.useState("");
	return (
		<div className="flex flex-col gap-2 items-center">
			<Select.Searchable
				options={FRAMEWORKS}
				value={value}
				onChange={setValue}
				placeholder="Select framework…"
				searchPlaceholder="Search frameworks…"
			/>
			{value && (
				<p className="text-sm text-muted-foreground">
					Selected:{" "}
					<span className="font-medium text-foreground">
						{FRAMEWORKS.find((f) => f.value === value)?.label}
					</span>
				</p>
			)}
		</div>
	);
}

function CountryCombobox() {
	const [value, setValue] = React.useState("");
	return (
		<Select.Searchable
			options={COUNTRIES}
			value={value}
			onChange={setValue}
			placeholder="Select country…"
			searchPlaceholder="Search countries…"
		/>
	);
}
