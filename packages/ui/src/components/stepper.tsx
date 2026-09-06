import { cn } from "@almach/utils";
import { Check } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";

type StepperOrientation = "horizontal" | "vertical";
type StepStatus = "complete" | "current" | "upcoming";

interface StepperCtxValue {
  activeStep: number;
  orientation: StepperOrientation;
}

const StepperCtx = React.createContext<StepperCtxValue | null>(null);

function useStepperCtx() {
  const ctx = React.useContext(StepperCtx);
  if (!ctx) throw new Error("Stepper parts must be used within Stepper");
  return ctx;
}

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  /** Index of the current step, 0-indexed. */
  activeStep: number;
  orientation?: StepperOrientation;
}

const StepperRoot = React.forwardRef<HTMLOListElement, StepperProps>(
  (
    { className, activeStep, orientation = "horizontal", children, ...props },
    ref,
  ) => {
    const items = React.Children.toArray(children);

    return (
      <StepperCtx.Provider value={{ activeStep, orientation }}>
        <ol
          ref={ref}
          className={cn(
            "flex w-full",
            orientation === "horizontal"
              ? "flex-row items-start"
              : "flex-col gap-0",
            className,
          )}
          {...props}
        >
          {items.map((child, index) =>
            React.isValidElement<StepperItemInternalProps>(child)
              ? React.cloneElement(child, {
                  index,
                  isLast: index === items.length - 1,
                })
              : child,
          )}
        </ol>
      </StepperCtx.Provider>
    );
  },
);
StepperRoot.displayName = "Stepper";

interface StepperItemInternalProps {
  index?: number;
  isLast?: boolean;
}

export interface StepperItemProps
  extends
    Omit<React.LiHTMLAttributes<HTMLLIElement>, "children" | "title">,
    StepperItemInternalProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Override the auto-derived status. */
  status?: StepStatus;
  /** Replace the number/check indicator. */
  icon?: React.ReactNode;
}

const StepperItem = React.forwardRef<HTMLLIElement, StepperItemProps>(
  (
    {
      className,
      title,
      description,
      status,
      icon,
      index = 0,
      isLast = false,
      ...props
    },
    ref,
  ) => {
    const { activeStep, orientation } = useStepperCtx();
    const resolved: StepStatus =
      status ??
      (index < activeStep
        ? "complete"
        : index === activeStep
          ? "current"
          : "upcoming");

    const indicator = (
      <span
        aria-hidden="true"
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
          MOTION_INTERACTIVE,
          resolved === "complete" &&
            "border-primary bg-primary text-primary-foreground",
          resolved === "current" &&
            "border-primary bg-background text-primary ring-2 ring-primary/25",
          resolved === "upcoming" &&
            "border-border bg-muted/40 text-muted-foreground",
          "[&_svg]:size-4",
        )}
      >
        {icon ?? (resolved === "complete" ? <Check /> : index + 1)}
      </span>
    );

    const connector = !isLast && (
      <span
        aria-hidden="true"
        className={cn(
          "bg-border",
          MOTION_INTERACTIVE,
          resolved === "complete" && "bg-primary",
          orientation === "horizontal"
            ? "mt-4 h-px flex-1"
            : "mx-auto w-px flex-1",
        )}
      />
    );

    const labels = (
      <span className="flex flex-col gap-0.5">
        <span
          className={cn(
            "text-sm font-medium leading-tight",
            resolved === "upcoming"
              ? "text-muted-foreground"
              : "text-foreground",
          )}
        >
          {title}
        </span>
        {description && (
          <span className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    );

    if (orientation === "vertical") {
      return (
        <li
          ref={ref}
          {...(resolved === "current"
            ? { "aria-current": "step" as const }
            : {})}
          data-status={resolved}
          className={cn("flex gap-3", isLast ? "" : "pb-6", className)}
          {...props}
        >
          <span className="flex flex-col items-center self-stretch">
            {indicator}
            {connector}
          </span>
          <span className="pt-1.5">{labels}</span>
        </li>
      );
    }

    return (
      <li
        ref={ref}
        {...(resolved === "current" ? { "aria-current": "step" as const } : {})}
        data-status={resolved}
        className={cn(
          "flex min-w-0 items-start gap-3",
          isLast ? "shrink-0" : "flex-1",
          className,
        )}
        {...props}
      >
        <span className="flex flex-col items-start gap-2">{indicator}</span>
        <span className="min-w-0 pt-1">{labels}</span>
        {connector}
      </li>
    );
  },
);
StepperItem.displayName = "Stepper.Item";

const Stepper = Object.assign(StepperRoot, { Item: StepperItem });

export { Stepper };
