import * as React from "react";
import { Calendar } from "@almach/ui";
import type { DateRange } from "react-day-picker";
import { ComponentDoc } from "../../component-doc";

export function CalendarPage() {
	return (
		<ComponentDoc
			name="Calendar"
			description="Date picker that supports single date, multiple dates, and date range selection out of the box."
			pkg="@almach/ui"
			examples={[
				{
					title: "Single date",
					description: "Select one date. Selected date highlights in foreground.",
					preview: <SingleCalendar />,
					code: `const [date, setDate] = React.useState<Date>();

<Calendar mode="single" selected={date} onSelect={setDate} />`,
				},
				{
					title: "Date range",
					description:
						"Select a start and end date. The range highlights between them.",
					preview: <RangeCalendar />,
					code: `const [range, setRange] = React.useState<DateRange>();

<Calendar mode="range" selected={range} onSelect={setRange} numberOfMonths={2} />`,
				},
				{
					title: "Multiple months",
					description: "Show multiple months side by side with numberOfMonths.",
					preview: (
						<Calendar
							mode="single"
							numberOfMonths={2}
							className="rounded-2xl border"
						/>
					),
					code: `<Calendar mode="single" numberOfMonths={2} />`,
				},
				{
					title: "Disabled dates",
					description:
						"Pass a matcher function, date, or array of dates to disabled.",
					preview: (
						<Calendar
							mode="single"
							disabled={{ before: new Date() }}
							className="rounded-2xl border"
						/>
					),
					code: `// Disable all past dates
<Calendar mode="single" disabled={{ before: new Date() }} />`,
				},
			]}
			props={[
				{
					name: "mode",
					type: '"single" | "multiple" | "range"',
					description: "Selection mode.",
					required: true,
				},
				{
					name: "selected",
					type: "Date | Date[] | DateRange",
					description: "Currently selected value (controlled).",
				},
				{
					name: "onSelect",
					type: "(value) => void",
					description: "Callback fired when the selection changes.",
				},
				{
					name: "defaultMonth",
					type: "Date",
					description: "The month shown initially.",
				},
				{
					name: "numberOfMonths",
					type: "number",
					description: "Number of months to render side by side.",
				},
				{
					name: "disabled",
					type: "Matcher | Matcher[]",
					description:
						"Dates or ranges that cannot be selected. Accepts a date, object {before/after}, or function.",
				},
				{
					name: "showOutsideDays",
					type: "boolean",
					default: "true",
					description: "Show greyed-out days from adjacent months.",
				},
			]}
		/>
	);
}

function SingleCalendar() {
	const [date, setDate] = React.useState<Date>();
	return (
		<div className="flex flex-col items-center gap-3">
			<Calendar
				mode="single"
				selected={date}
				onSelect={setDate}
				className="rounded-2xl border"
			/>
			{date && (
				<p className="text-sm text-muted-foreground">
					Selected:{" "}
					<span className="font-medium text-foreground">
						{date.toLocaleDateString("en-US", {
							weekday: "long",
							year: "numeric",
							month: "long",
							day: "numeric",
						})}
					</span>
				</p>
			)}
		</div>
	);
}

function RangeCalendar() {
	const [range, setRange] = React.useState<DateRange>();
	return (
		<div className="flex flex-col items-center gap-3">
			<Calendar
				mode="range"
				selected={range}
				onSelect={setRange}
				numberOfMonths={2}
				className="rounded-2xl border"
			/>
			{range?.from && (
				<p className="text-sm text-muted-foreground">
					{range.from.toLocaleDateString()}
					{range.to ? ` → ${range.to.toLocaleDateString()}` : " → …"}
				</p>
			)}
		</div>
	);
}
