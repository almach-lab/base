import * as React from "react";
import { Checkbox, Input, Label, Select } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function LabelPage() {
	return (
		<ComponentDoc
			name="Label"
			description="An accessible form label built on Radix UI Label. Clicking the label focuses its associated control."
			examples={[
				{
					title: "With input",
					description: "Link a label to an input using matching htmlFor and id.",
					preview: (
						<div className="w-full max-w-xs space-y-1.5">
							<Label htmlFor="lbl-name">Full name</Label>
							<Input id="lbl-name" placeholder="Alice Johnson" />
						</div>
					),
					code: `<Label htmlFor="name">Full name</Label>
<Input id="name" placeholder="Alice Johnson" />`,
					centered: false,
				},
				{
					title: "Required field",
					description:
						"Use the required prop to append an asterisk (*) indicating a mandatory field.",
					preview: (
						<div className="w-full max-w-xs space-y-3">
							<div className="space-y-1.5">
								<Label htmlFor="lbl-email" required>
									Email address
								</Label>
								<Input id="lbl-email" type="email" placeholder="john@example.com" />
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="lbl-pass" required>
									Password
								</Label>
								<Input id="lbl-pass" type="password" placeholder="••••••••" />
							</div>
						</div>
					),
					code: `<Label htmlFor="email" required>Email address</Label>
<Input id="email" type="email" placeholder="john@example.com" />

<Label htmlFor="password" required>Password</Label>
<Input id="password" type="password" placeholder="••••••••" />`,
					centered: false,
				},
				{
					title: "With checkbox",
					description: "Labels work with any focusable control, including checkboxes.",
					preview: (
						<div className="flex flex-col gap-2.5">
							<div className="flex items-center gap-2.5">
								<Checkbox id="lbl-cb1" defaultChecked />
								<Label htmlFor="lbl-cb1">Subscribe to newsletter</Label>
							</div>
							<div className="flex items-center gap-2.5">
								<Checkbox id="lbl-cb2" />
								<Label htmlFor="lbl-cb2">Accept marketing emails</Label>
							</div>
						</div>
					),
					code: `<div className="flex items-center gap-2.5">
  <Checkbox id="newsletter" defaultChecked />
  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
</div>`,
				},
				{
					title: "Disabled",
					description:
						"When the associated control is disabled, dim the label and change the cursor.",
					preview: (
						<div className="w-full max-w-xs space-y-1.5 opacity-50">
							<Label htmlFor="lbl-dis" className="cursor-not-allowed">
								Read-only field
							</Label>
							<Input id="lbl-dis" disabled defaultValue="Cannot be changed" />
						</div>
					),
					code: `<div className="opacity-50">
  <Label htmlFor="field" className="cursor-not-allowed">Read-only field</Label>
  <Input id="field" disabled defaultValue="Cannot be changed" />
</div>`,
					centered: false,
				},
			]}
			props={[
				{
					name: "htmlFor",
					type: "string",
					description: "The id of the associated form control. Clicking the label focuses it.",
				},
				{
					name: "required",
					type: "boolean",
					default: "false",
					description: "Appends an asterisk (*) to indicate a required field.",
				},
			]}
		/>
	);
}
