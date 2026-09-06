"use client";

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
  ].join(" "),
  // `min-w-0` plus wrapping keeps a long title inside the toast rather than
  // letting it run past the edge.
  title: "!text-sm !font-semibold !min-w-0 !break-words",
  description: "!text-sm !text-muted-foreground !min-w-0 !break-words",
  actionButton: "!text-xs !font-medium !bg-primary !text-primary-foreground",
  cancelButton: "!text-xs !font-medium !bg-muted !text-muted-foreground",
  closeButton:
    "!text-muted-foreground hover:!text-foreground !border-border !bg-background",
  error: "!border-destructive/35 !bg-background",
  success: "!border-success/35 !bg-background",
  warning: "!border-warning/35 !bg-background",
  info: "!border-border",
};

export function Toaster({
  position = "bottom-right",
  theme = "system",
  width = "22rem",
  toastOptions,
  style,
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
      style={{ "--width": width, ...style } as React.CSSProperties}
      toastOptions={mergedToastOptions}
      {...props}
    />
  );
}
