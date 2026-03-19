import * as React from "react";
import { ArrowRight, Bell, Lock, Moon, Shield, User } from "lucide-react";
import { Group, Input, Switch, Badge, TagInput } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function GroupPage() {
	return (
		<ComponentDoc
			name="Group"
			description="Bordered grouped list for navigation, settings, and form fields. Each row can hold a label, description, form control, or action element."
			pkg="@almach/ui"
			examples={[
				{
					title: "Navigation list",
					description: "Rows with children text and an action arrow.",
					preview: (
						<Group className="w-full max-w-sm">
							<Group.Row action={<ArrowRight className="h-4 w-4" />}>
								Get started
							</Group.Row>
							<Group.Row action={<ArrowRight className="h-4 w-4" />}>
								Documentation
							</Group.Row>
							<Group.Row action={<ArrowRight className="h-4 w-4" />}>
								Components
							</Group.Row>
						</Group>
					),
					code: `<Group>
  <Group.Row action={<ArrowRight className="h-4 w-4" />}>Get started</Group.Row>
  <Group.Row action={<ArrowRight className="h-4 w-4" />}>Documentation</Group.Row>
  <Group.Row action={<ArrowRight className="h-4 w-4" />}>Components</Group.Row>
</Group>`,
				},
				{
					title: "Settings toggles",
					description:
						"Label and description on the left, control (Switch / Badge) on the right.",
					preview: <SettingsGroup />,
					code: `<Group label="Notifications">
  <Group.Row
    label="Email alerts"
    description="Receive summaries and digests."
    action={<Switch defaultChecked />}
  />
  <Group.Row
    label="Push notifications"
    description="Browser and mobile alerts."
    action={<Switch />}
  />
  <Group.Row
    label="Marketing emails"
    description="Product updates and offers."
    action={<Switch />}
  />
</Group>`,
				},
				{
					title: "Form fields",
					description:
						"Label on the left, input control on the right via children.",
					preview: (
						<Group label="Account" className="w-full max-w-sm">
							<Group.Row label="Display name" htmlFor="g-name">
								<Input id="g-name" defaultValue="Alice Johnson" className="w-40" />
							</Group.Row>
							<Group.Row label="Email" htmlFor="g-email">
								<Input
									id="g-email"
									type="email"
									defaultValue="alice@example.com"
									className="w-40"
								/>
							</Group.Row>
						</Group>
					),
					code: `<Group label="Account">
  <Group.Row label="Display name" htmlFor="name">
    <Input id="name" defaultValue="Alice Johnson" className="w-40" />
  </Group.Row>
  <Group.Row label="Email" htmlFor="email">
    <Input id="email" type="email" className="w-40" />
  </Group.Row>
</Group>`,
				},
				{
					title: "With section label and hint",
					description: "label= adds a header above the group, hint= adds a footer note.",
					preview: (
						<Group
							label="Privacy"
							hint="These settings apply to your public profile."
							className="w-full max-w-sm"
						>
							<Group.Row
								label="Public profile"
								description="Anyone can view your profile."
								action={<Switch defaultChecked />}
							/>
							<Group.Row
								label="Show email address"
								action={<Switch />}
							/>
						</Group>
					),
					code: `<Group label="Privacy" hint="These settings apply to your public profile.">
  <Group.Row label="Public profile" description="Anyone can view." action={<Switch defaultChecked />} />
  <Group.Row label="Show email address" action={<Switch />} />
</Group>`,
				},
				{
					title: "Mixed content",
					description: "Combining icon, badge, and clickable rows.",
					preview: (
						<Group className="w-full max-w-sm">
							<Group.Row action={<Badge variant="success">Active</Badge>}>
								<span className="flex items-center gap-2">
									<Shield className="h-4 w-4 text-muted-foreground" />
									Security
								</span>
							</Group.Row>
							<Group.Row action={<Badge variant="destructive">2</Badge>}>
								<span className="flex items-center gap-2">
									<Bell className="h-4 w-4 text-muted-foreground" />
									Alerts
								</span>
							</Group.Row>
							<Group.Row action={<ArrowRight className="h-4 w-4" />}>
								<span className="flex items-center gap-2">
									<User className="h-4 w-4 text-muted-foreground" />
									Profile
								</span>
							</Group.Row>
						</Group>
					),
					code: `<Group>
  <Group.Row action={<Badge variant="success">Active</Badge>}>
    <span className="flex items-center gap-2"><Shield />Security</span>
  </Group.Row>
  <Group.Row action={<Badge variant="destructive">2</Badge>}>
    <span className="flex items-center gap-2"><Bell />Alerts</span>
  </Group.Row>
</Group>`,
				},
			]}
			props={[
				{
					name: "label",
					type: "string",
					description: "Small-caps section title rendered above the group.",
				},
				{
					name: "hint",
					type: "string",
					description: "Helper text rendered below the group.",
				},
				{
					name: "Group.Row › label",
					type: "string",
					description: "Primary label on the left side of the row.",
				},
				{
					name: "Group.Row › description",
					type: "string",
					description: "Secondary text under the label.",
				},
				{
					name: "Group.Row › htmlFor",
					type: "string",
					description: "Connects the label to a form control by id.",
				},
				{
					name: "Group.Row › required",
					type: "boolean",
					description: "Adds a red asterisk to the label.",
				},
				{
					name: "Group.Row › action",
					type: "ReactNode",
					description: "Right-side element: Switch, Badge, arrow icon, input, etc.",
				},
				{
					name: "Group.Row › children",
					type: "ReactNode",
					description:
						"When label exists: right-side form control. Without label: fills the row.",
				},
				{
					name: "Group.Row › onClick",
					type: "() => void",
					description: "Makes the row clickable with hover feedback.",
				},
			]}
		/>
	);
}

function SettingsGroup() {
	const [email, setEmail] = React.useState(true);
	const [push, setPush] = React.useState(false);
	const [marketing, setMarketing] = React.useState(false);
	return (
		<Group label="Notifications" className="w-full max-w-sm">
			<Group.Row
				label="Email alerts"
				description="Receive summaries and digests."
				action={<Switch checked={email} onCheckedChange={setEmail} />}
			/>
			<Group.Row
				label="Push notifications"
				description="Browser and mobile alerts."
				action={<Switch checked={push} onCheckedChange={setPush} />}
			/>
			<Group.Row
				label="Marketing emails"
				description="Product updates and offers."
				action={<Switch checked={marketing} onCheckedChange={setMarketing} />}
			/>
		</Group>
	);
}
