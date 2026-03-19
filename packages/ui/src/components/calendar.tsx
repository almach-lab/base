"use client";

import { DayPicker, type DayPickerProps, useDayPicker, type CalendarMonth } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";
import { buttonVariants } from "./button";

/* ── Types ────────────────────────────────────────────────────────────────── */
// DayPickerProps already includes month, defaultMonth, onMonthChange in PropsBase,
// plus all mode-specific props (selected, onSelect, etc.) via discriminated union.
export type CalendarProps = DayPickerProps;

/* ── Month picker overlay ─────────────────────────────────────────────────── */
const MONTH_NAMES = [
	"Jan", "Feb", "Mar", "Apr", "May", "Jun",
	"Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function MonthPicker({
	current,
	onSelect,
}: {
	current: Date;
	onSelect: (date: Date) => void;
}) {
	const [year, setYear] = React.useState(current.getFullYear());

	return (
		<div className="p-3 w-[280px]">
			{/* Year navigation */}
			<div className="flex items-center justify-between mb-3 px-1">
				<button
					onClick={() => setYear((y) => y - 1)}
					className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "h-7 w-7")}
					aria-label="Previous year"
				>
					<ChevronLeft className="h-4 w-4" />
				</button>
				<span className="text-sm font-semibold">{year}</span>
				<button
					onClick={() => setYear((y) => y + 1)}
					className={cn(buttonVariants({ variant: "outline", size: "icon-sm" }), "h-7 w-7")}
					aria-label="Next year"
				>
					<ChevronRight className="h-4 w-4" />
				</button>
			</div>

			{/* Month grid */}
			<div className="grid grid-cols-3 gap-1.5">
				{MONTH_NAMES.map((name, i) => {
					const isSelected =
						current.getMonth() === i && current.getFullYear() === year;
					return (
						<button
							key={name}
							onClick={() => onSelect(new Date(year, i, 1))}
							className={cn(
								"rounded-lg py-2.5 text-sm font-medium transition-colors",
								isSelected
									? "bg-foreground text-background"
									: "hover:bg-accent hover:text-accent-foreground",
							)}
						>
							{name}
						</button>
					);
				})}
			</div>
		</div>
	);
}

/* ── Custom caption (prev | Month Year | next) ────────────────────────────── */
function CalendarCaption({
	calendarMonth,
	onPickMonth,
}: {
	calendarMonth: CalendarMonth;
	onPickMonth: () => void;
}) {
	const { goToMonth, previousMonth, nextMonth } = useDayPicker();

	return (
		<div className="flex items-center justify-between gap-1 px-1">
			<button
				disabled={!previousMonth}
				onClick={() => previousMonth && goToMonth(previousMonth)}
				className={cn(
					buttonVariants({ variant: "outline", size: "icon-sm" }),
					"h-7 w-7 disabled:opacity-40",
				)}
				aria-label="Previous month"
			>
				<ChevronLeft className="h-4 w-4" />
			</button>

			<button
				onClick={onPickMonth}
				className="flex-1 text-center text-sm font-semibold transition-colors hover:text-foreground/70"
				aria-label="Pick month and year"
			>
				{calendarMonth.date.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
			</button>

			<button
				disabled={!nextMonth}
				onClick={() => nextMonth && goToMonth(nextMonth)}
				className={cn(
					buttonVariants({ variant: "outline", size: "icon-sm" }),
					"h-7 w-7 disabled:opacity-40",
				)}
				aria-label="Next month"
			>
				<ChevronRight className="h-4 w-4" />
			</button>
		</div>
	);
}

/* ── Calendar ─────────────────────────────────────────────────────────────── */
export function Calendar({
	className,
	classNames,
	showOutsideDays = true,
	month: monthProp,
	onMonthChange,
	defaultMonth,
	...props
}: CalendarProps) {
	const [displayMonth, setDisplayMonth] = React.useState<Date>(
		() => monthProp ?? defaultMonth ?? new Date(),
	);
	const [pickingMonth, setPickingMonth] = React.useState(false);

	// Sync controlled month prop
	React.useEffect(() => {
		if (monthProp) setDisplayMonth(monthProp);
	}, [monthProp]);

	const handleMonthChange = (date: Date) => {
		setDisplayMonth(date);
		onMonthChange?.(date);
	};

	if (pickingMonth) {
		return (
			<MonthPicker
				current={displayMonth}
				onSelect={(date) => {
					handleMonthChange(date);
					setPickingMonth(false);
				}}
			/>
		);
	}

	return (
		<DayPicker
			showOutsideDays={showOutsideDays}
			className={cn("p-3", className)}
			month={displayMonth}
			onMonthChange={handleMonthChange}
			classNames={{
				months: "flex flex-col sm:flex-row gap-4",
				month: "flex flex-col gap-4",
				month_caption: "flex items-center",
				caption_label: "hidden", // handled by our custom caption
				nav: "hidden",           // handled by our custom caption
				month_grid: "w-full border-collapse",
				weekdays: "flex",
				weekday:
					"text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] flex items-center justify-center",
				week: "flex w-full mt-2",
				day: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
				day_button: cn(
					"h-9 w-9 rounded-md p-0 font-normal",
					"inline-flex items-center justify-center",
					"transition-colors",
					"hover:bg-accent hover:text-accent-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
					"aria-selected:opacity-100",
				),
				selected:
					"[&>button]:bg-foreground [&>button]:text-background [&>button]:hover:bg-foreground/90 [&>button]:rounded-md",
				today: "[&>button]:bg-accent [&>button]:text-accent-foreground",
				outside:
					"text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:opacity-30",
				disabled: "text-muted-foreground opacity-50",
				range_start:
					"[&>button]:bg-foreground [&>button]:text-background [&>button]:rounded-l-md [&>button]:rounded-r-none",
				range_end:
					"[&>button]:bg-foreground [&>button]:text-background [&>button]:rounded-r-md [&>button]:rounded-l-none",
				range_middle:
					"[&>button]:bg-accent [&>button]:text-accent-foreground [&>button]:rounded-none",
				hidden: "invisible",
				...classNames,
			}}
			components={{
				// Nav handled inline in MonthCaption — suppress default nav
				Nav: () => <></>,
				MonthCaption: ({ calendarMonth }) => (
					<CalendarCaption
						calendarMonth={calendarMonth}
						onPickMonth={() => setPickingMonth(true)}
					/>
				),
			}}
			{...props}
		/>
	);
}
