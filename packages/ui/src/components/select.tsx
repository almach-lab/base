import { cn } from "@almach/utils";
import { Command as CommandPrimitive } from "cmdk";
import { Check, ChevronDown, ChevronsUpDown, Search } from "lucide-react";
import * as React from "react";
import { createPortal } from "react-dom";
import { MOTION_INTERACTIVE, MOTION_OVERLAY } from "./_motion.js";

const selectTriggerClasses =
  "group flex h-11 w-full min-w-40 cursor-pointer select-none items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card pl-4 pr-3.5 text-base text-foreground outline-none";

const selectTriggerMotionClasses = cn(
  MOTION_INTERACTIVE,
  "hover:bg-muted/45 active:scale-[0.995]",
);

const selectTriggerStateClasses =
  "focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50";

const selectPopupClasses =
  "group z-50 origin-[var(--transform-origin)] overflow-hidden border border-border/60 bg-card text-foreground shadow-2xl outline-1 outline-border/70";

const selectItemClasses =
  "grid w-full cursor-pointer select-none grid-cols-[0.75rem_1fr] items-center gap-2 rounded-xl px-2.5 py-2 text-sm leading-4 outline-none transition-colors duration-100 ease-out hover:bg-accent/45 disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-45 disabled:text-muted-foreground disabled:hover:bg-transparent";

interface SelectContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  isDisabled: boolean;
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  items: Map<string, string>;
  registerItem: (value: string, label: string) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const SelectCtx = React.createContext<SelectContextValue | null>(null);

function useSelectCtx() {
  const ctx = React.useContext(SelectCtx);
  if (!ctx) throw new Error("Select parts must be used within Select");
  return ctx;
}

type SelectRootProps = {
  value?: string;
  defaultValue?: string;
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
  const itemsRef = React.useRef(new Map<string, string>());
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const currentValue = value ?? internalValue;

  const registerItem = React.useCallback((itemValue: string, label: string) => {
    if (!itemsRef.current.has(itemValue)) {
      itemsRef.current.set(itemValue, label);
    }
  }, []);

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
        items: itemsRef.current,
        registerItem,
        triggerRef,
      }}
    >
      {children}
    </SelectCtx.Provider>
  );
}

const SelectValue = ({
  placeholder = "Select...",
  className,
}: {
  placeholder?: string;
  className?: string;
}) => {
  const { value, items } = useSelectCtx();
  const label = value ? (items.get(value) ?? value) : placeholder;
  const isPlaceholder = !value;
  return (
    <span
      className={cn("line-clamp-1", isPlaceholder && "opacity-60", className)}
    >
      {label}
    </span>
  );
};

const SelectIndicator = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <span className={cn("flex items-center justify-center", className)}>
    {children ?? (
      <ChevronDown className="h-4 w-4 shrink-0 opacity-50 transition-transform duration-150 ease-out" />
    )}
  </span>
);

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { error?: boolean }
>(({ className, children, error, onClick, ...props }, ref) => {
  const { open, setOpen, triggerRef, isDisabled } = useSelectCtx();
  return (
    <button
      ref={(node) => {
        triggerRef.current = node;
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        if (ref) {
          ref.current = node;
        }
      }}
      type="button"
      className={cn(
        selectTriggerClasses,
        selectTriggerMotionClasses,
        selectTriggerStateClasses,
        "data-[popup-open]:bg-muted/55 [&>span]:line-clamp-1",
        error && "border-destructive focus-visible:outline-destructive",
        className,
      )}
      data-popup-open={open ? "true" : undefined}
      onClick={(e) => {
        onClick?.(e);
        if (isDisabled) return;
        if (!e.defaultPrevented) setOpen(!open);
      }}
      aria-expanded={open}
      disabled={isDisabled}
      {...props}
    >
      {children}
      <SelectIndicator className={cn(open && "rotate-180")} />
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
  } = useSelectCtx();
  const text = React.Children.toArray(children)
    .filter((child) => typeof child === "string")
    .join(" ")
    .trim();
  React.useEffect(() => {
    registerItem(value, text || value);
  }, [registerItem, text, value]);

  const selected = selectedValue === value;
  return (
    <button
      ref={ref}
      type="button"
      role="option"
      aria-selected={selected}
      className={cn(
        selectItemClasses,
        "relative",
        selected && "bg-accent/70 text-accent-foreground",
        className,
      )}
      onClick={() => {
        if (isDisabled) return;
        if (disabled) return;
        onValueChange?.(value);
        setOpen(false);
      }}
      disabled={isDisabled || disabled}
      {...props}
    >
      <span className="col-start-1 flex h-3.5 w-3.5 items-center justify-center">
        {selected ? <Check className="h-3 w-3" /> : null}
      </span>
      <span className="col-start-2 text-left">{children}</span>
    </button>
  );
});
SelectItem.displayName = "Select.Item";

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open, setOpen, triggerRef } = useSelectCtx();
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = React.useState<{
    top: number;
    left: number;
    width: number;
    maxHeight: number;
  } | null>(null);

  const updatePosition = React.useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    const viewportPadding = 12;
    const offset = 8;
    const maxWidth = window.innerWidth - viewportPadding * 2;
    const width = Math.min(rect.width, maxWidth);
    const left = Math.min(
      Math.max(viewportPadding, rect.left),
      window.innerWidth - viewportPadding - width,
    );
    const top = rect.bottom + offset;
    const maxHeight = Math.max(160, window.innerHeight - top - viewportPadding);

    setPosition({ top, left, width, maxHeight });
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
      if (event.key === "Escape") setOpen(false);
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

  if (!open) return null;
  return createPortal(
    <div
      ref={(node) => {
        contentRef.current = node;
        if (typeof ref === "function") {
          ref(node);
          return;
        }
        if (ref) {
          ref.current = node;
        }
      }}
      className={cn(
        "fixed z-50",
        selectPopupClasses,
        "rounded-[1.25rem] p-1",
        MOTION_OVERLAY,
        "data-[state=open]:opacity-100 data-[state=open]:translate-y-0 opacity-0 translate-y-1",
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
        className="relative overflow-y-auto overflow-x-hidden py-1 scroll-py-6"
        style={position ? { maxHeight: position.maxHeight } : undefined}
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
      "px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
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
  return (
    <div className={cn("-mx-1.5 my-1 h-px bg-border", className)} {...props} />
  );
}

const SelectGroup = ({ children }: { children?: React.ReactNode }) => (
  <div>{children}</div>
);
const SelectScrollUpButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);
const SelectScrollDownButton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={className} {...props} />
);

