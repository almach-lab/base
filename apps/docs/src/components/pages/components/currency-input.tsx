import * as React from "react";
import { Input, Label, CurrencyFlagBadge } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function CurrencyInputPage() {
	return (
		<ComponentDoc
			name="Input.Currency"
			description="Currency input with an inline selector. 36 currencies, searchable with Popular / All groups. Fully customisable flag display via renderFlag — plug in CDN images, SVG libraries, or any React node."
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
					title: 'currencySelector="readonly"',
					description: "Currency is fixed — shows as a static badge with no dropdown. Amount remains editable.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="readonly" />
						</div>
					),
					code: `<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="readonly" />`,
				},
				{
					title: 'currencySelector="hidden"',
					description: "Entire selector hidden — only the symbol and amount are shown.",
					preview: (
						<div className="w-full max-w-xs">
							<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="hidden" />
						</div>
					),
					code: `<Input.Currency value={{ amount: 100000, currency: "IDR" }} currencySelector="hidden" />`,
				},
				{
					title: "CDN image flags",
					description: "Pass renderFlag to use real flag images from flagcdn.com (or any source).",
					preview: <CdnFlagExample />,
					code: `<Input.Currency
  renderFlag={(code) => (
    <img
      src={\`https://flagcdn.com/w20/\${code.toLowerCase()}.png\`}
      width={20}
      height={15}
      alt={code}
      className="rounded-sm object-cover"
    />
  )}
/>`,
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
					name: "defaultCurrency",
					type: "string",
					default: '"USD"',
					description: "Initial currency code when uncontrolled (no value prop). Ignored when value is supplied — use value.currency instead.",
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
					name: "renderFlag",
					type: "(countryCode: string, currency: CurrencyDef) => ReactNode",
					default: "<CurrencyFlagBadge />",
					description: "Custom flag renderer. Receives the ISO 3166-1 alpha-2 country code and the full CurrencyDef. Use for CDN images, SVG flag libraries, or any React node. Return null to hide.",
				},
				{
					name: "currencySelector",
					type: '"editable" | "readonly" | "hidden"',
					default: '"editable"',
					description: 'Controls the left selector. "editable" = dropdown; "readonly" = static badge, no dropdown; "hidden" = selector removed entirely.',
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
			{ code: "USD", symbol: "$", name: "US Dollar", countryCode: "US", popular: true },
			{ code: "EUR", symbol: "€", name: "Euro", countryCode: "EU", popular: true },
			{ code: "GBP", symbol: "£", name: "British Pound", countryCode: "GB", popular: true },
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

function CdnFlagExample() {
	const [val, setVal] = React.useState({ amount: null as number | null, currency: "USD" });
	return (
		<div className="flex w-full max-w-xs flex-col gap-2">
			<Input.Currency
				value={val}
				onChange={setVal}
				renderFlag={(code) => (
					<img
						src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
						width={20}
						height={15}
						alt={code}
						className="rounded-sm object-cover"
					/>
				)}
			/>
			<p className="text-xs text-muted-foreground">
				Flags via flagcdn.com — swap for any SVG library.
			</p>
		</div>
	);
}
