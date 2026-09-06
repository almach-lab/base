import { cn } from "@almach/utils";
import * as React from "react";
import {
  ColorArea as AriaColorArea,
  ColorField as AriaColorField,
  ColorPicker as AriaColorPicker,
  ColorSlider as AriaColorSlider,
  ColorSwatch as AriaColorSwatch,
  ColorSwatchPicker as AriaColorSwatchPicker,
  ColorSwatchPickerItem as AriaColorSwatchPickerItem,
  ColorThumb,
  Input,
  Label,
  SliderTrack,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  CONTROL_LABEL,
  DISABLED_DATA,
  FIELD_GROUP,
  FIELD_SIZE,
  type FieldSize,
  FOCUS_RING,
} from "./_styles.js";

/** Checkerboard behind translucent colours, so alpha reads correctly. */
const ALPHA_CHECKERBOARD =
  "[background-image:repeating-conic-gradient(hsl(var(--muted-foreground)/0.25)_0%_25%,transparent_0%_50%)] [background-size:8px_8px]";

const thumbClasses = cn(
  "size-4 rounded-full border-2 border-background shadow-md ring-1 ring-border",
  MOTION_INTERACTIVE,
  FOCUS_RING,
  DISABLED_DATA,
  "data-[dragging]:scale-110",
);

export interface ColorPickerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaColorPicker>,
  "children"
> {
  className?: string;
  children?: React.ReactNode;
}

function ColorPickerRoot({ className, children, ...props }: ColorPickerProps) {
  return (
    <AriaColorPicker {...props}>
      <div className={cn("flex w-full flex-col gap-3", className)}>
        {children}
      </div>
    </AriaColorPicker>
  );
}
ColorPickerRoot.displayName = "ColorPicker";

/** Two-dimensional saturation/brightness surface. */
const ColorPickerArea = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof AriaColorArea>, "className"> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <AriaColorArea
    ref={ref}
    className={cn(
      "h-40 w-full rounded-lg border border-border",
      DISABLED_DATA,
      className,
    )}
    {...props}
  >
    <ColorThumb className={thumbClasses} />
  </AriaColorArea>
));
ColorPickerArea.displayName = "ColorPicker.Area";

export interface ColorPickerSliderProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaColorSlider>,
  "className"
> {
  className?: string;
  /** Visible label for the channel. */
  label?: React.ReactNode;
}

const ColorPickerSlider = React.forwardRef<
  HTMLDivElement,
  ColorPickerSliderProps
>(({ className, label, channel, ...props }, ref) => (
  <AriaColorSlider
    ref={ref}
    channel={channel}
    className={cn("flex w-full flex-col gap-1.5", className)}
    {...props}
  >
    {label && <Label className={CONTROL_LABEL}>{label}</Label>}
    <SliderTrack
      className={cn(
        "h-3 w-full rounded-full border border-border",
        channel === "alpha" && ALPHA_CHECKERBOARD,
      )}
    >
      <ColorThumb className={cn(thumbClasses, "top-1/2")} />
    </SliderTrack>
  </AriaColorSlider>
));
ColorPickerSlider.displayName = "ColorPicker.Slider";

export interface ColorPickerFieldProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaColorField>,
  "className"
> {
  className?: string;
  label?: React.ReactNode;
  size?: FieldSize;
}

/** Hex (or channel) text entry for the current colour. */
const ColorPickerField = React.forwardRef<
  HTMLDivElement,
  ColorPickerFieldProps
>(({ className, label, size = "default", ...props }, ref) => {
  const scale = FIELD_SIZE[size];

  return (
    <AriaColorField
      ref={ref}
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    >
      {label && <Label className={CONTROL_LABEL}>{label}</Label>}
      <Input
        className={cn(
          FIELD_GROUP,
          scale.height,
          scale.padding,
          scale.text,
          "font-mono uppercase outline-none",
        )}
      />
    </AriaColorField>
  );
});
ColorPickerField.displayName = "ColorPicker.Field";

/** Read-only colour chip. Useful as a trigger or a preview. */
const ColorPickerSwatch = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof AriaColorSwatch>, "className"> & {
    className?: string;
  }
>(({ className, ...props }, ref) => (
  <AriaColorSwatch
    ref={ref}
    className={cn(
      "size-7 shrink-0 rounded-md border border-border",
      ALPHA_CHECKERBOARD,
      className,
    )}
    {...props}
  />
));
ColorPickerSwatch.displayName = "ColorPicker.Swatch";

const ColorPickerSwatches = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof AriaColorSwatchPicker>,
    "className"
  > & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaColorSwatchPicker
    ref={ref}
    className={cn("flex flex-wrap gap-2", className)}
    {...props}
  />
));
ColorPickerSwatches.displayName = "ColorPicker.Swatches";

const ColorPickerSwatchItem = React.forwardRef<
  HTMLDivElement,
  Omit<
    React.ComponentPropsWithoutRef<typeof AriaColorSwatchPickerItem>,
    "className"
  > & { className?: string }
>(({ className, ...props }, ref) => (
  <AriaColorSwatchPickerItem
    ref={ref}
    className={cn(
      "size-7 shrink-0 cursor-pointer rounded-md border border-border",
      MOTION_INTERACTIVE,
      FOCUS_RING,
      DISABLED_DATA,
      "data-[hovered]:scale-105",
      "data-[selected]:ring-2 data-[selected]:ring-ring data-[selected]:ring-offset-2 ring-offset-background",
      className,
    )}
    {...props}
  >
    <AriaColorSwatch className="size-full rounded-md" />
  </AriaColorSwatchPickerItem>
));
ColorPickerSwatchItem.displayName = "ColorPicker.SwatchItem";

const ColorPicker = Object.assign(ColorPickerRoot, {
  Area: ColorPickerArea,
  Slider: ColorPickerSlider,
  Field: ColorPickerField,
  Swatch: ColorPickerSwatch,
  Swatches: ColorPickerSwatches,
  SwatchItem: ColorPickerSwatchItem,
});

// Re-exported so callers can build Color values without a second dependency.
export { parseColor } from "react-aria-components";
export { ColorPicker };
