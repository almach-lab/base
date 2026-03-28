"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";
import { Calendar } from "./calendar.js";
import { InputCurrency } from "./currency-input.js";

/* ── Base Input ───────────────────────────────────────────────────────────── */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	leftElement?: React.ReactNode;
	rightElement?: React.ReactNode;
	error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, leftElement, rightElement, error, ...props }, ref) => {
		return (
			<div className="relative flex items-center w-full">
				{leftElement && (
					<div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
						{leftElement}
					</div>
				)}
				<input
					type={type}
					className={cn(
						"flex h-9 w-full rounded-lg border border-input bg-background text-sm",
						"transition-all duration-150",
						"placeholder:text-muted-foreground",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
						"disabled:cursor-not-allowed disabled:opacity-50",
						"file:border-0 file:bg-transparent file:text-sm file:font-medium",
						leftElement ? "pl-9 pr-3" : "px-3",
						rightElement ? "pr-9" : "",
						!leftElement && !rightElement && "px-3",
						error && "border-destructive focus-visible:ring-destructive",
						className
					)}
					ref={ref}
					aria-invalid={error}
					{...props}
				/>
				{rightElement && (
					<div className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
						{rightElement}
					</div>
				)}
			</div>
		);
	}
);
Input.displayName = "Input";

/* ── Date Input ───────────────────────────────────────────────────────────── */
export interface InputDateProps {
	id?: string;
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	disabled?: boolean;
	error?: boolean;
	/** Show calendar picker button inside the input */
	withCalendar?: boolean;
	/**
	 * Date format controlling segment order and separator.
	 * Tokens: MM (month), DD (day), YYYY (year).
	 * @example "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY"
	 * @default "MM/DD/YYYY"
	 */
	format?: string;
	className?: string;
}

type SegKey = "month" | "day" | "year";
const SEG_LIMITS: Record<SegKey, { min: number; max: number; len: number }> = {
	month: { min: 1, max: 12, len: 2 },
	day: { min: 1, max: 31, len: 2 },
	year: { min: 1900, max: 2100, len: 4 },
};

/** Supported tokens: MM, DD, YYYY. Separator = first non-token char. */
function parseFormat(fmt: string): { order: SegKey[]; sep: string } {
	const sep = fmt.replace(/MM|DD|YYYY/g, "")[0] ?? "/";
	const order: SegKey[] = fmt.split(sep).map((p) =>
		p === "MM" ? "month" : p === "DD" ? "day" : "year"
	);
	return { order, sep };
}

function dateToSegments(date: Date) {
	return {
		month: String(date.getMonth() + 1).padStart(2, "0"),
		day: String(date.getDate()).padStart(2, "0"),
		year: String(date.getFullYear()),
	};
}

const SEG_PLACEHOLDER: Record<SegKey, string> = { month: "MM", day: "DD", year: "YYYY" };

