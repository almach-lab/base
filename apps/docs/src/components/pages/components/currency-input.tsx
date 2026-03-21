import * as React from "react";
import { Input, Label } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function CurrencyInputPage() {
	return (
		<ComponentDoc
			name="Input.Currency"
			description="A currency input with an inline currency selector. Pick from 36 currencies (8 popular, searchable), with a flag + code trigger, vertical divider, symbol prefix, and right-aligned amount that formats on blur."
			examples={[
				{
					title: "Default",
					description: "Defaults to USD. Click the flag/code button to change currency.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency />
						</div>
					),
					code: `<Input.Currency />`,
				},
				{
					title: "Controlled",
					description: "Bind value and onChange to manage amount and currency in state.",
					preview: <ControlledExample />,
					code: `const [val, setVal] = React.useState({ amount: 1234.5, currency: "EUR" });

<Input.Currency value={val} onChange={setVal} />
{val.amount !== null && (
  <p className="text-sm text-muted-foreground">
    {val.currency} {val.amount.toLocaleString()}
  </p>
)}`,
				},
				{
					title: "With label",
					description: "Pair with a Label using a matching id for accessibility.",
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
					title: "Error state",
					description: "Pass error to show a destructive border and focus ring.",
					preview: (
						<div className="w-full max-w-xs space-y-1.5">
							<Label htmlFor="price-err" required>Amount</Label>
							<Input.Currency id="price-err" error value={{ amount: null, currency: "USD" }} />
							<p className="text-xs text-destructive">Please enter a valid amount.</p>
						</div>
					),
					code: `<Label htmlFor="price" required>Amount</Label>
<Input.Currency id="price" error />
<p className="text-xs text-destructive">Please enter a valid amount.</p>`,
					centered: false,
				},
				{
					title: "Disabled",
					description: "Prevents interaction with both the amount field and currency selector.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency value={{ amount: 9999, currency: "GBP" }} disabled />
						</div>
					),
					code: `<Input.Currency value={{ amount: 9999, currency: "GBP" }} disabled />`,
				},
				{
					title: "Read-only currency",
					description: "Pass readOnlyCurrency to lock the selector — only the amount remains editable.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency value={{ amount: 100000, currency: "IDR" }} readOnlyCurrency />
						</div>
					),
					code: `<Input.Currency value={{ amount: 100000, currency: "IDR" }} readOnlyCurrency />`,
				},
				{
					title: "Currency search",
					description: "Open the selector and type to filter by code, name, or symbol.",
					preview: <SearchExample />,
					code: `// Open the dropdown and search "kr" to find NOK, SEK, DKK
<Input.Currency />`,
				},
				{
					title: "Custom currency list",
					description: "Supply a custom currencies array to restrict options.",
					preview: <CustomCurrenciesExample />,
					code: `import { CURRENCIES } from "@almach/ui";

const LIMITED = CURRENCIES.filter((c) =>
  ["USD", "EUR", "GBP"].includes(c.code)
);

<Input.Currency currencies={LIMITED} />`,
				},
			]}
			props={[
				{
					name: "value",
					type: "{ amount: number | null; currency: string }",
					description: "Controlled value — the numeric amount and ISO currency code.",
				},
				{
					name: "onChange",
					type: "(value: { amount: number | null; currency: string }) => void",
					description: "Called on every amount keystroke and on currency change.",
				},
				{
					name: "currencies",
					type: "CurrencyDef[]",
					description:
						"Override the currency list. Defaults to the built-in CURRENCIES (36 entries). Mark currencies with popular: true to show them in the 'Popular' group.",
				},
				{
					name: "placeholder",
					type: "string",
					default: '"0.00"',
					description: "Placeholder shown in the amount field when empty.",
				},
				{
					name: "readOnlyCurrency",
					type: "boolean",
					default: "false",
					description: "Locks the currency selector. Shows the code as static text — no dropdown, no chevron. Amount field remains editable.",
				},
				{
					name: "error",
					type: "boolean",
					default: "false",
					description: "Applies destructive border and focus ring; sets aria-invalid on the amount input.",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Disables both the amount input and the currency selector button.",
				},
				{
					name: "id",
					type: "string",
					description: "Forwarded to the inner amount input for label association.",
				},
				{
					name: "className",
					type: "string",
					description: "Extra classes applied to the outer wrapper div.",
				},
			]}
		/>
	);
}

/* ── Demos ────────────────────────────────────────────────────────────────── */

function ControlledExample() {
	const [val, setVal] = React.useState({ amount: 1234.5, currency: "EUR" });
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

function SearchExample() {
	const [val, setVal] = React.useState({ amount: null as number | null, currency: "NOK" });
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<Input.Currency value={val} onChange={setVal} />
			<p className="text-xs text-muted-foreground">
				Try searching "kr" to find NOK, SEK, DKK — or "peso" for Latin currencies.
			</p>
		</div>
	);
}

function CustomCurrenciesExample() {
	const [val, setVal] = React.useState({ amount: null as number | null, currency: "USD" });
	const limited = React.useMemo(
		() => [
			{ code: "USD", symbol: "$", name: "US Dollar", flag: "🇺🇸", popular: true },
			{ code: "EUR", symbol: "€", name: "Euro", flag: "🇪🇺", popular: true },
			{ code: "GBP", symbol: "£", name: "British Pound", flag: "🇬🇧", popular: true },
		],
		[],
	);
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<Input.Currency value={val} onChange={setVal} currencies={limited} />
			<p className="text-xs text-muted-foreground">Only USD, EUR, GBP available.</p>
		</div>
	);
}
