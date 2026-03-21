"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronDown, Search, X } from "lucide-react";
import * as React from "react";

import { cn } from "@almach/utils";

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface CurrencyDef {
	code: string;
	symbol: string;
	name: string;
	flag?: string;
	popular?: boolean;
}

export interface CurrencyValue {
	amount: number | null;
	currency: string;
}

export interface InputCurrencyProps {
	id?: string;
	value?: CurrencyValue;
	onChange?: (value: CurrencyValue) => void;
	/** Override the full currency list. Defaults to built-in CURRENCIES. */
	currencies?: CurrencyDef[];
	placeholder?: string;
	/** Prevent the user from changing the selected currency. */
	readOnlyCurrency?: boolean;
	disabled?: boolean;
	error?: boolean;
	className?: string;
}

/* ── Currency list ────────────────────────────────────────────────────────── */

export const CURRENCIES: CurrencyDef[] = [
	/* ── Popular ── */
	{ code: "USD", symbol: "$",    name: "US Dollar",          flag: "🇺🇸", popular: true },
	{ code: "EUR", symbol: "€",    name: "Euro",               flag: "🇪🇺", popular: true },
	{ code: "GBP", symbol: "£",    name: "British Pound",      flag: "🇬🇧", popular: true },
	{ code: "JPY", symbol: "¥",    name: "Japanese Yen",       flag: "🇯🇵", popular: true },
	{ code: "CHF", symbol: "Fr",   name: "Swiss Franc",        flag: "🇨🇭", popular: true },
	{ code: "AUD", symbol: "A$",   name: "Australian Dollar",  flag: "🇦🇺", popular: true },
	{ code: "CAD", symbol: "C$",   name: "Canadian Dollar",    flag: "🇨🇦", popular: true },
	{ code: "CNY", symbol: "¥",    name: "Chinese Yuan",       flag: "🇨🇳", popular: true },
	/* ── All ── */
	{ code: "INR", symbol: "₹",    name: "Indian Rupee",       flag: "🇮🇳" },
	{ code: "BRL", symbol: "R$",   name: "Brazilian Real",     flag: "🇧🇷" },
	{ code: "MXN", symbol: "$",    name: "Mexican Peso",       flag: "🇲🇽" },
	{ code: "KRW", symbol: "₩",    name: "South Korean Won",   flag: "🇰🇷" },
	{ code: "SGD", symbol: "S$",   name: "Singapore Dollar",   flag: "🇸🇬" },
	{ code: "HKD", symbol: "HK$",  name: "Hong Kong Dollar",   flag: "🇭🇰" },
	{ code: "NOK", symbol: "kr",   name: "Norwegian Krone",    flag: "🇳🇴" },
	{ code: "SEK", symbol: "kr",   name: "Swedish Krona",      flag: "🇸🇪" },
	{ code: "DKK", symbol: "kr",   name: "Danish Krone",       flag: "🇩🇰" },
	{ code: "NZD", symbol: "NZ$",  name: "New Zealand Dollar", flag: "🇳🇿" },
	{ code: "ZAR", symbol: "R",    name: "South African Rand", flag: "🇿🇦" },
	{ code: "TRY", symbol: "₺",    name: "Turkish Lira",       flag: "🇹🇷" },
	{ code: "AED", symbol: "د.إ",  name: "UAE Dirham",         flag: "🇦🇪" },
	{ code: "SAR", symbol: "﷼",    name: "Saudi Riyal",        flag: "🇸🇦" },
	{ code: "PLN", symbol: "zł",   name: "Polish Złoty",       flag: "🇵🇱" },
	{ code: "CZK", symbol: "Kč",   name: "Czech Koruna",       flag: "🇨🇿" },
	{ code: "HUF", symbol: "Ft",   name: "Hungarian Forint",   flag: "🇭🇺" },
	{ code: "THB", symbol: "฿",    name: "Thai Baht",          flag: "🇹🇭" },
	{ code: "IDR", symbol: "Rp",   name: "Indonesian Rupiah",  flag: "🇮🇩" },
	{ code: "MYR", symbol: "RM",   name: "Malaysian Ringgit",  flag: "🇲🇾" },
	{ code: "PHP", symbol: "₱",    name: "Philippine Peso",    flag: "🇵🇭" },
	{ code: "VND", symbol: "₫",    name: "Vietnamese Dong",    flag: "🇻🇳" },
	{ code: "ILS", symbol: "₪",    name: "Israeli Shekel",     flag: "🇮🇱" },
	{ code: "EGP", symbol: "E£",   name: "Egyptian Pound",     flag: "🇪🇬" },
	{ code: "NGN", symbol: "₦",    name: "Nigerian Naira",     flag: "🇳🇬" },
	{ code: "UAH", symbol: "₴",    name: "Ukrainian Hryvnia",  flag: "🇺🇦" },
	{ code: "CLP", symbol: "$",    name: "Chilean Peso",       flag: "🇨🇱" },
	{ code: "COP", symbol: "$",    name: "Colombian Peso",     flag: "🇨🇴" },
	{ code: "PEN", symbol: "S/",   name: "Peruvian Sol",       flag: "🇵🇪" },
];

