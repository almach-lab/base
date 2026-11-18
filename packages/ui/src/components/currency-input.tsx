"use client";

import { cn } from "@almach/utils";
import { Check, ChevronDown, Search, X } from "lucide-react";
import * as React from "react";
import { useIsMobile } from "../hooks/use-media-query.js";
import { browserFieldProps, type FieldBrowserProps } from "./_field.js";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { mergeRefs } from "./_refs.js";
import {
  FIELD_GROUP,
  FIELD_SIZE,
  FIELD_TEXT_IOS,
  FOCUS_RING,
  FOCUS_RING_WITHIN_INVALID,
  MENU_ITEM,
  OVERLAY_SURFACE,
  TOUCH_TARGET,
  fieldErrorClass,
  type FieldSize,
} from "./_styles.js";
import { Drawer } from "./drawer.js";
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

export interface InputCurrencyProps extends FieldBrowserProps {
  id?: string;
  value?: CurrencyValue | undefined;
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
  size?: FieldSize;
  className?: string;
}

const CURRENCY_INNER_PAD: Record<
  FieldSize,
  { symbol: string; amount: string; selector: string }
> = {
  sm: { symbol: "pl-2", amount: "px-2", selector: "px-2.5" },
  default: { symbol: "pl-2.5", amount: "px-2.5", selector: "px-3" },
  lg: { symbol: "pl-3.5", amount: "px-3.5", selector: "px-4" },
};

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

const REGION_NAMES = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();

function flagEmoji(countryCode: string): string | null {
  const code = countryCode.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code) || REGION_NAMES?.of(code) === code) return null;
  return String.fromCodePoint(
    ...[...code].map((letter) => 0x1f1e6 + letter.charCodeAt(0) - 65),
  );
}

/**
 * Default flag renderer: the country's emoji flag (EU for the euro), or the
 * two-letter badge when the code has no flag.
 */
export function CurrencyFlagEmoji({ countryCode }: { countryCode: string }) {
  const flag = flagEmoji(countryCode);
  if (!flag) return <CurrencyFlagBadge countryCode={countryCode} />;
  return (
    <span className="inline-block text-base leading-none" aria-hidden="true">
      {flag}
    </span>
  );
}

function defaultRenderFlag(countryCode: string): React.ReactNode {
  return <CurrencyFlagEmoji countryCode={countryCode} />;
}

/* ── Number helpers ───────────────────────────────────────────────────────── */

function parseAmount(raw: string): number | null {
  const str = raw.trim().replace(/,/g, "");
  if (!str) return null;
  const n = parseFloat(str);
  return Number.isNaN(n) ? null : n;
}

/**
 * Always formats with "." as the decimal point and "," as the thousands
 * separator — matching what `parseAmount`/`applyThousandSeparator` assume
 * while typing. Deliberately NOT locale-aware: `Intl.NumberFormat(undefined, …)`
 * would pick up the browser/OS locale, and in locales where "," is the
 * decimal separator (e.g. id-ID, most of Europe) the displayed value and the
 * typing parser would disagree on every edit — the field looks "stuck"
 * because each keystroke gets reinterpreted as a different number.
 */
function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
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
  roomy?: boolean;
}

function CurrencyOption({
  currency,
  selected,
  onSelect,
  renderFlag,
  roomy,
}: CurrencyOptionProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={() => onSelect(currency.code)}
      className={cn(
        MENU_ITEM,
        "w-full justify-start gap-3 px-3",
        roomy ? "py-2.5" : "py-1.5",
        selected && "bg-accent text-accent-foreground",
      )}
    >
      <span className="flex w-5 shrink-0 justify-center">
        {currency.countryCode
          ? renderFlag(currency.countryCode, currency)
          : null}
      </span>
      <span className="w-10 shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
        {currency.code}
      </span>
      <span className="flex-1 truncate text-left">{currency.name}</span>
      <Check
        className={cn(
          "h-3.5 w-3.5 shrink-0",
          MOTION_INTERACTIVE,
          selected ? "opacity-100 text-primary" : "opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
}

/* ── CurrencyPicker (list + surface shared by CurrencySelect and Input.Currency) ── */

function CurrencyGroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground">
      {children}
    </div>
  );
}

interface CurrencyPickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: string;
  onSelect: (code: string) => void;
  currencies: CurrencyDef[];
  renderFlag: (countryCode: string, currency: CurrencyDef) => React.ReactNode;
  /** A single button; it anchors the popover on desktop. */
  trigger: React.ReactElement<React.ButtonHTMLAttributes<HTMLButtonElement>>;
  title: string;
}

