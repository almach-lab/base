import * as React from "react";
import { Switch } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function SwitchPage() {
	return (
		<ComponentDoc
			name="Switch"
			description="iOS-style toggle built on Radix Switch. Three sizes, smooth animation, HIG-compliant disabled state."
			pkg="@almach/ui"
			examples={[
				{
					title: "Sizes",
					description: "sm, default, and lg sizes — all follow Apple HIG proportions.",
					preview: (
						<div className="flex items-center gap-8">
							{(["sm", "default", "lg"] as const).map((size) => (
								<div key={size} className="flex flex-col items-center gap-2">
									<Switch size={size} defaultChecked />
									<span className="text-xs text-muted-foreground">{size}</span>
								</div>
							))}
						</div>
					),
					code: `<Switch size="sm" />
<Switch size="default" />
<Switch size="lg" />`,
				},
				{
					title: "States",
					description: "Checked and unchecked states.",
					preview: (
						<div className="flex flex-col gap-3">
							<div className="flex items-center gap-3">
								<Switch defaultChecked />
								<span className="text-sm text-muted-foreground">On</span>
							</div>
							<div className="flex items-center gap-3">
								<Switch />
								<span className="text-sm text-muted-foreground">Off</span>
							</div>
						</div>
					),
					code: `<Switch defaultChecked />
<Switch />`,
				},
				{
					title: "With label — HIG disabled",
					description:
						"HIG standard: wrap switch + label in a row div. Disabled → entire row opacity-50.",
					preview: (
						<div className="flex w-full max-w-xs flex-col gap-3">
							{[
								{ label: "Email notifications", on: true, disabled: false },
								{ label: "Push notifications", on: false, disabled: false },
								{ label: "SMS alerts (unavailable)", on: false, disabled: true },
							].map(({ label, on, disabled }) => (
								<label
									key={label}
									className={[
										"flex items-center justify-between gap-4",
										disabled
											? "cursor-not-allowed opacity-50"
											: "cursor-pointer",
									].join(" ")}
								>
									<span className="text-sm font-medium">{label}</span>
									<Switch defaultChecked={on} disabled={disabled} />
								</label>
							))}
						</div>
					),
					code: `<label className={disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}>
  <span className="text-sm font-medium">Email notifications</span>
  <Switch defaultChecked disabled={disabled} />
</label>`,
				},
				{
					title: "Controlled",
					description: "Bind checked and onCheckedChange for external state.",
					preview: <ControlledSwitch />,
					code: `const [on, setOn] = React.useState(false);

<Switch checked={on} onCheckedChange={setOn} />
<p>{on ? "Enabled" : "Disabled"}</p>`,
				},
			]}
			props={[
				{
					name: "size",
					type: '"sm" | "default" | "lg"',
					default: '"default"',
					description: "Physical size of the track and thumb.",
				},
				{
					name: "checked",
					type: "boolean",
					description: "Controlled checked state.",
				},
				{
					name: "defaultChecked",
					type: "boolean",
					description: "Initial checked state (uncontrolled).",
				},
				{
					name: "onCheckedChange",
					type: "(checked: boolean) => void",
					description: "Callback when the toggle changes.",
				},
				{
					name: "disabled",
					type: "boolean",
					description:
						"Disables the switch. For HIG compliance, add opacity-50 to the whole row.",
				},
			]}
		/>
	);
}

function ControlledSwitch() {
	const [on, setOn] = React.useState(false);
	return (
		<div className="flex flex-col items-center gap-3">
			<Switch checked={on} onCheckedChange={setOn} />
			<p className="text-sm text-muted-foreground">
				Dark mode:{" "}
				<span className="font-medium text-foreground">{on ? "on" : "off"}</span>
			</p>
		</div>
	);
}