export interface SelectSearchableOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectSearchableProps {
  options: SelectSearchableOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  empty?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

function SelectSearchable({
  options,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  empty = "No results.",
  disabled,
  error,
  className,
}: SelectSearchableProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find((o) => o.value === value);

  const handleSelect = (val: string) => {
    onChange?.(val === value ? "" : val);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        className={cn(
          selectTriggerClasses,
          selectTriggerMotionClasses,
          selectTriggerStateClasses,
          error && "border-destructive focus-visible:outline-destructive",
          !selected && "text-muted-foreground",
          className,
        )}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <ChevronsUpDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform duration-150 ease-out",
            open && "rotate-180",
          )}
        />
      </button>

      {open ? (
        <div
          className={cn(
            selectPopupClasses,
            "absolute z-50 mt-2 min-w-full rounded-[1.25rem] p-0",
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
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="flex h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </div>

            <CommandPrimitive.List
              className="max-h-56 overflow-y-auto overflow-x-hidden p-1"
              role="listbox"
              aria-label="Options"
            >
              <CommandPrimitive.Empty className="py-4 text-center text-sm text-muted-foreground">
                {empty}
              </CommandPrimitive.Empty>

              {options.map((opt) => (
                <CommandPrimitive.Item
                  key={opt.value}
                  value={opt.value}
                  {...(opt.disabled !== undefined && {
                    disabled: opt.disabled,
                  })}
                  onSelect={handleSelect}
                  role="option"
                  aria-selected={value === opt.value}
                  className={cn(
                    selectItemClasses,
                    "relative flex",
                    "data-[selected=true]:bg-accent/70 data-[selected=true]:text-accent-foreground",
                    "data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50",
                  )}
                >
                  <Check
                    className={cn(
                      "h-4 w-4 shrink-0",
                      value === opt.value ? "opacity-100" : "opacity-0",
                    )}
                    aria-hidden="true"
                  />
                  {opt.label}
                </CommandPrimitive.Item>
              ))}
            </CommandPrimitive.List>
          </CommandPrimitive>
        </div>
      ) : null}
    </div>
  );
}
SelectSearchable.displayName = "Select.Searchable";

const Select = Object.assign(SelectRoot, {
  Group: SelectGroup,
  Value: SelectValue,
  Trigger: SelectTrigger,
  Indicator: SelectIndicator,
  Content: SelectContent,
  Popover: SelectContent,
  Label: SelectLabel,
  Description: SelectDescription,
  Item: SelectItem,
  Separator: SelectSeparator,
  ScrollUpButton: SelectScrollUpButton,
  ScrollDownButton: SelectScrollDownButton,
  Searchable: SelectSearchable,
});

export type {
  SelectSearchableOption as ComboboxOption,
  SelectSearchableProps as ComboboxProps,
};
export { Select };
