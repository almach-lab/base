import * as React from "react";
import { Input, Label } from "@almach/ui";
import { Eye, EyeOff, Mail, Search } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function InputPage() {
	return (
		<ComponentDoc
			name="Input"
			description="Text field with left/right element slots, a segmented date sub-component, and a multi-currency amount input. Use Input.Date for date entry and Input.Currency for currency amounts."
			examples={[
				{
					title: "Default",
					description: "Always pair with a Label using matching id and htmlFor.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="email-demo">Email address</Label>
							<Input id="email-demo" type="email" placeholder="john@example.com" />
						</div>
					),
					code: `<Label htmlFor="email">Email address</Label>
<Input id="email" type="email" placeholder="john@example.com" />`,
					centered: false,
				},
				{
					title: "With icon elements",
					description:
						"leftElement accepts non-interactive decorations; rightElement accepts buttons or icons.",
					preview: (
						<div className="w-full max-w-sm space-y-3">
							<Input
								leftElement={<Search className="h-4 w-4" />}
								placeholder="Search…"
							/>
							<Input
								placeholder="Enter email…"
								rightElement={<Mail className="h-4 w-4" />}
							/>
						</div>
					),
					code: `<Input
  leftElement={<Search className="h-4 w-4" />}
  placeholder="Search…"
/>
<Input
  placeholder="Enter email…"
  rightElement={<Mail className="h-4 w-4" />}
/>`,
					centered: false,
				},
				{
					title: "Password with toggle",
					description:
						"rightElement supports interactive elements like buttons.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="pw-demo">Password</Label>
							<PasswordInput />
						</div>
					),
					code: `function PasswordInput() {
  const [show, setShow] = React.useState(false);
  return (
    <Input
      type={show ? "text" : "password"}
      placeholder="Enter password…"
      rightElement={
        <button
          type="button"
          aria-label={show ? "Hide password" : "Show password"}
          onClick={() => setShow((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {show
            ? <EyeOff className="h-4 w-4" />
            : <Eye className="h-4 w-4" />
          }
        </button>
      }
    />
  );
}`,
					centered: false,
				},
				{
					title: "Error state",
					description:
						"Pass error to apply a destructive ring and set aria-invalid for screen readers.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5">
							<Label htmlFor="err-demo" required>
								Email
							</Label>
							<Input id="err-demo" error defaultValue="not-an-email" />
							<p className="text-xs text-destructive">
								Enter a valid email address.
							</p>
						</div>
					),
					code: `<Label htmlFor="email" required>Email</Label>
<Input id="email" error defaultValue="not-an-email" />
<p className="text-xs text-destructive">Enter a valid email address.</p>`,
					centered: false,
				},
				{
					title: "Disabled",
					description:
						"Disabled inputs are non-interactive and render at 50% opacity.",
					preview: (
						<div className="w-full max-w-sm space-y-1.5 opacity-50">
							<Label htmlFor="dis-demo" className="cursor-not-allowed">
								Username
							</Label>
							<Input
								id="dis-demo"
								disabled
								defaultValue="alice_johnson"
							/>
						</div>
					),
					code: `<div className="opacity-50">
  <Label htmlFor="username" className="cursor-not-allowed">Username</Label>
  <Input id="username" disabled defaultValue="alice_johnson" />
</div>`,
					centered: false,
				},
				{
					title: "Input.Date — Default (MM/DD/YYYY)",
					description: "Click a segment and type, or use ↑ ↓ arrow keys. Press / or → to advance between segments.",
					preview: <Input.Date />,
					code: `<Input.Date />`,
				},
				{
					title: "Input.Date — Format: DD/MM/YYYY",
					description: "Day-first format common in Europe and most of the world.",
					preview: <Input.Date format="DD/MM/YYYY" />,
					code: `<Input.Date format="DD/MM/YYYY" />`,
				},
				{
					title: "Input.Date — Format: DD-MM-YYYY",
					description: "Dash-separated day-first format.",
					preview: <Input.Date format="DD-MM-YYYY" />,
					code: `<Input.Date format="DD-MM-YYYY" />`,
				},
				{
					title: "Input.Date — Format: YYYY-MM-DD",
					description: "ISO 8601 format — year first, dash separator.",
					preview: <Input.Date format="YYYY-MM-DD" />,
					code: `<Input.Date format="YYYY-MM-DD" />`,
				},
				{
					title: "Input.Date — Format switcher",
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
					title: "Input.Date — With calendar",
					description: "Add withCalendar to show a calendar icon that opens a date picker popover.",
					preview: <CalendarDateInput />,
					code: `const [date, setDate] = React.useState<Date>();

<Input.Date withCalendar value={date} onChange={setDate} />`,
				},
				{
					title: "Input.Date — Controlled",
					description: "Bind value and onChange to manage the date in state.",
					preview: <ControlledDateInput />,
					code: `const [date, setDate] = React.useState<Date>(new Date());

<Input.Date value={date} onChange={setDate} />
{date && <p className="text-sm">{date.toLocaleDateString()}</p>}`,
				},
				{
					title: "Input.Date — With label",
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
					title: "Input.Date — Error state",
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
					title: "Input.Date — Disabled",
					description: "Dims the field and prevents interaction.",
					preview: <Input.Date value={new Date(1990, 5, 15)} disabled />,
					code: `<Input.Date value={new Date(1990, 5, 15)} disabled />`,
				},
				// ── Input.Currency ──────────────────────────────────────────
				{
					title: "Input.Currency — Default",
					description: "Defaults to USD. Click the flag/code button to open the currency selector.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency />
						</div>
					),
					code: `<Input.Currency />`,
					centered: false,
				},
				{
					title: "Input.Currency — Controlled",
					description: "Bind value and onChange to manage amount and currency in state.",
					preview: <CurrencyControlled />,
					code: `const [val, setVal] = React.useState({ amount: 1234.5, currency: "EUR" });

<Input.Currency value={val} onChange={setVal} />`,
					centered: false,
				},
				{
					title: "Input.Currency — With label",
					description: "Pair with Label using a matching id for accessibility.",
					preview: (
						<div className="w-full max-w-xs space-y-1.5">
							<Label htmlFor="price-demo">Price</Label>
							<Input.Currency id="price-demo" />
						</div>
					),
					code: `<Label htmlFor="price">Price</Label>
<Input.Currency id="price" />`,
					centered: false,
				},
				{
					title: "Input.Currency — Error state",
					description: "Pass error to show a destructive border and focus ring.",
					preview: (
						<div className="w-full max-w-xs space-y-1.5">
							<Label htmlFor="price-err" required>Amount</Label>
							<Input.Currency id="price-err" error />
							<p className="text-xs text-destructive">Please enter a valid amount.</p>
						</div>
					),
					code: `<Label htmlFor="price" required>Amount</Label>
<Input.Currency id="price" error />
<p className="text-xs text-destructive">Please enter a valid amount.</p>`,
					centered: false,
				},
				{
					title: 'Input.Currency — Selector modes',
					description: 'currencySelector controls the left side: "editable" (default), "readonly" (static badge), or "hidden" (removed).',
					preview: (
						<div className="w-full max-w-xs space-y-2">
							<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="readonly" />
							<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="hidden" />
						</div>
					),
					code: `<Input.Currency currencySelector="readonly" />
<Input.Currency currencySelector="hidden" />`,
					centered: false,
				},
				{
					title: "Input.Currency — Disabled",
					description: "Disables both the amount input and the currency selector.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency value={{ amount: 9999, currency: "GBP" }} disabled />
						</div>
					),
					code: `<Input.Currency value={{ amount: 9999, currency: "GBP" }} disabled />`,
					centered: false,
				},
			]}
			props={[
				{
					name: "leftElement",
					type: "ReactNode",
					description:
						"Non-interactive content in the left slot (icon, currency symbol, etc.).",
				},
				{
					name: "rightElement",
					type: "ReactNode",
					description:
						"Content in the right slot. Interactive elements (buttons) are supported.",
				},
				{
					name: "error",
					type: "boolean",
					default: "false",
					description:
						"Applies a destructive ring and sets aria-invalid for validation feedback.",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Prevents interaction. Renders at 50% opacity with a not-allowed cursor.",
				},
				{
					name: "type",
					type: "string",
					default: '"text"',
					description: "Standard HTML input type (email, password, number, etc.).",
				},
				{
					name: "Input.Date — format",
					type: "string",
					default: '"MM/DD/YYYY"',
					description: 'Controls segment order and separator. Tokens: MM, DD, YYYY. Examples: "DD/MM/YYYY" | "YYYY-MM-DD" | "DD-MM-YYYY".',
				},
				{
					name: "Input.Date — value",
					type: "Date",
					description: "Controlled date value.",
				},
				{
					name: "Input.Date — onChange",
					type: "(date: Date | undefined) => void",
					description: "Called when all segments form a valid date, or undefined when incomplete.",
				},
				{
					name: "Input.Date — withCalendar",
					type: "boolean",
					default: "false",
					description: "Show a calendar icon button that opens a date picker popover.",
				},
				{
					name: "Input.Date — disabled",
					type: "boolean",
					description: "Disables all segments and the calendar button.",
				},
				{
					name: "Input.Date — error",
					type: "boolean",
					description: "Applies destructive border and focus ring.",
				},
				{
					name: "Input.Currency — value",
					type: "{ amount: number | null; currency: string }",
					description: "Controlled value — the numeric amount and ISO currency code.",
				},
				{
					name: "Input.Currency — onChange",
					type: "(value: { amount: number | null; currency: string }) => void",
					description: "Called on every amount keystroke and on currency change.",
				},
				{
					name: "Input.Currency — renderFlag",
					type: "(countryCode: string, currency: CurrencyDef) => ReactNode",
					default: "<CurrencyFlagBadge />",
					description: "Custom flag renderer — use CDN images, SVG libraries, or any React node. countryCode is ISO 3166-1 alpha-2.",
				},
				{
					name: "Input.Currency — currencies",
					type: "CurrencyDef[]",
					description: "Override the currency list. Defaults to the built-in CURRENCIES (36 entries). Mark entries with popular: true to show them in the Popular group.",
				},
				{
					name: "Input.Currency — placeholder",
					type: "string",
					default: '"0.00"',
					description: "Placeholder shown in the amount field when empty.",
				},
				{
					name: "Input.Currency — currencySelector",
					type: '"editable" | "readonly" | "hidden"',
					default: '"editable"',
					description: 'Controls the left selector. "editable" = dropdown; "readonly" = static badge, no dropdown; "hidden" = entire selector removed.',
				},
				{
					name: "Input.Currency — error",
					type: "boolean",
					default: "false",
					description: "Applies destructive border and focus ring; sets aria-invalid on the amount input.",
				},
				{
					name: "Input.Currency — disabled",
					type: "boolean",
					default: "false",
					description: "Disables both the amount input and the currency selector button.",
				},
			]}
		/>
	);
}

function PasswordInput() {
	const [show, setShow] = React.useState(false);
	return (
		<Input
			id="pw-demo"
			type={show ? "text" : "password"}
			placeholder="Enter password…"
			rightElement={
				<button
					type="button"
					aria-label={show ? "Hide password" : "Show password"}
					onClick={() => setShow((v) => !v)}
					className="text-muted-foreground hover:text-foreground transition-colors"
				>
					{show ? (
						<EyeOff className="h-4 w-4" />
					) : (
						<Eye className="h-4 w-4" />
					)}
				</button>
			}
		/>
	);
}

// ── Input.Date Demos ─────────────────────────────────────────────────────────

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

// ── Input.Currency Demos ──────────────────────────────────────────────────────

function CurrencyControlled() {
	const [val, setVal] = React.useState({ amount: 1234.5 as number | null, currency: "EUR" });
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<Input.Currency value={val} onChange={setVal} />
			{val.amount !== null && (
				<p className="text-sm text-muted-foreground">
					{val.currency}{" "}
					<span className="font-medium text-foreground tabular-nums">
						{val.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
					</span>
				</p>
			)}
		</div>
	);
}
