import * as React from "react";
import { Checkbox, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function CheckboxPage() {
	return (
		<ComponentDoc
			name="Checkbox"
			description="A boolean control built on Radix UI Checkbox with checked, unchecked, disabled, and error states."
			examples={[
				{
					title: "Default",
					description: "Always pair with a Label via matching id and htmlFor.",
					preview: (
						<div className="flex items-center gap-2.5">
							<Checkbox id="terms" defaultChecked />
							<Label htmlFor="terms">Accept terms and conditions</Label>
						</div>
					),
					code: `<Checkbox id="terms" defaultChecked />
<Label htmlFor="terms">Accept terms and conditions</Label>`,
				},
				{
					title: "States",
					description:
						"Unchecked and checked states. The component manages its own visual style.",
					preview: (
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-2.5">
								<Checkbox id="cb-off" />
								<Label htmlFor="cb-off">Unchecked</Label>
							</div>
							<div className="flex items-center gap-2.5">
								<Checkbox id="cb-on" defaultChecked />
								<Label htmlFor="cb-on">Checked</Label>
							</div>
						</div>
					),
					code: `<div className="flex items-center gap-2.5">
  <Checkbox id="off" />
  <Label htmlFor="off">Unchecked</Label>
</div>

<div className="flex items-center gap-2.5">
  <Checkbox id="on" defaultChecked />
  <Label htmlFor="on">Checked</Label>
</div>`,
				},
				{
					title: "Disabled",
					description:
						"Disabled checkboxes are non-interactive. The entire row — label included — renders at reduced opacity per HIG.",
					preview: (
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-2.5 opacity-50">
								<Checkbox id="dis-off" disabled />
								<Label htmlFor="dis-off" className="cursor-not-allowed">
									Disabled
								</Label>
							</div>
							<div className="flex items-center gap-2.5 opacity-50">
								<Checkbox id="dis-on" disabled defaultChecked />
								<Label htmlFor="dis-on" className="cursor-not-allowed">
									Disabled checked
								</Label>
							</div>
						</div>
					),
					code: `<div className="flex items-center gap-2.5 opacity-50">
  <Checkbox id="cb" disabled />
  <Label htmlFor="cb" className="cursor-not-allowed">Disabled</Label>
</div>

<div className="flex items-center gap-2.5 opacity-50">
  <Checkbox id="cb2" disabled defaultChecked />
  <Label htmlFor="cb2" className="cursor-not-allowed">Disabled checked</Label>
</div>`,
				},
				{
					title: "Error state",
					description: "Shows a red border to indicate invalid or required selection.",
					preview: (
						<div className="space-y-2">
							<div className="flex items-center gap-2.5">
								<Checkbox id="err" error />
								<Label htmlFor="err">I agree to the terms</Label>
							</div>
							<p className="text-xs text-destructive pl-[26px]">
								You must accept the terms to continue.
							</p>
						</div>
					),
					code: `<div className="flex items-center gap-2.5">
  <Checkbox id="terms" error />
  <Label htmlFor="terms">I agree to the terms</Label>
</div>
<p className="text-xs text-destructive">
  You must accept the terms to continue.
</p>`,
					centered: false,
				},
				{
					title: "Checkbox group",
					description: "Multiple checkboxes with a controlled state.",
					preview: <CheckboxGroupDemo />,
					code: `const [selected, setSelected] = React.useState<string[]>(["email"]);

function toggle(id: string) {
  setSelected((prev) =>
    prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
  );
}

const options = [
  { id: "email", label: "Email notifications" },
  { id: "sms", label: "SMS alerts" },
  { id: "push", label: "Push notifications" },
];

{options.map(({ id, label }) => (
  <div key={id} className="flex items-center gap-2.5">
    <Checkbox
      id={id}
      checked={selected.includes(id)}
      onCheckedChange={() => toggle(id)}
    />
    <Label htmlFor={id}>{label}</Label>
  </div>
))}`,
					centered: false,
				},
			]}
			props={[
				{
					name: "checked",
					type: "boolean | 'indeterminate'",
					description: "Controlled checked state.",
				},
				{
					name: "defaultChecked",
					type: "boolean",
					default: "false",
					description: "Initial checked state (uncontrolled).",
				},
				{
					name: "onCheckedChange",
					type: "(checked: boolean | 'indeterminate') => void",
					description: "Callback when the checked state changes.",
				},
				{
					name: "error",
					type: "boolean",
					default: "false",
					description: "Applies destructive border and sets aria-invalid.",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Prevents interaction. Control renders at 50% opacity.",
				},
			]}
		/>
	);
}

function CheckboxGroupDemo() {
	const [selected, setSelected] = React.useState<string[]>(["email"]);
	const options = [
		{ id: "email", label: "Email notifications" },
		{ id: "sms", label: "SMS alerts" },
		{ id: "push", label: "Push notifications" },
	];
	function toggle(id: string) {
		setSelected((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
		);
	}
	return (
		<div className="flex flex-col gap-3">
			{options.map(({ id, label }) => (
				<div key={id} className="flex items-center gap-2.5">
					<Checkbox
						id={`grp-${id}`}
						checked={selected.includes(id)}
						onCheckedChange={() => toggle(id)}
					/>
					<Label htmlFor={`grp-${id}`}>{label}</Label>
				</div>
			))}
		</div>
	);
}
