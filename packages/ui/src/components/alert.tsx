import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const alertVariants = cva("relative w-full rounded-xl border p-4 flex gap-3", {
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
  defaultVariants: {
    variant: "default",
  },
});

export interface AlertRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

const AlertRoot = React.forwardRef<HTMLDivElement, AlertRootProps>(
  ({ className, variant = "default", style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        style={style}
        {...props}
      />
    );
  },
);
AlertRoot.displayName = "Alert";

const AlertIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("mt-0.5 shrink-0 [&_svg]:size-4", className)}
      {...props}
    />
  );
});
AlertIcon.displayName = "Alert.Icon";

const AlertBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
});
AlertBody.displayName = "Alert.Body";

const AlertTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => {
  return (
    <h5
      ref={ref}
      className={cn(
        "text-sm font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
});
AlertTitle.displayName = "Alert.Title";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "text-sm opacity-90 [&_p]:leading-relaxed mt-0.5",
        className,
      )}
      {...props}
    />
  );
});
AlertDescription.displayName = "Alert.Description";

const Alert = Object.assign(AlertRoot, {
  Icon: AlertIcon,
  Body: AlertBody,
  Title: AlertTitle,
  Description: AlertDescription,
});

export { Alert, alertVariants };