/* ── Helpers ──────────────────────────────────────────────────────────────── */

/**
 * Derive the 2-letter ISO country code from a regional-indicator flag emoji.
 * "🇮🇩" → "ID", "🇺🇸" → "US", "🇪🇺" → "EU"
 * Used to render a reliable cross-platform badge instead of the emoji itself.
 */
function flagToCode(flag: string): string {
	return [...flag]
		.map((char) => {
			const cp = char.codePointAt(0);
			return cp && cp >= 0x1f1e6 && cp <= 0x1f1ff
				? String.fromCharCode(cp - 0x1f1e6 + 65)
				: "";
		})
		.join("");
}

/** Strip formatting, parse to number or null. */
function parseAmount(raw: string): number | null {
	const str = raw.trim().replace(/,/g, "");
	if (!str) return null;
	const n = parseFloat(str);
	return isNaN(n) ? null : n;
}

/** Final format via Intl (used on blur and for controlled-value sync). */
function formatAmount(amount: number): string {
	return new Intl.NumberFormat(undefined, {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	}).format(amount);
}

/**
 * Live formatting while the user types.
 * Adds thousand-separators to the integer part; preserves trailing decimal.
 * Input must already be sanitized (digits + at most one dot).
 */
function applyThousandSeparator(raw: string): string {
	if (!raw) return "";
	const dotIdx = raw.indexOf(".");
	const intPart = dotIdx >= 0 ? raw.slice(0, dotIdx) : raw;
	const decPart = dotIdx >= 0 ? raw.slice(dotIdx) : ""; // includes the "."
	const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return formattedInt + decPart;
}

/* ── CurrencyOption ───────────────────────────────────────────────────────── */

interface CurrencyOptionProps {
	currency: CurrencyDef;
	selected: boolean;
	onSelect: (code: string) => void;
}

function CurrencyOption({ currency, selected, onSelect }: CurrencyOptionProps) {
	return (
		<button
			type="button"
			role="option"
			aria-selected={selected}
			onClick={() => onSelect(currency.code)}
			className={cn(
				"flex w-full items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors",
				"hover:bg-accent hover:text-accent-foreground",
				"focus-visible:outline-none focus-visible:bg-accent focus-visible:text-accent-foreground",
				selected && "bg-primary/10 text-primary",
			)}
		>
			{currency.flag && (
				<span className="shrink-0 text-base leading-none" aria-hidden="true">
					{currency.flag}
				</span>
			)}
			<span className="w-10 shrink-0 font-mono text-xs font-semibold tabular-nums text-muted-foreground">
				{currency.code}
			</span>
			<span className="flex-1 truncate text-left">{currency.name}</span>
			<Check
				className={cn(
					"h-3.5 w-3.5 shrink-0 transition-opacity",
					selected ? "opacity-100 text-primary" : "opacity-0",
				)}
				aria-hidden="true"
			/>
		</button>
	);
}

/* ── InputCurrency ────────────────────────────────────────────────────────── */