/** The searchable currency list: a bottom sheet on phones, a popover elsewhere. */
function CurrencyPicker({
  open,
  onOpenChange,
  value,
  onSelect,
  currencies,
  renderFlag,
  trigger,
  title,
}: CurrencyPickerProps) {
  const isMobile = useIsMobile();
  const [search, setSearch] = React.useState("");
  const searchRef = React.useRef<HTMLInputElement>(null);

  const changeOpen = (next: boolean) => {
    onOpenChange(next);
    if (!next) setSearch("");
    else if (!isMobile) setTimeout(() => searchRef.current?.focus(), 50);
  };

  const select = (code: string) => {
    onSelect(code);
    changeOpen(false);
  };

  const q = search.trim().toLowerCase();
  const matches = (c: CurrencyDef) =>
    !q ||
    c.code.toLowerCase().includes(q) ||
    c.name.toLowerCase().includes(q) ||
    c.symbol.toLowerCase().includes(q) ||
    (c.countryCode?.toLowerCase().includes(q) ?? false);
  const popularList = currencies.filter((c) => c.popular && matches(c));
  const otherList = currencies.filter((c) => !c.popular && matches(c));
  const noResults = popularList.length === 0 && otherList.length === 0;

  const option = (c: CurrencyDef) => (
    <CurrencyOption
      key={c.code}
      currency={c}
      selected={c.code === value}
      onSelect={select}
      renderFlag={renderFlag}
      roomy={isMobile}
    />
  );

  const list = (
    <>
      <div
        className={cn(
          "flex items-center gap-2 border-b px-3 py-2",
          isMobile && "sticky top-0 z-10 bg-background",
        )}
      >
        <Search
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={searchRef}
          type="text"
          enterKeyHint="search"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search currency…"
          aria-label="Search currencies"
          className={cn(
            "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
            FIELD_TEXT_IOS,
          )}
        />
        {search && (
          <button
            type="button"
            onClick={() => setSearch("")}
            aria-label="Clear search"
            className={cn(
              TOUCH_TARGET,
              "text-muted-foreground hover:text-foreground",
              MOTION_INTERACTIVE,
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div
        role="listbox"
        aria-label={title}
        className={cn(
          "pb-1.5",
          // In the sheet, Drawer.Body is the one scroller: a nested one does not pan inside the sheet on iOS.
          !isMobile && "max-h-64 overflow-y-auto overscroll-contain",
        )}
      >
        {noResults && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No currencies found.
          </p>
        )}
        {popularList.length > 0 && (
          <>
            {!q && <CurrencyGroupLabel>Popular</CurrencyGroupLabel>}
            {popularList.map(option)}
          </>
        )}
        {otherList.length > 0 && (
          <>
            {!q && popularList.length > 0 && (
              <CurrencyGroupLabel>All currencies</CurrencyGroupLabel>
            )}
            {otherList.map(option)}
          </>
        )}
      </div>
    </>
  );

  if (isMobile) {
    return (
      <>
        {React.cloneElement(trigger, {
          onClick: () => changeOpen(true),
          "aria-expanded": open,
        })}
        <Drawer open={open} onOpenChange={changeOpen}>
          <Drawer.Content aria-label={title}>
            <Drawer.Header>
              <Drawer.Title>{title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body className="px-0 pb-4 text-foreground">
              {list}
            </Drawer.Body>
          </Drawer.Content>
        </Drawer>
      </>
    );
  }

  return (
    <Popover open={open} onOpenChange={changeOpen}>
      <Popover.Trigger asChild>
        {React.cloneElement(trigger, { "aria-expanded": open })}
      </Popover.Trigger>
      <Popover.Content
        align="start"
        sideOffset={6}
        className={cn(
          OVERLAY_SURFACE,
          "w-[min(18rem,calc(100vw-2rem))] overflow-hidden p-0",
        )}
      >
        {list}
      </Popover.Content>
    </Popover>
  );
}

function findCurrency(currencies: CurrencyDef[], code: string): CurrencyDef {
  return (
    currencies.find((c) => c.code === code) ??
    currencies[0] ??
    ({ code: "USD", symbol: "$", name: "US Dollar" } satisfies CurrencyDef)
  );
}

/* ── CurrencySelect ───────────────────────────────────────────────────────── */

export interface CurrencySelectProps {
  id?: string;
  value: string;
  onValueChange: (code: string) => void;
  /** Override the full currency list. Defaults to the built-in CURRENCIES. */
  currencies?: CurrencyDef[];
  renderFlag?: (countryCode: string, currency: CurrencyDef) => React.ReactNode;
  /**
   * - `"field"` (default): a full-width field with flag, code and name.
   * - `"inline"`: compact flag + code, for tight spots such as a conversion row.
   */
  variant?: "field" | "inline";
  /** Title of the sheet and the list. */
  title?: string;
  disabled?: boolean;
  error?: boolean;
  size?: FieldSize;
  className?: string;
  "aria-label"?: string;
}

/**
 * A currency picker on its own, with the same searchable list as
 * `Input.Currency`: a bottom sheet on phones, a popover elsewhere.
 */
export const CurrencySelect = React.forwardRef<
  HTMLButtonElement,
  CurrencySelectProps
>(function CurrencySelect(
  {
    id,
    value,
    onValueChange,
    currencies = CURRENCIES,
    renderFlag = defaultRenderFlag,
    variant = "field",
    title = "Currency",
    disabled,
    error,
    size = "default",
    className,
    "aria-label": ariaLabel,
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const selected = findCurrency(currencies, value);
  const flag = selected.countryCode
    ? renderFlag(selected.countryCode, selected)
    : null;
  const label = ariaLabel ?? `Currency: ${selected.name}. Click to change.`;

  const trigger =
    variant === "inline" ? (
      <button
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-md px-1.5 py-1 font-medium",
          MOTION_INTERACTIVE,
          FOCUS_RING,
          "hover:bg-accent hover:text-accent-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        {flag}
        <span>{selected.code}</span>
        <ChevronDown
          className="h-3 w-3 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>
    ) : (
      <button
        ref={ref}
        id={id}
        type="button"
        disabled={disabled}
        aria-label={label}
        aria-haspopup="listbox"
        aria-invalid={error || undefined}
        className={cn(
          FIELD_GROUP,
          FIELD_SIZE[size].height,
          FIELD_SIZE[size].text,
          fieldErrorClass(error),
          "w-full items-center gap-2 px-3 text-left",
          MOTION_INTERACTIVE,
          FOCUS_RING,
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
      >
        <span className="flex w-5 shrink-0 justify-center">{flag}</span>
        <span className="shrink-0 font-medium">{selected.code}</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          {selected.name}
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground"
          aria-hidden="true"
        />
      </button>
    );

  return (
    <CurrencyPicker
      open={open}
      onOpenChange={(next) => !disabled && setOpen(next)}
      value={selected.code}
      onSelect={onValueChange}
      currencies={currencies}
      renderFlag={renderFlag}
      trigger={trigger}
      title={title}
    />
  );
});

CurrencySelect.displayName = "CurrencySelect";

/* ── InputCurrency ────────────────────────────────────────────────────────── */

export const InputCurrency = React.forwardRef<
  HTMLInputElement,
  InputCurrencyProps
>(function InputCurrency(
  {
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
    size = "default",
    className,
    name,
    ...browserProps
  },
  ref,
) {
  const pad = CURRENCY_INNER_PAD[size];
  const [currency, setCurrency] = React.useState(
    value?.currency ?? defaultCurrency,
  );
  const [displayValue, setDisplayValue] = React.useState<string>(() =>
    value?.amount != null ? formatAmount(value.amount) : "",
  );
  const [selectorOpen, setSelectorOpen] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const pendingSelectionRef = React.useRef<number | null>(null);
  /** Last amount this component itself emitted via onChange — lets the sync
   * effect below tell "value changed because we typed it" apart from "value
   * changed because the parent passed in something new", so it only
   * reformats (and clobbers in-progress text like a trailing ".") on real
   * external updates. */
  const lastEmittedAmount = React.useRef<number | null>(value?.amount ?? null);

  /* Sync controlled currency */
  React.useEffect(() => {
    if (value?.currency !== undefined) {
      setCurrency(value.currency);
    }
  }, [value?.currency]);

  /* Sync controlled amount — skip reformatting when the change originated
   * from this component's own onChange call. */
  React.useEffect(() => {
    const amount = value?.amount ?? null;
    if (amount === lastEmittedAmount.current) return;
    lastEmittedAmount.current = amount;
    setDisplayValue(amount != null ? formatAmount(amount) : "");
  }, [value?.amount]);

  const selectedCurrency = findCurrency(currencies, currency);

  const selectCurrency = (code: string) => {
    setCurrency(code);
    const amount = parseAmount(displayValue);
    lastEmittedAmount.current = amount;
    onChange?.({ amount, currency: code });
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cursor = e.target.selectionStart ?? e.target.value.length;
    const keptBeforeCursor = e.target.value
      .slice(0, cursor)
      .replace(/[^\d.]/g, "").length;

    const raw = e.target.value
      .replace(/[^\d.]/g, "")
      .replace(/(\..*)\./g, "$1");
    const formatted = applyThousandSeparator(raw);

    let kept = 0;
    let nextCursor = formatted.length;
    for (let i = 0; i < formatted.length; i++) {
      if (/[\d.]/.test(formatted[i] ?? "")) kept++;
      if (kept === keptBeforeCursor) {
        nextCursor = i + 1;
        break;
      }
    }
    if (keptBeforeCursor === 0) nextCursor = 0;

    pendingSelectionRef.current = nextCursor;
    setDisplayValue(formatted);
    const amount = parseAmount(raw);
    lastEmittedAmount.current = amount;
    onChange?.({ amount, currency });
  };

  React.useLayoutEffect(() => {
    if (pendingSelectionRef.current !== null) {
      inputRef.current?.setSelectionRange(
        pendingSelectionRef.current,
        pendingSelectionRef.current,
      );
      pendingSelectionRef.current = null;
    }
  }, [displayValue]);

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
      role="group"
      aria-invalid={error || undefined}
      className={cn(
        FIELD_GROUP,
        FIELD_SIZE[size].height,
        FIELD_SIZE[size].text,
        fieldErrorClass(error),
        error && FOCUS_RING_WITHIN_INVALID,
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {/* ── Currency selector ─────────────────────────────────────────── */}
      {currencySelector === "readonly" && (
        <div
          className={cn(
            "flex h-full shrink-0 items-center gap-1.5 border-r border-input font-medium",
            pad.selector,
          )}
          aria-label={selectedCurrency.name}
        >
          {flagNode}
          <span>{selectedCurrency.code}</span>
        </div>
      )}

      {currencySelector === "editable" && (
        <CurrencyPicker
          open={selectorOpen}
          onOpenChange={(next) => !disabled && setSelectorOpen(next)}
          value={currency}
          onSelect={selectCurrency}
          currencies={currencies}
          renderFlag={renderFlag}
          title="Currency"
          trigger={
            <button
              type="button"
              disabled={disabled}
              aria-label={`Currency: ${selectedCurrency.name}. Click to change.`}
              aria-haspopup="listbox"
              className={cn(
                "flex h-full shrink-0 items-center gap-1.5 border-r border-input font-medium",
                pad.selector,
                MOTION_INTERACTIVE,
                FOCUS_RING,
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:pointer-events-none",
              )}
            >
              {flagNode}
              <span>{selectedCurrency.code}</span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 shrink-0 text-muted-foreground",
                  MOTION_INTERACTIVE,
                  selectorOpen && "rotate-180",
                )}
                aria-hidden="true"
              />
            </button>
          }
        />
      )}

      {/* ── Currency symbol ───────────────────────────────────────────── */}
      <span
        className={cn("shrink-0 select-none text-muted-foreground", pad.symbol)}
        aria-hidden="true"
      >
        {selectedCurrency.symbol}
      </span>

      {name && (
        <>
          <input
            type="hidden"
            name={name}
            value={value?.amount ?? parseAmount(displayValue) ?? ""}
          />

          <input type="hidden" name={`${name}Currency`} value={currency} />
        </>
      )}

      {/* ── Amount input ──────────────────────────────────────────────── */}
      <input
        {...browserFieldProps(browserProps, {
          autoComplete: "off",
          spellCheck: false,
          inputMode: "decimal",
        })}
        ref={mergeRefs(ref, inputRef)}
        id={id}
        type="text"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleAmountChange}
        onBlur={handleBlur}
        disabled={disabled}
        aria-label="Amount"
        aria-invalid={error}
        className={cn(
          "h-full min-w-0 flex-1 bg-transparent text-right tabular-nums outline-none",
          pad.amount,
          "placeholder:text-muted-foreground/60",
          "disabled:cursor-not-allowed",
        )}
      />
    </div>
  );
});

InputCurrency.displayName = "Input.Currency";
