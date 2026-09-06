"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { parseColor } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  FOCUS_RING,
  FOCUS_RING_WITHIN_INVALID,
  fieldErrorClass,
} from "./_styles.js";
import { ColorPicker } from "./color-picker.js";
import { Popover } from "./popover.js";

type ColorValue = ReturnType<typeof parseColor>;

/** Output formats accepted by `format`, matching React Aria's `toString`. */
export type ColorFormat =
  | "hex"
  | "hexa"
  | "rgb"
  | "rgba"
  | "hsl"
  | "hsla"
  | "css";

const ALPHA_FORMATS = new Set<ColorFormat>(["hexa", "rgba", "hsla", "css"]);

/** The alpha-carrying equivalent of each format that lacks one. */
const ALPHA_EQUIVALENT: Record<ColorFormat, ColorFormat> = {
  hex: "hexa",
  hexa: "hexa",
  rgb: "rgba",
  rgba: "rgba",
  hsl: "hsla",
  hsla: "hsla",
  css: "css",
};

const SWATCH_SIZE: Record<FieldSize, string> = {
  sm: "size-5",
  default: "size-6",
  lg: "size-7",
};

/** Checkerboard so translucent colours read as translucent. */
const ALPHA_CHECKERBOARD =
  "[background-image:repeating-conic-gradient(hsl(var(--muted-foreground)/0.25)_0%_25%,transparent_0%_50%)] [background-size:6px_6px]";

/**
 * Rewrites modern space-separated colour notation into the comma form.
 *
 * `hsl(43 90% 44%)` and `rgb(59 130 246 / 0.5)` are valid CSS but React Aria's
 * `parseColor` only accepts the comma form, so a perfectly good value handed in
 * by a caller would otherwise throw.
 */
function normalizeCssColor(value: string): string {
  const match = /^(hsla?|rgba?)\(([^)]+)\)$/i.exec(value);
  if (!match?.[1] || !match[2]) return value;

  const [fn, body] = [match[1], match[2]];
  if (body.includes(",")) return value;

  const parts = body.replace("/", " ").split(/\s+/).filter(Boolean);
  if (parts.length < 3) return value;

  return `${fn}(${parts.join(", ")})`;
}

function tryParse(value: string): ColorValue | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    return parseColor(trimmed);
  } catch {
    // Fall through to the normalized form.
  }

  const normalized = normalizeCssColor(trimmed);
  if (normalized === trimmed) return null;

  try {
    return parseColor(normalized);
  } catch {
    return null;
  }
}

export interface InputColorProps {
  id?: string;
  /** Controlled value, in any CSS colour notation. */
  value?: string;
  /** Uncontrolled initial value. */
  defaultValue?: string;
  /** Emits the colour re-serialised in `format`. */
  onChange?: (value: string) => void;
  /** Notation used for both the text field and `onChange`. */
  format?: ColorFormat;
  size?: FieldSize;
  disabled?: boolean;
  error?: boolean;
  /**
   * Show the alpha slider. On by default for every format — when alpha is
   * below 1, the value is serialised in the alpha-carrying equivalent of
   * `format` (`hex` becomes `hexa`, `rgb` becomes `rgba`) so the channel is
   * never silently dropped. Set `false` for an opaque-only field.
   */
  showAlpha?: boolean;
  /** Preset colours offered above the picker. */
  swatches?: string[];
  /** Name for a hidden input, so the value posts with a plain form. */
  name?: string;
  placeholder?: string;
  className?: string;
  /** Accessible label for the trigger, when there is no visible label. */
  "aria-label"?: string;
}

/**
 * Colour field with an inline swatch that opens the picker in a popover.
 *
 * The text field stays editable, so a colour can be pasted or typed; the
 * picker and the text are two views of one value. Typing is held as a draft
 * until it parses, and an unparseable draft is reverted on blur rather than
 * emitting a broken value.
 */
