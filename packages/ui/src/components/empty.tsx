import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const emptyVariants = cva(
  "flex w-full flex-col items-center justify-center text-center",
  {
    variants: {
      variant: {
        plain: "",
        bordered: "rounded-lg border border-border bg-card",
        dashed: "rounded-lg border border-dashed border-border",
      },
      size: {
        sm: "gap-2 px-4 py-8",
        default: "gap-3 px-6 py-12",
        lg: "gap-4 px-8 py-16",
      },
    },
    defaultVariants: { variant: "plain", size: "default" },
  },
);

export interface EmptyProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyVariants> {}

const EmptyRoot = React.forwardRef<HTMLDivElement, EmptyProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(emptyVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
EmptyRoot.displayName = "Empty";

/** Circular icon well. Pass a single lucide icon as the child. */
const EmptyIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "flex size-11 items-center justify-center rounded-full border border-border bg-muted/50 text-muted-foreground",
      "[&_svg]:size-5 [&_svg]:shrink-0",
      className,
    )}
    {...props}
  />
));
EmptyIcon.displayName = "Empty.Icon";

const EmptyTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
EmptyTitle.displayName = "Empty.Title";

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "max-w-sm text-sm leading-relaxed text-muted-foreground",
      className,
    )}
    {...props}
  />
));
EmptyDescription.displayName = "Empty.Description";

const EmptyActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mt-1 flex flex-wrap items-center justify-center gap-2",
      className,
    )}
    {...props}
  />
));
EmptyActions.displayName = "Empty.Actions";

const Empty = Object.assign(EmptyRoot, {
  Icon: EmptyIcon,
  Title: EmptyTitle,
  Description: EmptyDescription,
  Actions: EmptyActions,
});

export { Empty, emptyVariants };
