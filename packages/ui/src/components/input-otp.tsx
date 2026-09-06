import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED, FOCUS_RING, fieldErrorClass } from "./_styles.js";

const otpSlotVariants = cva(
  [
    "flex items-center justify-center rounded-md border border-input bg-background",
    "text-center font-medium tabular-nums text-foreground caret-transparent",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED,
    "focus-visible:border-ring",
  ],
  {
    variants: {
      size: {
        sm: "size-8 text-sm",
        default: "size-10 text-base",
        lg: "size-12 text-lg",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const DISALLOWED = {
  numeric: /[^0-9]/g,
  alphanumeric: /[^a-zA-Z0-9]/g,
} as const;

export interface InputOtpProps
  extends
    Omit<
      React.HTMLAttributes<HTMLDivElement>,
      "onChange" | "children" | "defaultValue"
    >,
    VariantProps<typeof otpSlotVariants> {
  /** Number of slots. */
  length?: number;
  /** Controlled value. Longer strings are truncated to `length`. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Fired once every slot is filled. */
  onComplete?: (value: string) => void;
  /** Which characters are accepted. */
  pattern?: keyof typeof DISALLOWED;
  /** Render filled slots as dots. */
  mask?: boolean;
  /** Insert a visual divider every N slots. */
  groupSize?: number;
  disabled?: boolean;
  error?: boolean;
  /** Name for a hidden input, so the value posts with a plain form. */
  name?: string;
  autoFocus?: boolean;
}

/**
 * One-time-code field.
 *
 * The value is always dense — there are never gaps between filled slots. Focus
 * and edits are therefore redirected to the first empty slot, and clearing a
 * slot truncates everything after it. That matches how people actually type a
 * code, and means the value can never contain filler characters.
 */
const InputOtp = React.forwardRef<HTMLDivElement, InputOtpProps>(
  (
    {
      className,
      length = 6,
      value,
      defaultValue = "",
      onValueChange,
      onComplete,
      pattern = "numeric",
      mask = false,
      groupSize,
      size,
      disabled = false,
      error = false,
      name,
      autoFocus = false,
      ...props
    },
    ref,
  ) => {
    const sanitize = React.useCallback(
      (raw: string) => raw.replace(DISALLOWED[pattern], ""),
      [pattern],
    );

    const [internalValue, setInternalValue] = React.useState(() =>
      sanitize(defaultValue).slice(0, length),
    );

    const isControlled = value !== undefined;
    const current = sanitize(isControlled ? value : internalValue).slice(
      0,
      length,
    );

    const slotRefs = React.useRef<Array<HTMLInputElement | null>>([]);
    const completedRef = React.useRef(current.length === length);

    const focusSlot = React.useCallback(
      (index: number) => {
        const clamped = Math.min(Math.max(index, 0), length - 1);
        const target = slotRefs.current[clamped];
        target?.focus();
        target?.select();
      },
      [length],
    );

    const commit = React.useCallback(
      (next: string) => {
        const clamped = next.slice(0, length);

        if (!isControlled) setInternalValue(clamped);
        onValueChange?.(clamped);

        if (clamped.length === length) {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete?.(clamped);
          }
        } else {
          completedRef.current = false;
        }

        return clamped;
      },
      [isControlled, length, onComplete, onValueChange],
    );

    /** Writes `chars` at `index`, keeping the value dense, and moves focus on. */
    const write = (index: number, chars: string) => {
      const at = Math.min(index, current.length);
      const next = commit(current.slice(0, at) + chars);
      focusSlot(next.length);
    };

    const handleChange = (
      index: number,
      event: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const clean = sanitize(event.target.value);
      if (clean) write(index, clean);
    };

    const handleKeyDown = (
      index: number,
      event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
      switch (event.key) {
        case "Backspace": {
          event.preventDefault();
          // Clearing a slot drops it and everything after it.
          const at = current[index] === undefined ? index - 1 : index;
          if (at < 0) return;
          commit(current.slice(0, at));
          focusSlot(at);
          return;
        }
        case "Delete": {
          event.preventDefault();
          commit(current.slice(0, index));
          focusSlot(index);
          return;
        }
        case "ArrowLeft": {
          event.preventDefault();
          focusSlot(index - 1);
          return;
        }
        case "ArrowRight": {
          event.preventDefault();
          focusSlot(Math.min(index + 1, current.length));
          return;
        }
        default:
      }
    };

    const handlePaste = (
      index: number,
      event: React.ClipboardEvent<HTMLInputElement>,
    ) => {
      event.preventDefault();
      const clean = sanitize(event.clipboardData.getData("text"));
      if (clean) write(index, clean);
    };

    return (
      <div
        ref={ref}
        role="group"
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {Array.from({ length }, (_, index) => {
          const char = current[index] ?? "";
          const showDivider =
            groupSize !== undefined && index > 0 && index % groupSize === 0;

          return (
            <React.Fragment key={index}>
              {showDivider && (
                <span
                  aria-hidden="true"
                  className="h-px w-2 shrink-0 bg-border"
                />
              )}
              <input
                ref={(node) => {
                  slotRefs.current[index] = node;
                }}
                // A one-character text input per slot keeps native mobile
                // keyboards and password managers working.
                type={mask && char ? "password" : "text"}
                inputMode={pattern === "numeric" ? "numeric" : "text"}
                autoComplete={index === 0 ? "one-time-code" : "off"}
                autoFocus={autoFocus && index === 0}
                disabled={disabled}
                aria-label={`Digit ${index + 1} of ${length}`}
                {...(error ? { "aria-invalid": true } : {})}
                value={char}
                onChange={(event) => handleChange(index, event)}
                onKeyDown={(event) => handleKeyDown(index, event)}
                onPaste={(event) => handlePaste(index, event)}
                onFocus={(event) => {
                  // Never let focus land past the first empty slot.
                  if (index > current.length) {
                    focusSlot(current.length);
                    return;
                  }
                  event.currentTarget.select();
                }}
                className={cn(
                  otpSlotVariants({ size }),
                  fieldErrorClass(error),
                )}
              />
            </React.Fragment>
          );
        })}

        {name && <input type="hidden" name={name} value={current} />}
      </div>
    );
  },
);
InputOtp.displayName = "InputOtp";

export { InputOtp, otpSlotVariants };