function InputDate({
	id,
	value,
	onChange,
	disabled,
	error,
	withCalendar = false,
	format = "MM/DD/YYYY",
	className,
}: InputDateProps) {
	const { order: SEG_ORDER, sep } = React.useMemo(() => parseFormat(format), [format]);

	const [seg, setSeg] = React.useState(() =>
		value && !isNaN(value.getTime())
			? dateToSegments(value)
			: { month: "", day: "", year: "" },
	);
	const [active, setActive] = React.useState<SegKey | null>(null);
	const [calOpen, setCalOpen] = React.useState(false);

	const refs = {
		month: React.useRef<HTMLInputElement>(null),
		day: React.useRef<HTMLInputElement>(null),
		year: React.useRef<HTMLInputElement>(null),
	};

	React.useEffect(() => {
		if (!value) { setSeg({ month: "", day: "", year: "" }); return; }
		if (isNaN(value.getTime())) return;
		const next = dateToSegments(value);
		setSeg((prev) =>
			prev.month === next.month && prev.day === next.day && prev.year === next.year
				? prev : next,
		);
	}, [value]);

	const emit = (next: typeof seg) => {
		const m = parseInt(next.month, 10);
		const d = parseInt(next.day, 10);
		const y = parseInt(next.year, 10);
		if (m && d && y && next.year.length === 4) {
			const date = new Date(y, m - 1, d);
			if (!isNaN(date.getTime()) && date.getMonth() === m - 1) {
				onChange?.(date); return;
			}
		}
		onChange?.(undefined);
	};

	const focus = (key: SegKey) => refs[key].current?.focus();
	const focusNext = (key: SegKey) => { const n = SEG_ORDER[SEG_ORDER.indexOf(key) + 1]; if (n) focus(n); };
	const focusPrev = (key: SegKey) => { const p = SEG_ORDER[SEG_ORDER.indexOf(key) - 1]; if (p) focus(p); };

	// When format changes, move focus to first segment
	React.useEffect(() => { const first = SEG_ORDER[0]; if (first) focus(first); }, [format]); // eslint-disable-line react-hooks/exhaustive-deps

	const handleKeyDown = (key: SegKey, e: React.KeyboardEvent<HTMLInputElement>) => {
		const { min, max, len } = SEG_LIMITS[key];
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			const cur = parseInt(seg[key], 10) || min;
			const next = String(Math.min(Math.max(cur + (e.key === "ArrowUp" ? 1 : -1), min), max)).padStart(len, "0");
			const nextSeg = { ...seg, [key]: next };
			setSeg(nextSeg); emit(nextSeg); return;
		}
		if (e.key === "ArrowLeft") { e.preventDefault(); focusPrev(key); }
		if (e.key === "ArrowRight" || e.key === sep) { e.preventDefault(); focusNext(key); }
		if (e.key === "Backspace" && !seg[key]) focusPrev(key);
	};

	const handleChange = (key: SegKey, raw: string) => {
		const { min, max, len } = SEG_LIMITS[key];
		const digits = raw.replace(/\D/g, "").slice(-len);
		let val = digits;
		if (digits.length === len) {
			const n = parseInt(digits, 10);
			if (n > max) val = String(max).padStart(len, "0");
			else if (n < min) val = String(min).padStart(len, "0");
		}
		const nextSeg = { ...seg, [key]: val };
		setSeg(nextSeg); emit(nextSeg);
		const shouldAdvance =
			val.length === len ||
			(key === "month" && parseInt(val, 10) > 1 && val.length === 1) ||
			(key === "day" && parseInt(val, 10) > 3 && val.length === 1);
		if (shouldAdvance) focusNext(key);
	};

	const handleCalendarSelect = (date: Date | undefined) => {
		if (date) { setSeg(dateToSegments(date)); onChange?.(date); }
		setCalOpen(false);
	};

	const calValue = (() => {
		const m = parseInt(seg.month, 10), d = parseInt(seg.day, 10), y = parseInt(seg.year, 10);
		if (m && d && y && seg.year.length === 4) {
			const dt = new Date(y, m - 1, d);
			if (!isNaN(dt.getTime()) && dt.getMonth() === m - 1) return dt;
		}
		return undefined;
	})();

	const segClass = (key: SegKey) =>
		cn(
			"bg-transparent text-center outline-none tabular-nums caret-transparent select-none",
			"rounded transition-colors duration-100",
			"placeholder:text-muted-foreground/50",
			key === "year" ? "w-[3.2rem]" : "w-8",
			active === key && "bg-primary/10 text-primary",
		);

	const mkProps = (key: SegKey, ph: string) => ({
		ref: refs[key],
		type: "text" as const,
		value: seg[key],
		placeholder: ph,
		maxLength: SEG_LIMITS[key].len,
		disabled,
		inputMode: "numeric" as const,
		"aria-label": key,
		className: segClass(key),
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleChange(key, e.target.value),
		onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(key, e),
		onFocus: () => setActive(key),
		onBlur: () => setActive(null),
	});

	return (
		<div
			id={id}
			role="group"
			aria-label="Date input"
			className={cn(
				"flex h-9 w-full items-center rounded-lg border border-input bg-background px-3 text-sm",
				"ring-offset-background transition-all duration-150",
				"focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				error && "border-destructive focus-within:ring-destructive",
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}
			onClick={() => { if (!active) { const first = SEG_ORDER[0]; if (first) focus(first); } }}
		>
			{SEG_ORDER.map((key, i) => (
				<React.Fragment key={key}>
					{i > 0 && (
						<span className="mx-0.5 select-none text-muted-foreground/40" aria-hidden="true">
							{sep}
						</span>
					)}
					<input {...mkProps(key, SEG_PLACEHOLDER[key])} />
				</React.Fragment>
			))}

			{withCalendar && (
				<PopoverPrimitive.Root open={calOpen} onOpenChange={setCalOpen}>
					<PopoverPrimitive.Trigger asChild>
						<button
							type="button"
							disabled={disabled}
							aria-label="Open calendar"
							aria-haspopup="dialog"
							aria-expanded={calOpen}
							className={cn(
								"ml-auto flex items-center justify-center rounded-md p-0.5",
								"text-muted-foreground transition-colors",
								"hover:bg-accent hover:text-foreground",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								"disabled:pointer-events-none",
							)}
						>
							<CalendarIcon className="h-4 w-4" aria-hidden="true" />
						</button>
					</PopoverPrimitive.Trigger>

					<PopoverPrimitive.Portal>
						<PopoverPrimitive.Content
							align="end"
							sideOffset={6}
							className={cn(
								"z-50 overflow-hidden rounded-xl border bg-popover shadow-xl",
								"data-[state=open]:animate-in data-[state=closed]:animate-out",
								"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
								"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
							)}
						>
							<Calendar
								mode="single"
								selected={calValue}
								onSelect={handleCalendarSelect}
								defaultMonth={calValue ?? new Date()}
								initialFocus
							/>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Portal>
				</PopoverPrimitive.Root>
			)}
		</div>
	);
}
InputDate.displayName = "Input.Date";

/* ── Compound export ──────────────────────────────────────────────────────── */
const InputCompound = Object.assign(Input, {
	Date: InputDate,
	Currency: InputCurrency,
});

export { InputCompound as Input };

// Backward-compat alias
export const DateInput = InputDate;
export type { InputDateProps as DateInputProps };