export function InputCurrency({
	id,
	value,
	onChange,
	currencies = CURRENCIES,
	placeholder = "0.00",
	readOnlyCurrency = false,
	disabled,
	error,
	className,
}: InputCurrencyProps) {
	const [currency, setCurrency] = React.useState(value?.currency ?? "USD");
	const [displayValue, setDisplayValue] = React.useState<string>(() =>
		value?.amount != null ? formatAmount(value.amount) : "",
	);
	const [selectorOpen, setSelectorOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");

	const inputRef = React.useRef<HTMLInputElement>(null);
	const searchRef = React.useRef<HTMLInputElement>(null);

	/* Sync controlled currency */
	React.useEffect(() => {
		if (value?.currency !== undefined && value.currency !== currency) {
			setCurrency(value.currency);
		}
	}, [value?.currency]); // eslint-disable-line react-hooks/exhaustive-deps

	/* Sync controlled amount */
	React.useEffect(() => {
		setDisplayValue(value?.amount != null ? formatAmount(value.amount) : "");
	}, [value?.amount]);

	const selectedCurrency = currencies.find((c) => c.code === currency) ?? currencies[0]!;

	/* Filtered lists */
	const filterList = React.useCallback(
		(list: CurrencyDef[]) => {
			if (!search) return list;
			const q = search.toLowerCase();
			return list.filter(
				(c) =>
					c.code.toLowerCase().includes(q) ||
					c.name.toLowerCase().includes(q) ||
					c.symbol.toLowerCase().includes(q),
			);
		},
		[search],
	);

	const popularList = filterList(currencies.filter((c) => c.popular));
	const otherList = filterList(currencies.filter((c) => !c.popular));
	const noResults = popularList.length === 0 && otherList.length === 0;

	/* Handlers */
	const selectCurrency = (code: string) => {
		setCurrency(code);
		setSelectorOpen(false);
		setSearch("");
		onChange?.({ amount: parseAmount(displayValue), currency: code });
		setTimeout(() => inputRef.current?.focus(), 0);
	};

	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		// Strip commas and non-numeric chars (keep one decimal point)
		const raw = e.target.value
			.replace(/[^\d.]/g, "")
			.replace(/(\..*)\./g, "$1");
		// Apply live thousand-separator formatting
		const formatted = applyThousandSeparator(raw);
		setDisplayValue(formatted);
		onChange?.({ amount: parseAmount(raw), currency });
	};

	const handleBlur = () => {
		// Final precise format via Intl on blur
		const parsed = parseAmount(displayValue);
		if (parsed !== null) setDisplayValue(formatAmount(parsed));
	};

	return (
		<div
			className={cn(
				"flex h-9 w-full items-center overflow-hidden rounded-lg border border-input bg-background text-sm",
				"ring-offset-background transition-all duration-150",
				"focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
				error && "border-destructive focus-within:ring-destructive",
				disabled && "cursor-not-allowed opacity-50",
				className,
			)}
		>
			{/* ── Currency selector or static badge ─────────────────────────── */}
			{readOnlyCurrency ? (
				<div
					className="flex h-full shrink-0 items-center gap-1.5 border-r border-input px-3 font-medium text-foreground"
					aria-label={selectedCurrency.name}
				>
					{selectedCurrency.flag && (
						<span
							className="inline-flex h-[1.125rem] min-w-[1.5rem] items-center justify-center rounded-sm bg-muted px-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-muted-foreground"
							aria-hidden="true"
						>
							{flagToCode(selectedCurrency.flag)}
						</span>
					)}
					<span>{selectedCurrency.code}</span>
				</div>
			) : (
				<PopoverPrimitive.Root
					open={selectorOpen}
					onOpenChange={(open) => {
						if (disabled) return;
						setSelectorOpen(open);
						if (!open) setSearch("");
						else setTimeout(() => searchRef.current?.focus(), 50);
					}}
				>
					<PopoverPrimitive.Trigger asChild>
						<button
							type="button"
							disabled={disabled}
							aria-label={`Currency: ${selectedCurrency.name}. Click to change.`}
							aria-haspopup="listbox"
							aria-expanded={selectorOpen}
							className={cn(
								"flex h-full shrink-0 items-center gap-1.5 border-r border-input px-3",
								"font-medium transition-colors duration-150",
								"hover:bg-accent hover:text-accent-foreground",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
								"disabled:pointer-events-none",
							)}
						>
							{selectedCurrency.flag && (
								<span
									className="inline-flex h-[1.125rem] min-w-[1.5rem] items-center justify-center rounded-sm bg-muted px-0.5 font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-muted-foreground"
									aria-hidden="true"
								>
									{flagToCode(selectedCurrency.flag)}
								</span>
							)}
							<span>{selectedCurrency.code}</span>
							<ChevronDown
								className={cn(
									"h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150",
									selectorOpen && "rotate-180",
								)}
								aria-hidden="true"
							/>
						</button>
					</PopoverPrimitive.Trigger>

					<PopoverPrimitive.Portal>
						<PopoverPrimitive.Content
							align="start"
							sideOffset={6}
							onOpenAutoFocus={(e) => e.preventDefault()}
							className={cn(
								"z-50 w-64 overflow-hidden rounded-xl border bg-popover shadow-xl",
								"data-[state=open]:animate-in data-[state=closed]:animate-out",
								"data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
								"data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
								"data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
							)}
						>
							{/* Search bar */}
							<div className="flex items-center gap-2 border-b px-3 py-2">
								<Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
								<input
									ref={searchRef}
									type="text"
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder="Search currency…"
									aria-label="Search currencies"
									className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
								/>
								{search && (
									<button
										type="button"
										onClick={() => setSearch("")}
										aria-label="Clear search"
										className="text-muted-foreground transition-colors hover:text-foreground"
									>
										<X className="h-3.5 w-3.5" />
									</button>
								)}
							</div>

							{/* Currency list */}
							<div
								role="listbox"
								aria-label="Select currency"
								className="max-h-60 overflow-y-auto py-1.5"
							>
								{noResults && (
									<p className="py-6 text-center text-sm text-muted-foreground">
										No currencies found.
									</p>
								)}

								{/* Popular group */}
								{popularList.length > 0 && (
									<>
										<div className="px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
											Popular
										</div>
										{popularList.map((c) => (
											<CurrencyOption
												key={c.code}
												currency={c}
												selected={c.code === currency}
												onSelect={selectCurrency}
											/>
										))}
									</>
								)}

								{/* Divider between groups */}
								{popularList.length > 0 && otherList.length > 0 && (
									<div className="mx-2 my-1.5 h-px bg-border" aria-hidden="true" />
								)}

								{/* All currencies group */}
								{otherList.length > 0 && (
									<>
										{!search && (
											<div className="px-3 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
												All currencies
											</div>
										)}
										{otherList.map((c) => (
											<CurrencyOption
												key={c.code}
												currency={c}
												selected={c.code === currency}
												onSelect={selectCurrency}
											/>
										))}
									</>
								)}
							</div>
						</PopoverPrimitive.Content>
					</PopoverPrimitive.Portal>
				</PopoverPrimitive.Root>
			)}

			{/* ── Currency symbol ───────────────────────────────────────────── */}
			<span
				className="shrink-0 select-none pl-2.5 text-muted-foreground"
				aria-hidden="true"
			>
				{selectedCurrency.symbol}
			</span>

			{/* ── Amount input ──────────────────────────────────────────────── */}
			<input
				ref={inputRef}
				id={id}
				type="text"
				inputMode="decimal"
				placeholder={placeholder}
				value={displayValue}
				onChange={handleAmountChange}
				onBlur={handleBlur}
				disabled={disabled}
				aria-label="Amount"
				aria-invalid={error}
				className={cn(
					"h-full flex-1 bg-transparent px-2.5 text-right tabular-nums outline-none",
					"placeholder:text-muted-foreground/60",
					"disabled:cursor-not-allowed",
				)}
			/>
		</div>
	);
}

InputCurrency.displayName = "Input.Currency";
