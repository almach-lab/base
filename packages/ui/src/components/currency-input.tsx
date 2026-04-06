"use client";

import { cn } from "@almach/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import * as React from "react";
import { Popover } from "./popover.js";

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface CurrencyDef {
  /** ISO 4217 currency code — e.g. "USD", "EUR" */
  code: string;
  /** Localised symbol — e.g. "$", "€", "Rp" */
  symbol: string;
  /** Human-readable name — e.g. "US Dollar" */
  name: string;
  /**
   * ISO 3166-1 alpha-2 country / region code used to render the flag.
   * e.g. "US", "GB", "EU", "ID"
   * Pass to `renderFlag` or the built-in `CurrencyFlagBadge`.
   */
  countryCode?: string;
  /** Show this currency first in the "Popular" section. */
  popular?: boolean;
}

export interface CurrencyValue {
  amount: number | null;
  currency: string;
}

/**
 * Controls the left-hand currency selector section.
 * - `"editable"`  — (default) dropdown trigger; user can change currency
 * - `"readonly"`  — static badge; currency is fixed, no dropdown
 * - `"hidden"`    — selector is completely hidden; only symbol + amount shown
 */
export type CurrencySelectorMode = "editable" | "readonly" | "hidden";

export interface InputCurrencyProps {
  id?: string;
  value?: CurrencyValue;
  onChange?: (value: CurrencyValue) => void;
  /**
   * Default currency code used when no `value` is provided (uncontrolled).
   * Ignored when `value` is supplied — use `value.currency` instead.
   * @default "USD"
   */
  defaultCurrency?: string;
  /** Override the full currency list. Defaults to the built-in CURRENCIES (36 entries). */
  currencies?: CurrencyDef[];
  placeholder?: string;
  /**
   * Custom flag renderer. Receives the ISO country code and the full currency definition.
   * Defaults to `<CurrencyFlagBadge />` — a styled two-letter code badge.
   *
   * @example CDN image flags
   * renderFlag={(code) => (
   *   <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
   *        width={20} height={15} alt={code} className="rounded-sm object-cover" />
   * )}
   *
   * @example country-flag-icons SVGs (npm i country-flag-icons)
   * renderFlag={(code) => {
   *   const Flag = Flags[code as keyof typeof Flags];
   *   return Flag ? <Flag className="h-3.5 w-5 rounded-sm" /> : null;
   * }}
   */
  renderFlag?: (countryCode: string, currency: CurrencyDef) => React.ReactNode;
  /**
   * Controls the currency selector.
   * - `"editable"` (default) — dropdown, user can change currency
   * - `"readonly"` — static badge, no dropdown
   * - `"hidden"`   — entire selector hidden, only symbol + amount shown
   */
  currencySelector?: CurrencySelectorMode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

/* ── Currency list ────────────────────────────────────────────────────────── */

export const CURRENCIES: CurrencyDef[] = [
  /* ── Popular ── */
  {
    code: "USD",
    symbol: "$",
    name: "US Dollar",
    countryCode: "US",
    popular: true,
  },
  { code: "EUR", symbol: "€", name: "Euro", countryCode: "EU", popular: true },
  {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    countryCode: "GB",
    popular: true,
  },
  {
    code: "JPY",
    symbol: "¥",
    name: "Japanese Yen",
    countryCode: "JP",
    popular: true,
  },
  {
    code: "CHF",
    symbol: "Fr",
    name: "Swiss Franc",
    countryCode: "CH",
    popular: true,
  },
  {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    countryCode: "AU",
    popular: true,
  },
  {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    countryCode: "CA",
    popular: true,
  },
  {
    code: "CNY",
    symbol: "¥",
    name: "Chinese Yuan",
    countryCode: "CN",
    popular: true,
  },
  /* ── All ── */
  { code: "INR", symbol: "₹", name: "Indian Rupee", countryCode: "IN" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real", countryCode: "BR" },
  { code: "MXN", symbol: "$", name: "Mexican Peso", countryCode: "MX" },
  { code: "KRW", symbol: "₩", name: "South Korean Won", countryCode: "KR" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", countryCode: "SG" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", countryCode: "HK" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", countryCode: "NO" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona", countryCode: "SE" },
  { code: "DKK", symbol: "kr", name: "Danish Krone", countryCode: "DK" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", countryCode: "NZ" },
  { code: "ZAR", symbol: "R", name: "South African Rand", countryCode: "ZA" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", countryCode: "TR" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", countryCode: "AE" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", countryCode: "SA" },
  { code: "PLN", symbol: "zł", name: "Polish Złoty", countryCode: "PL" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna", countryCode: "CZ" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint", countryCode: "HU" },
  { code: "THB", symbol: "฿", name: "Thai Baht", countryCode: "TH" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", countryCode: "ID" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", countryCode: "MY" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso", countryCode: "PH" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong", countryCode: "VN" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel", countryCode: "IL" },
  { code: "EGP", symbol: "E£", name: "Egyptian Pound", countryCode: "EG" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira", countryCode: "NG" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", countryCode: "UA" },
  { code: "CLP", symbol: "$", name: "Chilean Peso", countryCode: "CL" },
  { code: "COP", symbol: "$", name: "Colombian Peso", countryCode: "CO" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol", countryCode: "PE" },
];

/* ── Default flag renderer ────────────────────────────────────────────────── */

/**
 * Built-in flag renderer — a compact styled badge showing the ISO country code.
 * Works on every platform with no external assets.
 * Export it if you want to compose with it in a custom `renderFlag`.
 */
export function CurrencyFlagBadge({ countryCode }: { countryCode: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-[1.125rem] min-w-[1.5rem] items-center justify-center",
        "rounded-sm bg-muted px-0.5",
        "font-mono text-[9px] font-bold uppercase leading-none tracking-tight text-muted-foreground",
      )}
      aria-hidden="true"
    >
      {countryCode}
    </span>
  );
}

function defaultRenderFlag(countryCode: string): React.ReactNode {
  return <CurrencyFlagBadge countryCode={countryCode} />;
}

/* ── Number helpers ───────────────────────────────────────────────────────── */

function parseAmount(raw: string): number | null {
  const str = raw.trim().replace(/,/g, "");
  if (!str) return null;
  const n = parseFloat(str);
  return Number.isNaN(n) ? null : n;
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/** Apply thousand-separator to the integer part while the user types. */
function applyThousandSeparator(raw: string): string {
  if (!raw) return "";
  const dotIdx = raw.indexOf(".");
  const intPart = dotIdx >= 0 ? raw.slice(0, dotIdx) : raw;
  const decPart = dotIdx >= 0 ? raw.slice(dotIdx) : "";
  return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decPart;
}

/* ── CurrencyOption ───────────────────────────────────────────────────────── */

interface CurrencyOptionProps {
  currency: CurrencyDef;
  selected: boolean;
  onSelect: (code: string) => void;
  renderFlag: (countryCode: string, currency: CurrencyDef) => React.ReactNode;
}

function CurrencyOption({
  currency,
  selected,
  onSelect,
  renderFlag,
}: CurrencyOptionProps) {
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
      {currency.countryCode && (
        <span className="shrink-0">
          {renderFlag(currency.countryCode, currency)}
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
  defaultCurrency = "USD",
  currencies = CURRENCIES,
  placeholder = "0.00",
  renderFlag = defaultRenderFlag,
  currencySelector = "editable",
  disabled,
  error,
  className,
}: InputCurrencyProps) {
  const [currency, setCurrency] = React.useState(
    value?.currency ?? defaultCurrency,
  );
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
  }, [value?.currency, currency]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Sync controlled amount */
  React.useEffect(() => {
    setDisplayValue(value?.amount != null ? formatAmount(value.amount) : "");
  }, [value?.amount]);

  const selectedCurrency =
    currencies.find((c) => c.code === currency) ??
    currencies[0] ??
    ({ code: "USD", symbol: "$", name: "US Dollar" } satisfies CurrencyDef);

  const filterList = React.useCallback(
    (list: CurrencyDef[]) => {
      if (!search) return list;
      const q = search.toLowerCase();
      return list.filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          c.symbol.toLowerCase().includes(q) ||
          (c.countryCode?.toLowerCase().includes(q) ?? false),
      );
    },
    [search],
  );

  const popularList = filterList(currencies.filter((c) => c.popular));
  const otherList = filterList(currencies.filter((c) => !c.popular));
  const noResults = popularList.length === 0 && otherList.length === 0;

  const selectCurrency = (code: string) => {
    setCurrency(code);
    setSelectorOpen(false);
    setSearch("");
    onChange?.({ amount: parseAmount(displayValue), currency: code });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
    setDisplayValue(applyThousandSeparator(raw));
    onChange?.({ amount: parseAmount(raw), currency });
  };

  const handleBlur = () => {
    const parsed = parseAmount(displayValue);
    if (parsed !== null) setDisplayValue(formatAmount(parsed));
  };

  /* Shared currency badge (trigger + readonly) */
  const flagNode = selectedCurrency.countryCode
    ? renderFlag(selectedCurrency.countryCode, selectedCurrency)
    : null;

  return (
    <div
      className={cn(
        "flex h-9 w-full min-w-0 items-center overflow-hidden rounded-lg border border-input bg-background text-sm",
        "ring-offset-background transition-all duration-150",
        "focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        error && "border-destructive focus-within:ring-destructive",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* ── Currency selector ─────────────────────────────────────────── */}
      {currencySelector === "readonly" && (
        <div
          className="flex h-full shrink-0 items-center gap-1.5 border-r border-input px-3 font-medium"
          aria-label={selectedCurrency.name}
        >
          {flagNode}
          <span>{selectedCurrency.code}</span>
        </div>
      )}

      {currencySelector === "editable" && (
        <Popover
          open={selectorOpen}
          onOpenChange={(open: boolean) => {
            if (disabled) return;
            setSelectorOpen(open);
            if (!open) setSearch("");
            else setTimeout(() => searchRef.current?.focus(), 50);
          }}
        >
          <Popover.Trigger asChild>
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
              {flagNode}
              <span>{selectedCurrency.code}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150",
                  selectorOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          </Popover.Trigger>

          <Popover.Content
            align="start"
            sideOffset={6}
            className={cn(
              "z-50 w-64 overflow-hidden rounded-xl border bg-popover shadow-xl",
              "data-[starting-style]:animate-in data-[ending-style]:animate-out",
              "data-[ending-style]:fade-out-0 data-[starting-style]:fade-in-0",
              "data-[ending-style]:zoom-out-95 data-[starting-style]:zoom-in-95",
              "data-[starting-style]:duration-150 data-[ending-style]:duration-100",
              "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
            )}
          >
            {/* Search bar */}
            <div className="flex items-center gap-2 border-b px-3 py-2">
              <Search
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
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
                      renderFlag={renderFlag}
                    />
                  ))}
                </>
              )}

              {/* Divider */}
              {popularList.length > 0 && otherList.length > 0 && (
                <div
                  className="mx-2 my-1.5 h-px bg-border"
                  aria-hidden="true"
                />
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
                      renderFlag={renderFlag}
                    />
                  ))}
                </>
              )}
            </div>
          </Popover.Content>
        </Popover>
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
          "h-full min-w-0 flex-1 bg-transparent px-2.5 text-right tabular-nums outline-none",
          "placeholder:text-muted-foreground/60",
          "disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
}

InputCurrency.displayName = "Input.Currency";
