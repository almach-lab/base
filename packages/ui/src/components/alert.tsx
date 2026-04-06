import { cn } from "@almach/utils";
import type * as React from "react";

type AlertVariant = "default" | "destructive" | "success" | "warning";

const alertStyles: Record<AlertVariant, React.CSSProperties> = {
  default: {},
  destructive: {
    backgroundColor: "hsl(var(--destructive) / 0.05)",
    borderColor: "hsl(var(--destructive) / 0.3)",
    color: "hsl(var(--destructive))",
  },
  success: {
    backgroundColor: "hsl(var(--success) / 0.05)",
    borderColor: "hsl(var(--success) / 0.3)",
    color: "hsl(var(--success))",
  },
  warning: {
    backgroundColor: "hsl(var(--warning) / 0.05)",
    borderColor: "hsl(var(--warning) / 0.3)",
    color: "hsl(var(--warning))",
  },
};

interface AlertRootProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

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
      className={cn(
        "relative w-full rounded-xl border p-4 flex gap-3",
        className,
      )}
      style={{ ...alertStyles[variant], ...style }}
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

export { Alert, type AlertRootProps, type AlertVariant };
