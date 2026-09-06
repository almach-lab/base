import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { ToggleButton, ToggleButtonGroup } from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";

const toggleVariants = cva(
  [
    "inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2",
    "whitespace-nowrap rounded-md text-sm font-medium",
    MOTION_INTERACTIVE,
    FOCUS_RING,
    DISABLED_DATA,
    "data-[pressed]:scale-[0.985]",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-transparent text-muted-foreground",
          "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
          "data-[selected]:bg-accent data-[selected]:text-accent-foreground",
        ],
        outline: [
          "border border-input bg-background text-muted-foreground shadow-xs",
          "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
          "data-[selected]:border-primary/40 data-[selected]:bg-primary/10 data-[selected]:text-foreground",
        ],
        solid: [
          "bg-transparent text-muted-foreground",
          "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
          "data-[selected]:bg-primary data-[selected]:text-primary-foreground",
        ],
      },
      size: {
        sm: "h-8 px-2.5 text-xs [&_svg]:size-3.5",
        default: "h-9 px-3 [&_svg]:size-4",
        lg: "h-11 px-4 text-base [&_svg]:size-4",
        icon: "h-9 w-9 [&_svg]:size-4",
        "icon-sm": "h-8 w-8 [&_svg]:size-3.5",
        "icon-lg": "h-11 w-11 [&_svg]:size-5",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

const toggleGroupVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default: "gap-1",
      outline: "gap-1",
      /** Segmented control — items sit flush inside one shared shell. */
      segmented:
        "gap-0.5 rounded-lg border border-input bg-muted/40 p-0.5 shadow-xs",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col items-stretch",
    },
  },
  defaultVariants: { variant: "default", orientation: "horizontal" },
});

type ToggleGroupStyle = NonNullable<
  VariantProps<typeof toggleGroupVariants>["variant"]
>;

const ToggleGroupCtx = React.createContext<ToggleGroupStyle | null>(null);

export interface ToggleProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof ToggleButton>, "className">,
    VariantProps<typeof toggleVariants> {
  className?: string;
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => {
    const groupStyle = React.useContext(ToggleGroupCtx);
    const resolvedVariant =
      variant ??
      (groupStyle === "segmented"
        ? "solid"
        : groupStyle === "outline"
          ? "outline"
          : "default");

    return (
      <ToggleButton
        ref={ref}
        className={cn(
          toggleVariants({ variant: resolvedVariant, size }),
          className,
        )}
        {...props}
      />
    );
  },
);
Toggle.displayName = "Toggle";

export interface ToggleGroupProps
  extends
    Omit<
      React.ComponentPropsWithoutRef<typeof ToggleButtonGroup>,
      "className" | "orientation"
    >,
    VariantProps<typeof toggleGroupVariants> {
  className?: string;
}

const ToggleGroupRoot = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, variant, orientation, ...props }, ref) => (
    <ToggleGroupCtx.Provider value={variant ?? "default"}>
      <ToggleButtonGroup
        ref={ref}
        className={cn(toggleGroupVariants({ variant, orientation }), className)}
        {...(orientation ? { orientation } : {})}
        {...props}
      />
    </ToggleGroupCtx.Provider>
  ),
);
ToggleGroupRoot.displayName = "ToggleGroup";

const ToggleGroup = Object.assign(ToggleGroupRoot, { Item: Toggle });

export { Toggle, ToggleGroup, toggleGroupVariants, toggleVariants };