const InputColor = React.forwardRef<HTMLDivElement, InputColorProps>(
  function InputColor(
    {
      id,
      value,
      defaultValue = "#000000",
      onChange,
      format = "hex",
      size = "default",
      disabled = false,
      error = false,
      showAlpha,
      swatches,
      name,
      placeholder = "#000000",
      className,
      "aria-label": ariaLabel,
    },
    ref,
  ) {
    const isControlled = value !== undefined;
    const [internal, setInternal] = React.useState<ColorValue>(
      () => tryParse(value ?? defaultValue) ?? parseColor("#000000"),
    );

    const color = React.useMemo(() => {
      if (!isControlled) return internal;
      return tryParse(value) ?? internal;
    }, [internal, isControlled, value]);

    const withAlpha = showAlpha ?? true;

    /** Widens the format when the colour is translucent, so alpha survives. */
    const effectiveFormat = React.useMemo(() => {
      if (!withAlpha) return format;
      if (ALPHA_FORMATS.has(format)) return format;
      return color.getChannelValue("alpha") < 1
        ? ALPHA_EQUIVALENT[format]
        : format;
    }, [color, format, withAlpha]);

    const serialised = React.useMemo(
      () => color.toString(effectiveFormat),
      [color, effectiveFormat],
    );

    // Draft is non-null only while the typed text has not parsed yet.
    const [draft, setDraft] = React.useState<string | null>(null);
    const [open, setOpen] = React.useState(false);

    const commit = React.useCallback(
      (next: ColorValue) => {
        if (!isControlled) setInternal(next);
        setDraft(null);

        const emitFormat =
          withAlpha &&
          !ALPHA_FORMATS.has(format) &&
          next.getChannelValue("alpha") < 1
            ? ALPHA_EQUIVALENT[format]
            : format;

        onChange?.(next.toString(emitFormat));
      },
      [format, isControlled, onChange, withAlpha],
    );

    const handleTextChange = (raw: string) => {
      setDraft(raw);
      const parsed = tryParse(raw);
      if (parsed) commit(parsed);
    };

    const handleBlur = () => {
      // Drop an unparseable draft so the field never shows a value that is
      // out of step with the colour it represents.
      setDraft(null);
    };

    // ColorSwatchPickerItem throws on an unparseable colour, which would take
    // the whole tree down, so anything that fails to parse is dropped.
    const parsedSwatches = React.useMemo(
      () =>
        (swatches ?? []).flatMap((swatch) => {
          const parsed = tryParse(swatch);
          return parsed ? [{ key: swatch, value: parsed.toString("css") }] : [];
        }),
      [swatches],
    );

    const scale = FIELD_SIZE[size];
    const isInvalid = error || draft !== null;

    return (
      <div
        ref={ref}
        id={id}
        role="group"
        className={cn(
          FIELD_GROUP,
          scale.height,
          scale.text,
          "gap-2 pl-2 pr-2.5",
          fieldErrorClass(isInvalid),
          isInvalid && FOCUS_RING_WITHIN_INVALID,
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <Popover open={open} onOpenChange={setOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              disabled={disabled}
              aria-label={ariaLabel ?? "Choose colour"}
              aria-haspopup="dialog"
              aria-expanded={open}
              className={cn(
                "shrink-0 cursor-pointer overflow-hidden rounded-md border border-border",
                SWATCH_SIZE[size],
                ALPHA_CHECKERBOARD,
                MOTION_INTERACTIVE,
                FOCUS_RING,
                "hover:border-ring disabled:pointer-events-none",
              )}
            >
              {/* Painted on an inner layer so the checkerboard shows through
                  a translucent colour. */}
              <span
                aria-hidden="true"
                className="block size-full"
                style={{ backgroundColor: color.toString("css") }}
              />
            </button>
          </Popover.Trigger>

          <Popover.Content align="start" sideOffset={8} className="w-60 p-3">
            <ColorPicker value={color} onChange={commit}>
              <ColorPicker.Area
                colorSpace="hsb"
                xChannel="saturation"
                yChannel="brightness"
                className="h-32"
              />
              <ColorPicker.Slider channel="hue" colorSpace="hsb" />
              {withAlpha && <ColorPicker.Slider channel="alpha" />}

              {parsedSwatches.length > 0 && (
                <ColorPicker.Swatches aria-label="Preset colours">
                  {parsedSwatches.map((swatch) => (
                    <ColorPicker.SwatchItem
                      key={swatch.key}
                      color={swatch.value}
                      className="size-6"
                    />
                  ))}
                </ColorPicker.Swatches>
              )}
            </ColorPicker>
          </Popover.Content>
        </Popover>

        <input
          type="text"
          inputMode="text"
          spellCheck={false}
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          aria-invalid={isInvalid || undefined}
          {...(ariaLabel ? { "aria-label": ariaLabel } : {})}
          value={draft ?? serialised}
          onChange={(event) => handleTextChange(event.target.value)}
          onBlur={handleBlur}
          className={cn(
            "min-w-0 flex-1 bg-transparent font-mono uppercase outline-none",
            "placeholder:text-muted-foreground placeholder:normal-case",
            "disabled:cursor-not-allowed",
          )}
        />

        {name && <input type="hidden" name={name} value={serialised} />}
      </div>
    );
  },
);
InputColor.displayName = "Input.Color";

export { InputColor };
