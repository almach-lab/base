import { cn } from "@almach/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, Search } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { MOTION_INTERACTIVE, MOTION_OVERLAY } from "./_motion.js";
import { mergeRefs } from "./_refs.js";
import {
  DISABLED_DATA,
  FOCUS_RING,
  FOCUS_RING_INVALID,
  fieldErrorClass,
  inputVariants,
  MENU_LABEL,
  MENU_SEPARATOR,
  OVERLAY_SURFACE,
} from "./_styles.js";

const selectTriggerClasses = cn(
  inputVariants({ size: "default" }),
  "flex min-w-40 w-full cursor-pointer items-center justify-between gap-2 pl-3 pr-2.5 text-left",
  FOCUS_RING,
  DISABLED_DATA,
  "hover:bg-muted/40",
  "data-[popup-open]:bg-muted/40",
);

const selectPopupClasses = cn(
  OVERLAY_SURFACE,
  "origin-[var(--transform-origin)] shadow-md",
  MOTION_OVERLAY,
  "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95",
  "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
);

const selectScrollClasses = cn(
  "overflow-y-auto overflow-x-hidden overscroll-contain scroll-fade scroll-fade-6 py-1",
);

const selectItemClasses = cn(
  "relative flex w-full appearance-none cursor-pointer select-none items-center justify-between gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-sm text-foreground outline-none",
  MOTION_INTERACTIVE,
  DISABLED_DATA,
  "hover:bg-muted/50 focus:bg-transparent focus:outline-none focus-visible:outline-none",
  "disabled:hover:bg-transparent",
);

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  isDisabled: boolean;
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  items: Map<string, string>;
  registerItem: (value: string, label: string) => void;
  highlightedValue: string | undefined;
  setHighlightedValue: (value: string | undefined) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentId: string;
}

function extractItemLabel(children: React.ReactNode): string {
  if (children == null || typeof children === "boolean") return "";
  if (typeof children === "string" || typeof children === "number") {
    return String(children).trim();
  }
  if (Array.isArray(children)) {
    return children.map(extractItemLabel).join("").trim();
  }
  if (React.isValidElement<{ children?: React.ReactNode }>(children)) {
    return extractItemLabel(children.props.children);
  }
  return "";
}

const SelectCtx = React.createContext<SelectContextValue | null>(null);

function useSelectCtx() {
  const ctx = React.useContext(SelectCtx);
  if (!ctx) throw new Error("Select parts must be used within Select");
  return ctx;
}

type SelectRootProps = {
  value?: string | undefined;
  defaultValue?: string | undefined;
  onValueChange?: (value: string) => void;
  isDisabled?: boolean;
  children?: React.ReactNode;
};

function SelectRoot({
  value,
  defaultValue,
  onValueChange,
  isDisabled = false,
  children,
}: SelectRootProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(() => new Map<string, string>());
  const [highlightedValue, setHighlightedValue] = React.useState<
    string | undefined
  >();
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const contentId = React.useId();
  const currentValue = value ?? internalValue;

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    setItems((prev) => {
      if (prev.get(itemValue) === label) return prev;
      const next = new Map(prev);
      next.set(itemValue, label);
      return next;
    });
  }, []);

  React.useEffect(() => {
    if (open) {
      setHighlightedValue(currentValue);
    }
  }, [open, currentValue]);

  const handleChange = React.useCallback(
    (next: string) => {
      if (value === undefined) setInternalValue(next);
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  return (
    <SelectCtx.Provider
      value={{
        open,
        setOpen,
        isDisabled,
        value: currentValue,
        onValueChange: handleChange,
        items,
        registerItem,
        highlightedValue,
        setHighlightedValue,
        triggerRef,
        contentId,
      }}
    >
      {children}
    </SelectCtx.Provider>
  );
}

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  { placeholder?: string; className?: string }
>(({ placeholder = "Select...", className }, ref) => {
  const { value, items } = useSelectCtx();
  const label = value ? (items.get(value) ?? value) : placeholder;
  const isPlaceholder = !value;
  return (
    <span
      ref={ref}
      className={cn(
        "min-w-0 flex-1 truncate text-left",
        isPlaceholder && "text-muted-foreground",
        className,
      )}
    >
      {label}
    </span>
  );
});
SelectValue.displayName = "Select.Value";

const SelectIndicator = React.forwardRef<
  HTMLSpanElement,
  { className?: string; open?: boolean; children?: React.ReactNode }
>(({ className, open, children }, ref) => (
  <span
    ref={ref}
    className={cn(
      "pointer-events-none flex shrink-0 items-center justify-center",
      className,
    )}
  >
    {children ?? (
      <ChevronDown
        className={cn(
          "h-4 w-4 opacity-50",
          MOTION_INTERACTIVE,
          open && "rotate-180",
        )}
      />
    )}
  </span>
));
SelectIndicator.displayName = "Select.Indicator";

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { error?: boolean }
>(({ className, children, error, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef, isDisabled, contentId } = useSelectCtx();
  return (
    <button
      ref={mergeRefs(ref, triggerRef)}
      type="button"
      className={cn(
        selectTriggerClasses,
        error && cn(fieldErrorClass(true), FOCUS_RING_INVALID),
        className,
      )}
      data-popup-open={open ? "true" : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (isDisabled) return;
        if (!e.defaultPrevented) setOpen(!open);
      }}
      aria-controls={open ? contentId : undefined}
      aria-expanded={open}
      aria-haspopup="listbox"
      aria-invalid={error || undefined}
      disabled={isDisabled}
      {...props}
    >
      {children}
      <SelectIndicator open={open} />
    </button>
  );
});
SelectTrigger.displayName = "Select.Trigger";

