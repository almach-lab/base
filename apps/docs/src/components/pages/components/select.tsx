import { Label, Select } from "@almach/ui";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

const FRAMEWORKS = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "solid", label: "Solid" },
  { value: "angular", label: "Angular" },
  { value: "next", label: "Next.js" },
  { value: "nuxt", label: "Nuxt" },
  { value: "remix", label: "Remix" },
];

export function SelectPage() {
  return (
    <ComponentDoc
      name="Select"
      description="A dropdown selector with groups, labels, error state, and a built-in searchable variant (Select.Searchable) — no separate Combobox needed."
      pkg="@almach/ui"
      examples={[
        {
          title: "Default",
          description: "Controlled select with grouped options.",
          preview: <ControlledSelect />,
          code: `const [value, setValue] = React.useState("");

<Select value={value} onValueChange={setValue}>
  <Select.Trigger className="w-full">
    <Select.Value placeholder="Pick a framework…" />
  </Select.Trigger>
  <Select.Content>
    <Select.Group>
      <Select.Label>JavaScript</Select.Label>
      <Select.Item value="react">React</Select.Item>
      <Select.Item value="vue">Vue</Select.Item>
      <Select.Item value="svelte">Svelte</Select.Item>
    </Select.Group>
    <Select.Separator />
    <Select.Group>
      <Select.Label>Meta-frameworks</Select.Label>
      <Select.Item value="next">Next.js</Select.Item>
      <Select.Item value="remix">Remix</Select.Item>
    </Select.Group>
  </Select.Content>
</Select>`,
          centered: false,
        },
        {
          title: "Searchable",
          description:
            "Select.Searchable adds a live-filter search input — replaces the old Combobox component.",
          preview: <SearchableSelect />,
          code: `const [value, setValue] = React.useState("");

<Select.Searchable
  options={frameworks}
  value={value}
  onChange={setValue}
  placeholder="Pick a framework…"
  searchPlaceholder="Search frameworks…"
/>`,
          centered: false,
        },
        {
          title: "Error state",
          description:
            "Pass error to Select.Trigger or Select.Searchable to show validation feedback.",
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <div className="space-y-1.5">
                <Label required>Framework (dropdown)</Label>
                <Select>
                  <Select.Trigger className="w-full" error>
                    <Select.Value placeholder="Select a framework…" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="react">React</Select.Item>
                  </Select.Content>
                </Select>
                <p className="text-xs text-destructive">
                  Please select a framework.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label required>Framework (searchable)</Label>
                <Select.Searchable
                  options={FRAMEWORKS}
                  placeholder="Select a framework…"
                  error
                  className="w-full"
                />
                <p className="text-xs text-destructive">
                  Please select a framework.
                </p>
              </div>
            </div>
          ),
          code: `{/* Dropdown */}
<Select>
  <Select.Trigger className="w-full" error>
    <Select.Value placeholder="Select…" />
  </Select.Trigger>
  <Select.Content>…</Select.Content>
</Select>

{/* Searchable */}
<Select.Searchable options={options} error placeholder="Select…" />`,
          centered: false,
        },
        {
          title: "Disabled",
          description: "Disable the entire control or individual items.",
          preview: (
            <div className="w-full max-w-xs space-y-3">
              <div className="space-y-1.5">
                <Label>Plan</Label>
                <Select defaultValue="pro">
                  <Select.Trigger className="w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="free">Free</Select.Item>
                    <Select.Item value="pro">Pro</Select.Item>
                    <Select.Item value="enterprise" disabled>
                      Enterprise — contact sales
                    </Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Region (disabled)</Label>
                <Select disabled>
                  <Select.Trigger className="w-full">
                    <Select.Value placeholder="Select region…" />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="us">US East</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
          ),
          code: `{/* Disabled item */}
<Select.Item value="enterprise" disabled>Enterprise</Select.Item>

{/* Disabled select */}
<Select disabled>…</Select>`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value",
          type: "string",
          description: "Controlled selected value.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Callback when the dropdown selection changes.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the entire select control.",
        },
        {
          name: "Select.Trigger error",
          type: "boolean",
          default: "false",
          description:
            "Applies destructive ring and aria-invalid on the trigger.",
        },
        {
          name: "Select.Searchable options",
          type: "{ value: string; label: string; disabled?: boolean }[]",
          required: true,
          description: "Options list for the searchable variant.",
        },
        {
          name: "Select.Searchable onChange",
          type: "(value: string) => void",
          description:
            "Called when an option is selected. Re-selecting the current value clears it.",
        },
        {
          name: "Select.Searchable searchPlaceholder",
          type: "string",
          default: '"Search…"',
          description: "Placeholder text for the search input.",
        },
        {
          name: "Select.Searchable error",
          type: "boolean",
          default: "false",
          description: "Applies destructive border and focus ring.",
        },
      ]}
    />
  );
}

function ControlledSelect() {
  const [value, setValue] = React.useState("");
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label>Framework</Label>
      <Select value={value} onValueChange={setValue}>
        <Select.Trigger className="w-full">
          <Select.Value placeholder="Pick a framework…" />
        </Select.Trigger>
        <Select.Content>
          <Select.Group>
            <Select.Label>JavaScript</Select.Label>
            <Select.Item value="react">React</Select.Item>
            <Select.Item value="vue">Vue</Select.Item>
            <Select.Item value="svelte">Svelte</Select.Item>
          </Select.Group>
          <Select.Separator />
          <Select.Group>
            <Select.Label>Meta-frameworks</Select.Label>
            <Select.Item value="next">Next.js</Select.Item>
            <Select.Item value="remix">Remix</Select.Item>
          </Select.Group>
        </Select.Content>
      </Select>
      {value && (
        <p className="text-xs text-muted-foreground">Selected: {value}</p>
      )}
    </div>
  );
}

function SearchableSelect() {
  const [value, setValue] = React.useState("");
  return (
    <div className="w-full max-w-xs space-y-1.5">
      <Label>Framework</Label>
      <Select.Searchable
        options={FRAMEWORKS}
        value={value}
        onChange={setValue}
        placeholder="Pick a framework…"
        searchPlaceholder="Search frameworks…"
        className="w-full"
      />
      {value && (
        <p className="text-xs text-muted-foreground">Selected: {value}</p>
      )}
    </div>
  );
}
