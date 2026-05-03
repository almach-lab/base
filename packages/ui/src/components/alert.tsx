import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

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

interface AlertRootProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

// Root element
function AlertRoot({
  className,
  variant = "default",
  style,
  ...props
}: AlertRootProps) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      style={style}
      {...props}
    />
  );
}
AlertRoot.displayName = "Alert";

// Icon slot
function AlertIcon({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-0.5 shrink-0 [&_svg]:size-4", className)}
      {...props}
    />
  );
}
AlertIcon.displayName = "Alert.Icon";

// Text column
function AlertBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  );
}
AlertBody.displayName = "Alert.Body";

// Title
function AlertTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h5
      className={cn(
        "text-sm font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  );
}
AlertTitle.displayName = "Alert.Title";

// Description
function AlertDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <div
      className={cn(
        "text-sm opacity-90 [&_p]:leading-relaxed mt-0.5",
        className,
      )}
      {...props}
    />
  );
}
AlertDescription.displayName = "Alert.Description";

// Compound object
const Alert = Object.assign(AlertRoot, {
  Icon: AlertIcon,
  Body: AlertBody,
  Title: AlertTitle,
  Description: AlertDescription,
});

export { Alert, type AlertRootProps, alertVariants };
