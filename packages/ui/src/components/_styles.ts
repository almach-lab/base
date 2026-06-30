import { cn } from "@almach/utils";
import { cva } from "class-variance-authority";
import { MOTION_INTERACTIVE, MOTION_OVERLAY } from "./_motion.js";

/** Shared focus ring — matches shadcn / Base UI conventions */
export const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

export const FOCUS_RING_INVALID =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive focus-visible:ring-offset-2 ring-offset-background";

export const FOCUS_RING_WITHIN =
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background";

export const DISABLED =
  "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50";

export const DISABLED_DATA =
  "aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50";

export const CONTROL_ROOT =
  "group flex cursor-pointer select-none items-center gap-2";

export const CONTROL_ROOT_START =
  "group flex cursor-pointer select-none items-start gap-3";

export const CONTROL_LABEL =
  "text-sm font-medium leading-none text-foreground";

export const CONTROL_DESCRIPTION =
  "text-xs leading-relaxed text-muted-foreground";

export function fieldErrorClass(error?: boolean) {
  return error
    ? "border-destructive focus-visible:ring-destructive aria-invalid:border-destructive"
    : undefined;
}

const fieldBase = [
  "flex w-full rounded-md border border-input bg-background text-foreground shadow-xs",
  MOTION_INTERACTIVE,
  "placeholder:text-muted-foreground",
  FOCUS_RING,
  DISABLED,
] as const;

export const inputVariants = cva(fieldBase, {
  variants: {
    size: {
      sm: "h-8 text-xs file:text-xs",
      default: "h-9 text-sm file:text-sm",
      lg: "h-11 text-base file:text-base",
    },
  },
  defaultVariants: { size: "default" },
});

export const textareaVariants = cva(
  [...fieldBase, "resize-y min-h-[80px] px-3 py-2"],
  {
    variants: {
      size: {
        sm: "min-h-[60px] px-2.5 py-1.5 text-xs",
        default: "min-h-[80px] px-3 py-2 text-sm",
        lg: "min-h-[100px] px-4 py-3 text-base",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export const checkboxVariants = cva(
  [
    "flex shrink-0 items-center justify-center rounded-sm border border-input bg-background",
    MOTION_INTERACTIVE,
  ],
  {
    variants: {
      size: {
        sm: "size-3.5 [&_svg]:size-2.5",
        default: "size-4 [&_svg]:size-3",
        lg: "size-5 rounded [&_svg]:size-3.5",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export const switchTrackVariants = cva(
  [
    "relative inline-flex shrink-0 items-center rounded-full border border-transparent",
    MOTION_INTERACTIVE,
  ],
  {
    variants: {
      size: {
        sm: "h-[22px] w-[38px]",
        default: "h-[28px] w-[48px]",
        lg: "h-[34px] w-[60px]",
      },
    },
    defaultVariants: { size: "default" },
  },
);

export const switchThumbVariants = cva(
  [
    "pointer-events-none block rounded-full bg-background shadow-sm ring-1 ring-border/80",
    MOTION_INTERACTIVE,
  ],
  {
    variants: {
      size: {
        sm: "h-[18px] w-[18px]",
        default: "h-[24px] w-[24px]",
        lg: "h-[30px] w-[30px]",
      },
      selected: {
        true: "",
        false: "translate-x-[2px]",
      },
    },
    compoundVariants: [
      { size: "sm", selected: true, className: "translate-x-[18px]" },
      { size: "default", selected: true, className: "translate-x-[22px]" },
      { size: "lg", selected: true, className: "translate-x-[28px]" },
    ],
    defaultVariants: { size: "default", selected: false },
  },
);

export const radioIndicatorVariants = cva(
  [
    "mt-0.5 flex shrink-0 items-center justify-center rounded-full border border-input bg-background",
    MOTION_INTERACTIVE,
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

export const cardVariants = cva(
  "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
);

export const alertVariants = cva("relative flex w-full gap-3 rounded-lg border p-4", {
  variants: {
    variant: {
      default: "bg-background text-foreground",
      destructive:
        "border-destructive/30 bg-destructive/5 text-destructive [&_svg]:text-destructive",
      success:
        "border-success/30 bg-success/5 text-success [&_svg]:text-success",
      warning:
        "border-warning/30 bg-warning/5 text-warning [&_svg]:text-warning",
    },
  },
  defaultVariants: { variant: "default" },
});

export const OVERLAY_SURFACE = cn(
  "z-50 rounded-md border border-border bg-popover text-popover-foreground shadow-md outline-none",
);

export const OVERLAY_BACKDROP = cn(
  "fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
);

export const MENU_ITEM = cn(
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
  MOTION_INTERACTIVE,
  "hover:bg-accent hover:text-accent-foreground",
  "focus-visible:bg-accent focus-visible:text-accent-foreground",
  "data-[focused]:bg-accent data-[focused]:text-accent-foreground",
  DISABLED_DATA,
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

export const MENU_SEPARATOR = "my-1 h-px bg-border";

export const MENU_LABEL =
  "px-2 py-1.5 text-xs font-medium text-muted-foreground";

export const DIALOG_SURFACE = cn(
  "rounded-lg border border-border bg-background text-foreground shadow-lg outline-none",
);

export const DIALOG_CONTENT = cn(
  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 p-6",
  DIALOG_SURFACE,
  MOTION_OVERLAY,
);

export const TOOLTIP_SURFACE = cn(
  "z-50 max-w-xs overflow-hidden rounded-md border border-border bg-foreground px-3 py-1.5 text-xs font-medium leading-snug text-background shadow-md select-none",
  MOTION_OVERLAY,
);

export const ICON_BUTTON = cn(
  "inline-flex h-7 w-7 items-center justify-center rounded-md border border-border bg-background text-foreground",
  MOTION_INTERACTIVE,
  FOCUS_RING,
  DISABLED_DATA,
  "data-[hovered]:bg-accent data-[hovered]:text-accent-foreground",
);

export const FIELD_GROUP = cn(
  "flex w-full min-w-0 items-center overflow-hidden rounded-md border border-input bg-background text-sm text-foreground shadow-xs",
  MOTION_INTERACTIVE,
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background",
  DISABLED,
);

export const swipeTrackVariants = cva(
  "relative isolate flex h-[52px] w-full min-w-[12rem] items-center overflow-hidden rounded-full border border-border bg-muted/35 text-[13px] text-muted-foreground select-none touch-none",
);
