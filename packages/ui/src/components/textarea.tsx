import { cn } from "@almach/utils";
import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { fieldErrorClass, textareaVariants } from "./_styles.js";

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size = "default", error, ...props }, ref) => (
    <textarea
      className={cn(
        textareaVariants({ size }),
        fieldErrorClass(error),
        className,
      )}
      ref={ref}
      aria-invalid={error || undefined}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";

export { Textarea, textareaVariants };
