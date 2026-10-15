"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import {
  Toaster as SonnerToaster,
  type ToasterProps as SonnerToasterProps,
} from "sonner";

/**
 * Toast host. Mount once, near the root of the app.
 *
 * Sonner's own props pass straight through, so position, duration and the
 * close button stay configurable; only the defaults and the token-based
 * styling are ours. `--width` is set explicitly because Sonner's container
 * rule is `width: var(--width)`, which collapses to `auto` if nothing defines
 * it — long titles then overflow the toast instead of wrapping.
 *
 * Below 600px Sonner also sets the toaster to `width: 100%` while insetting it
 * with `left` and `right`, so the list is wider than the screen and the toast
 * (`!w-full`) runs off the right edge. `max-[600px]:!w-auto` lets those
 * offsets size the list instead. The close button is pulled inside the card;
 * Sonner parks it on the corner with a negative translate.
 *
 * Default offsets add the safe-area insets so toasts clear the notch, Dynamic
 * Island and home indicator when the page uses `viewport-fit=cover`.
 */
export interface ToasterProps extends SonnerToasterProps {
  /** Toast width. Any CSS length. */
  width?: string;
}

const TOAST_CLASSNAMES: NonNullable<
  NonNullable<SonnerToasterProps["toastOptions"]>["classNames"]
> = {
  toast: [
    "!w-full !bg-background !border !border-border !text-foreground",
    "!rounded-2xl !shadow-lg font-sans",
    // Clear the close button, which sits in the top end corner.
    "has-[[data-close-button]]:!pe-9",
  ].join(" "),
  // `min-w-0` plus wrapping keeps a long title inside the toast rather than
  // letting it run past the edge.
  title: "!text-sm !font-semibold !min-w-0 !break-words",
  description: "!text-sm !text-muted-foreground !min-w-0 !break-words",
  actionButton: "!text-xs !font-medium !bg-primary !text-primary-foreground",
  cancelButton: "!text-xs !font-medium !bg-muted !text-muted-foreground",
  closeButton: [
    "!text-muted-foreground hover:!text-foreground !border-border !bg-background",
    // Sonner's own rule is `transform: translate(-35%, -35%)`, which hangs the
    // button outside the card. `translate` and `transform` stack, so this has
    // to clear `transform`, not just the translate utility. Top end corner,
    // clear of the type icon at the start.
    "!top-2.5 !inset-e-2.5 !inset-s-auto !transform-none",
  ].join(" "),
  error: "!border-destructive/35 !bg-background",
  success: "!border-success/35 !bg-background",
  warning: "!border-warning/35 !bg-background",
  info: "!border-border",
};

function safeAreaOffset(base: string) {
  return {
    top: `calc(${base} + env(safe-area-inset-top, 0px))`,
    right: `calc(${base} + env(safe-area-inset-right, 0px))`,
    bottom: `calc(${base} + env(safe-area-inset-bottom, 0px))`,
    left: `calc(${base} + env(safe-area-inset-left, 0px))`,
  };
}

const DEFAULT_OFFSET = safeAreaOffset("24px");
const DEFAULT_MOBILE_OFFSET = safeAreaOffset("16px");

export function Toaster({
  position = "bottom-right",
  theme = "system",
  width = "22rem",
  offset = DEFAULT_OFFSET,
  mobileOffset = DEFAULT_MOBILE_OFFSET,
  toastOptions,
  style,
  className,
  ...props
}: ToasterProps) {
  const mergedToastOptions = React.useMemo(
    () => ({
      ...toastOptions,
      classNames: { ...TOAST_CLASSNAMES, ...toastOptions?.classNames },
    }),
    [toastOptions],
  );

  return (
    <SonnerToaster
      position={position}
      theme={theme}
      offset={offset}
      mobileOffset={mobileOffset}
      className={cn("max-[600px]:!w-auto", className)}
      style={{ "--width": width, ...style } as React.CSSProperties}
      toastOptions={mergedToastOptions}
      {...props}
    />
  );
}