const SelectItem = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, children, value, disabled, ...props }, ref) => {
  const {
    value: selectedValue,
    onValueChange,
    setOpen,
    registerItem,
    isDisabled,
    highlightedValue,
    setHighlightedValue,
    triggerRef,
  } = useSelectCtx();
  const text = extractItemLabel(children);
  React.useLayoutEffect(() => {
    registerItem(value, text || value);
  }, [registerItem, text, value]);

  const selected = selectedValue === value;
  const highlighted = highlightedValue === value && !selected;
  return (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        selectItemClasses,
        highlighted && "bg-muted/50 hover:bg-muted/50",
        selected && "bg-transparent hover:bg-transparent focus:bg-transparent",
        className,
      )}
      onMouseEnter={() => setHighlightedValue(value)}
      onFocus={() => setHighlightedValue(value)}
      onClick={() => {
        if (isDisabled) return;
        if (disabled) return;
        onValueChange?.(value);
        setOpen(false);
        triggerRef.current?.focus();
      }}
      disabled={isDisabled || disabled}
      data-value={value}
      {...props}
    >
      <span className="min-w-0 flex-1 truncate text-left">{children}</span>
      <Check
        className={cn(
          "size-4 shrink-0 text-foreground",
          selected ? "opacity-100" : "opacity-0",
        )}
        aria-hidden="true"
      />
    </button>
  );
});
SelectItem.displayName = "Select.Item";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const {
    open,
    setOpen,
    triggerRef,
    contentId,
    onValueChange,
    highlightedValue,
    setHighlightedValue,
    isDisabled,
  } = useSelectCtx();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
    openBelow: boolean;
  } | null>(null);

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const offset = 6;
    const maxWidth = window.innerWidth - viewportPadding * 2;
    const width = Math.min(Math.max(rect.width, 180), maxWidth);
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - viewportPadding - width,
    );

    const spaceBelow = window.innerHeight - rect.bottom - viewportPadding;
    const spaceAbove = rect.top - viewportPadding;
    const preferredMax = 280;
    const openBelow = spaceBelow >= 160 || spaceBelow >= spaceAbove;
    const maxHeight = Math.min(
      preferredMax,
      Math.max(120, openBelow ? spaceBelow - offset : spaceAbove - offset),
    );
    const top = openBelow
      ? rect.bottom + offset
      : rect.top - offset - maxHeight;

    setPosition({ top, left, width, maxHeight, openBelow });
  }, [triggerRef]);

  React.useEffect(() => {
    if (!open) return;
    updatePosition();

    const onWindowChange = () => updatePosition();
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (contentRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("resize", onWindowChange);
    window.addEventListener("scroll", onWindowChange, true);
    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("resize", onWindowChange);
      window.removeEventListener("scroll", onWindowChange, true);
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [open, setOpen, triggerRef, updatePosition]);

  const handleListKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!listRef.current || isDisabled) return;

      const options = Array.from(
        listRef.current.querySelectorAll<HTMLButtonElement>(
          'button[role="option"]:not(:disabled)',
        ),
      );
      if (options.length === 0) return;

      const values = options
        .map((option) => option.dataset.value)
        .filter((v): v is string => Boolean(v));

      let index = highlightedValue ? values.indexOf(highlightedValue) : -1;
      if (index < 0) index = 0;

      const moveTo = (nextIndex: number) => {
        const clamped = Math.max(0, Math.min(nextIndex, values.length - 1));
        const nextValue = values[clamped];
        if (!nextValue) return;
        setHighlightedValue(nextValue);
        options[clamped]?.scrollIntoView({ block: "nearest" });
      };

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveTo(index + 1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveTo(index - 1);
          break;
        case "Home":
          event.preventDefault();
          moveTo(0);
          break;
        case "End":
          event.preventDefault();
          moveTo(values.length - 1);
          break;
        case "Enter":
        case " ":
          event.preventDefault();
          if (highlightedValue) {
            onValueChange?.(highlightedValue);
            setOpen(false);
            triggerRef.current?.focus();
          }
          break;
        default:
          break;
      }
    },
    [
      highlightedValue,
      isDisabled,
      onValueChange,
      setHighlightedValue,
      setOpen,
      triggerRef,
    ],
  );

  React.useEffect(() => {
    if (open) {
      listRef.current?.focus({ preventScroll: true });
    }
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div
      id={contentId}
      ref={mergeRefs(ref, contentRef)}
      role="listbox"
      className={cn(
        "fixed z-50 p-1",
        selectPopupClasses,
        !position?.openBelow && "origin-bottom",
        className,
      )}
      data-state="open"
      style={
        position
          ? {
              top: position.top,
              left: position.left,
              width: position.width,
              minWidth: position.width,
              maxWidth: position.width,
            }
          : undefined
      }
      {...props}
    >
      <div
        ref={listRef}
        data-select-list=""
        tabIndex={-1}
        className={selectScrollClasses}
        style={position ? { maxHeight: position.maxHeight } : undefined}
        onKeyDown={handleListKeyDown}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
});
SelectContent.displayName = "Select.Content";

