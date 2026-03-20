import * as React from "react";
import { Input, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function DateInputPage() {
	return (
		<ComponentDoc
			name="Input.Date"
			description="Segmented date field with keyboard navigation, auto-advance, and an optional calendar popover picker. Supports any format via the format prop — e.g. MM/DD/YYYY, DD-MM-YYYY, YYYY-MM-DD."
			pkg="@almach/ui"
			examples={[
				{
					title: "Default (MM/DD/YYYY)",
					description: "Click a segment and type, or use ↑ ↓ arrow keys. Press / or → to advance between segments.",
					preview: <Input.Date />,
					code: `<Input.Date />`,
				},
				{
					title: "Format: DD/MM/YYYY",
					description: "Day-first format common in Europe and most of the world.",
					preview: <Input.Date format="DD/MM/YYYY" />,
					code: `<Input.Date format="DD/MM/YYYY" />`,
				},
				{
					title: "Format: DD-MM-YYYY",
					description: "Dash-separated day-first format.",
					preview: <Input.Date format="DD-MM-YYYY" />,
					code: `<Input.Date format="DD-MM-YYYY" />`,
				},
				{
					title: "Format: YYYY-MM-DD",
					description: "ISO 8601 format — year first, dash separator.",
					preview: <Input.Date format="YYYY-MM-DD" />,
					code: `<Input.Date format="YYYY-MM-DD" />`,
				},
				{
					title: "Format switcher",
					description: "Switch format at runtime — segments reorder accordingly.",
					preview: <FormatSwitcher />,
					code: `const FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"];
const [fmt, setFmt] = React.useState("MM/DD/YYYY");
const [date, setDate] = React.useState<Date>();

<div className="flex flex-col gap-3">
  <div className="flex flex-wrap gap-2">
    {FORMATS.map((f) => (
      <button key={f} onClick={() => setFmt(f)}
        className={fmt === f ? "font-bold underline" : "text-muted-foreground"}>
        {f}
      </button>
    ))}
  </div>
  <Input.Date format={fmt} value={date} onChange={setDate} withCalendar />
</div>`,
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
					code: `const [date, setDate] = React.useState<Date>(new Date());

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
					name: "format",
					type: "string",
					default: '"MM/DD/YYYY"',
					description: 'Controls segment order and separator. Tokens: MM, DD, YYYY. Examples: "DD/MM/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY".',
				},
				{
					name: "value",
					type: "Date",
					description: "Controlled date value.",
				},
				{
					name: "onChange",
					type: "(date: Date | undefined) => void",
					description: "Called when all segments form a valid date, or undefined when incomplete.",
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

// ── Demos ───────────────────────────────────────────────────────────────────

const FORMATS = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD", "DD-MM-YYYY"] as const;

function FormatSwitcher() {
	const [fmt, setFmt] = React.useState<string>("MM/DD/YYYY");
	const [date, setDate] = React.useState<Date | undefined>();
	return (
		<div className="flex flex-col gap-3 w-full max-w-xs">
			<div className="flex flex-wrap gap-1.5">
				{FORMATS.map((f) => (
					<button
						key={f}
						onClick={() => setFmt(f)}
						className={
							fmt === f
								? "rounded-md bg-primary px-2 py-1 text-xs font-medium text-primary-foreground"
								: "rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-accent"
						}
					>
						{f}
					</button>
				))}
			</div>
			<Input.Date format={fmt} value={date} onChange={setDate} withCalendar />
			{date && (
				<p className="text-xs text-muted-foreground">
					{date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
				</p>
			)}
		</div>
	);
}

function CalendarDateInput() {
	const [date, setDate] = React.useState<Date | undefined>();
	return (
		<div className="flex flex-col gap-2 items-start">
			<Input.Date withCalendar value={date} onChange={setDate} />
			<p className="text-sm text-muted-foreground">
				{date
					? date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
					: "No date selected"}
			</p>
		</div>
	);
}

function ControlledDateInput() {
	const [date, setDate] = React.useState<Date | undefined>(new Date());
	return (
		<div className="flex flex-col gap-2 items-center">
			<Input.Date value={date} onChange={setDate} />
			<p className="text-sm text-muted-foreground">
				{date ? (
					<>
						Selected:{" "}
						<span className="font-medium text-foreground">
							{date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
						</span>
					</>
				) : (
					"No date selected"
				)}
			</p>
		</div>
	);
}
