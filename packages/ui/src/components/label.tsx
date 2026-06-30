"use client";

import { cn } from "@almach/utils";
import * as React from "react";
import { CONTROL_LABEL } from "./_styles.js";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      CONTROL_LABEL,
      "cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
      className,
    )}
    {...props}
  >
    {children}
    {required && (
      <span className="ml-0.5 text-destructive" aria-hidden="true">
        *
      </span>
    )}
  </label>
));

Label.displayName = "Label";

export { Label };
