import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import {
  Label,
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import {
  CONTROL_DESCRIPTION,
  CONTROL_LABEL,
  DISABLED_DATA,
  FOCUS_RING,
} from "./_styles.js";

const sliderTrackVariants = cva(
  "relative w-full cursor-pointer rounded-full data-[disabled]:cursor-not-allowed",
  {
    variants: {
      size: {
        sm: "h-1",
        default: "h-1.5",
        lg: "h-2.5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

const sliderThumbVariants = cva(
  [
    "top-1/2 rounded-full border-2 border-primary bg-background shadow-sm",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED_DATA,
    "data-[dragging]:scale-110",
  ],
  {
    variants: {
      size: {
        sm: "size-3.5",
        default: "size-4",
        lg: "size-5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

type AriaSliderProps = React.ComponentPropsWithoutRef<typeof AriaSlider>;

export interface SliderProps
  extends
    Omit<AriaSliderProps, "className" | "children" | "orientation">,
    VariantProps<typeof sliderTrackVariants> {
  className?: string;
  /** Visible field label. */
  label?: React.ReactNode;
  /** Helper text rendered under the track. */
  description?: React.ReactNode;
  /** Render the formatted value next to the label. */
  showValue?: boolean;
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  (
    { className, size, label, description, showValue = false, ...props },
    ref,
  ) => (
    <AriaSlider
      ref={ref}
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    >
      {(label || showValue) && (
        <div className="flex items-center justify-between gap-3">
          {label ? (
            <Label className={CONTROL_LABEL}>{label}</Label>
          ) : (
            <span aria-hidden="true" />
          )}
          {showValue && (
            <SliderOutput className="text-xs font-medium tabular-nums text-muted-foreground">
              {({ state }) =>
                state.values
                  .map((_, index) => state.getThumbValueLabel(index))
                  .join(" – ")
              }
            </SliderOutput>
          )}
        </div>
      )}

      <SliderTrack className={cn(sliderTrackVariants({ size }))}>
        {({ state }) => {
          const start = state.getThumbPercent(0) * 100;
          const end =
            state.values.length > 1 ? state.getThumbPercent(1) * 100 : start;

          return (
            <>
              <div className="absolute inset-0 rounded-full bg-secondary" />
              <div
                className={cn(
                  "absolute inset-y-0 rounded-full bg-primary",
                  MOTION_INTERACTIVE,
                )}
                style={
                  state.values.length > 1
                    ? { left: `${start}%`, width: `${end - start}%` }
                    : { left: 0, width: `${start}%` }
                }
              />
              {state.values.map((_, index) => (
                <SliderThumb
                  // biome-ignore lint/suspicious/noArrayIndexKey: thumb count is fixed by the value arity
                  key={index}
                  index={index}
                  className={cn(sliderThumbVariants({ size }))}
                />
              ))}
            </>
          );
        }}
      </SliderTrack>

      {description && <p className={CONTROL_DESCRIPTION}>{description}</p>}
    </AriaSlider>
  ),
);
Slider.displayName = "Slider";

export { Slider, sliderThumbVariants, sliderTrackVariants };
