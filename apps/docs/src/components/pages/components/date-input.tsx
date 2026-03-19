import * as React from "react";
import { Input, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function DateInputPage() {
	return (
		<ComponentDoc
			name="Input.Date"
			description="Segmented date field (MM / DD / YYYY) with keyboard navigation, auto-advance, and an optional calendar popover picker. Available as Input.Date — part of the Input compound component."
			pkg="@almach/ui"
			examples={[
				{
					title: "Default",
					description: "Click a segment and type, or use ↑ ↓ arrow keys. Press / or → to advance between segments.",
					preview: <Input.Date />,
					code: `<Input.Date />`,
				},
				{
					title: "With calendar",
					description: "Add withCalendar to show a calendar icon that opens a date picker popover.",
					preview: <CalendarDateInput />,
					code: `const [date, setDate] = React.useState<Date>();

<Input.Date withCalendar value={date} onChange={setDate} />`,
				},
				{
					title: "Controlled",
					description: "Bind value and onChange to manage the date in state.",
					preview: <ControlledDateInput />,
					code: `const [date, setDate] = React.useState<Date>();

<Input.Date value={date} onChange={setDate} />
{date && <p className="text-sm">{date.toLocaleDateString()}</p>}`,
				},
				{
					title: "With label",
					description: "Compose with Label for accessible form fields.",
					preview: (
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="dob">Date of birth</Label>
							<Input.Date id="dob" withCalendar />
						</div>
					),
					code: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="dob">Date of birth</Label>
  <Input.Date id="dob" withCalendar />
</div>`,
				},
				{
					title: "Error state",
					description: "Pass error to show a red border and focus ring.",
					preview: (
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="dob-err">Date of birth</Label>
							<Input.Date id="dob-err" error />
							<p className="text-xs text-destructive">Please enter a valid date.</p>
						</div>
					),
					code: `<Input.Date error />`,
				},
				{
					title: "Disabled",
					description: "Dims the field and prevents interaction.",
					preview: <Input.Date value={new Date(1990, 5, 15)} disabled />,
					code: `<Input.Date value={new Date(1990, 5, 15)} disabled />`,
				},
			]}
			props={[
				{
					name: "value",
					type: "Date",
					description: "Controlled date value.",
				},
				{
					name: "onChange",
					type: "(date: Date | undefined) => void",
					description: "Called when all three segments form a valid date, or undefined when incomplete.",
				},
				{
					name: "withCalendar",
					type: "boolean",
					default: "false",
					description: "Show a calendar icon button that opens a date picker popover.",
				},
				{
					name: "disabled",
					type: "boolean",
					description: "Disables all segments and the calendar button.",
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

function CalendarDateInput() {
	const [date, setDate] = React.useState<Date | undefined>();
	return (
		<div className="flex flex-col gap-2 items-start">
			<Input.Date withCalendar value={date} onChange={setDate} />
			{date ? (
				<p className="text-sm text-muted-foreground">
					{date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
				</p>
			) : (
				<p className="text-sm text-muted-foreground">No date selected</p>
			)}
		</div>
	);
}

function ControlledDateInput() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	return (
		<div className="flex flex-col gap-2 items-center">
			<Input.Date value={date} onChange={setDate} />
			{date ? (
				<p className="text-sm text-muted-foreground">
					Selected:{" "}
					<span className="font-medium text-foreground">
						{date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
					</span>
				</p>
			) : (
				<p className="text-sm text-muted-foreground">No date selected</p>
			)}
		</div>
	);
}
