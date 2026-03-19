import * as React from "react";
import { Radio, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function RadioPage() {
	return (
		<ComponentDoc
			name="Radio"
			description="Single-selection control built on Radix RadioGroup. Supports label, description, disabled state, and controlled value."
			pkg="@almach/ui"
			examples={[
				{
					title: "Basic",
					description: "A group of radio options with labels.",
					preview: (
						<Radio defaultValue="member" aria-label="Role">
							<Radio.Item value="admin" label="Admin" />
							<Radio.Item value="member" label="Member" />
							<Radio.Item value="viewer" label="Viewer" />
						</Radio>
					),
					code: `<Radio defaultValue="member" aria-label="Role">
  <Radio.Item value="admin"  label="Admin" />
  <Radio.Item value="member" label="Member" />
  <Radio.Item value="viewer" label="Viewer" />
</Radio>`,
				},
				{
					title: "With descriptions",
					description: "Each option can carry a supporting description line.",
					preview: (
						<Radio defaultValue="pro" className="gap-3" aria-label="Plan">
							<Radio.Item
								value="free"
								label="Free"
								description="Up to 3 projects, community support."
							/>
							<Radio.Item
								value="pro"
								label="Pro"
								description="Unlimited projects, priority support, analytics."
							/>
							<Radio.Item
								value="enterprise"
								label="Enterprise"
								description="SSO, audit logs, dedicated SLA, custom contracts."
							/>
						</Radio>
					),
					code: `<Radio defaultValue="pro" aria-label="Plan">
  <Radio.Item value="free"       label="Free"       description="Up to 3 projects, community support." />
  <Radio.Item value="pro"        label="Pro"        description="Unlimited projects, priority support." />
  <Radio.Item value="enterprise" label="Enterprise" description="SSO, audit logs, dedicated SLA." />
</Radio>`,
				},
				{
					title: "Disabled",
					description:
						"Pass disabled to Radio.Item. The entire row dims and loses interactivity (HIG).",
					preview: (
						<Radio defaultValue="b" aria-label="Options">
							<Radio.Item value="a" label="Option A" />
							<Radio.Item value="b" label="Option B" />
							<Radio.Item value="c" label="Option C (unavailable)" disabled />
						</Radio>
					),
					code: `<Radio defaultValue="b" aria-label="Options">
  <Radio.Item value="a" label="Option A" />
  <Radio.Item value="b" label="Option B" />
  <Radio.Item value="c" label="Option C (unavailable)" disabled />
</Radio>`,
				},
				{
					title: "Controlled",
					description: "Manage the selected value with React state.",
					preview: <ControlledRadio />,
					code: `const [plan, setPlan] = React.useState("monthly");

<Radio value={plan} onValueChange={setPlan} aria-label="Billing">
  <Radio.Item value="monthly" label="Monthly" description="Billed every month." />
  <Radio.Item value="annual"  label="Annual"  description="Billed yearly — save 20%." />
</Radio>
<p className="text-sm text-muted-foreground">Selected: {plan}</p>`,
				},
				{
					title: "Horizontal layout",
					description: "Apply a custom className to Radio for inline options.",
					preview: (
						<Radio
							defaultValue="light"
							className="flex-row gap-6"
							aria-label="Theme"
						>
							<Radio.Item value="light" label="Light" />
							<Radio.Item value="dark" label="Dark" />
							<Radio.Item value="system" label="System" />
						</Radio>
					),
					code: `<Radio defaultValue="light" className="flex-row gap-6" aria-label="Theme">
  <Radio.Item value="light"  label="Light" />
  <Radio.Item value="dark"   label="Dark" />
  <Radio.Item value="system" label="System" />
</Radio>`,
				},
			]}
			props={[
				{
					name: "value",
					type: "string",
					description: "Controlled selected value.",
				},
				{
					name: "defaultValue",
					type: "string",
					description: "Initial selected value (uncontrolled).",
				},
				{
					name: "onValueChange",
					type: "(value: string) => void",
					description: "Callback when selection changes.",
				},
				{
					name: "Radio.Item › value",
					type: "string",
					required: true,
					description: "The value this item represents.",
				},
				{
					name: "Radio.Item › label",
					type: "string",
					description: "Primary label rendered next to the circle.",
				},
				{
					name: "Radio.Item › description",
					type: "string",
					description: "Supporting text shown below the label.",
				},
				{
					name: "Radio.Item › disabled",
					type: "boolean",
					description: "Dims entire row and removes pointer events.",
				},
			]}
		/>
	);
}

function ControlledRadio() {
	const [plan, setPlan] = React.useState("monthly");
	return (
		<div className="flex flex-col gap-4">
			<Radio value={plan} onValueChange={setPlan} aria-label="Billing">
				<Radio.Item
					value="monthly"
					label="Monthly"
					description="Billed every month."
				/>
				<Radio.Item
					value="annual"
					label="Annual"
					description="Billed yearly — save 20%."
				/>
			</Radio>
			<p className="text-sm text-muted-foreground">
				Selected: <span className="font-medium text-foreground">{plan}</span>
			</p>
		</div>
	);
}