const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      MENU_LABEL,
      "px-2 pb-1 pt-1.5 text-[11px] uppercase tracking-wider",
      className,
    )}
    {...props}
  />
));
SelectLabel.displayName = "Select.Label";

const SelectDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
SelectDescription.displayName = "Select.Description";

function SelectSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(MENU_SEPARATOR, className)} {...props} />;
}

const SelectGroup = React.forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode }
>(({ children }, ref) => <div ref={ref}>{children}</div>);
SelectGroup.displayName = "Select.Group";

export interface SelectSearchableOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectSearchableProps {
  options: SelectSearchableOption[];
  value?: string | undefined;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  empty?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

const SelectSearchable = React.forwardRef<
  HTMLDivElement,
  SelectSearchableProps
>(function SelectSearchable(
  {
    options,
    value,
    onChange,
    placeholder = "Select…",
    searchPlaceholder = "Search…",
    empty = "No results.",
    disabled,
    error,
    className,
  },
  ref,
) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const listboxId = React.useId();
  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val === value ? "" : val);
    setOpen(false);
    triggerRef.current?.focus();
  };

  React.useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  React.useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <div ref={mergeRefs(ref, rootRef)} className="relative">
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listboxId : undefined}
        aria-invalid={error || undefined}
        disabled={disabled}
        className={cn(
          selectTriggerClasses,
          error && cn(fieldErrorClass(true), FOCUS_RING_INVALID),
          className,
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            !selected && "text-muted-foreground",
          )}
        >
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 opacity-50",
            MOTION_INTERACTIVE,
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            selectPopupClasses,
            "absolute z-50 mt-2 min-w-full rounded-md p-0",
          )}
        >
          <CommandPrimitive className="flex flex-col" aria-label={placeholder}>
            <div
              className="flex items-center gap-2 border-b px-3"
              cmdk-input-wrapper=""
            >
              <Search
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <CommandPrimitive.Input
                ref={inputRef}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="flex h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <CommandPrimitive.List
              id={listboxId}
              className={cn(selectScrollClasses, "max-h-56 p-1")}
              role="listbox"
              aria-label="Options"
            >
              <CommandPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
                {empty}
              </CommandPrimitive.Empty>

              {options.map((opt) => {
                const isSelected = value === opt.value;
                return (
                  <CommandPrimitive.Item
                    key={opt.value}
                    value={opt.value}
                    {...(opt.disabled !== undefined && {
                      disabled: opt.disabled,
                    })}
                    onSelect={handleSelect}
                    role="option"
                    aria-selected={isSelected}
                    className={cn(
                      selectItemClasses,
                      "data-[selected=true]:bg-muted/50 data-[selected=true]:text-foreground",
                      isSelected &&
                        "data-[selected=true]:bg-transparent data-[selected=true]:hover:bg-transparent",
                    )}
                  >
                    <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                    <Check
                      className={cn(
                        "size-4 shrink-0 text-foreground",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </CommandPrimitive.Item>
                );
              })}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </div>
      ) : null}
    </div>
  );
});
SelectSearchable.displayName = "Select.Searchable";

const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Indicator: SelectIndicator,
  Content: SelectContent,
  Label: SelectLabel,
  Description: SelectDescription,
  Item: SelectItem,
  Separator: SelectSeparator,
  Searchable: SelectSearchable,
});

export type {
  SelectSearchableOption as ComboboxOption,
  SelectSearchableProps as ComboboxProps,
};
export { Select };
