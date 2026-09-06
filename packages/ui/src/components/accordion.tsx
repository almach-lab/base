import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from "react-aria-components";
import { MOTION_COLLAPSE, MOTION_INTERACTIVE } from "./_motion.js";
import { CONTROL_LABEL, DISABLED_DATA, FOCUS_RING } from "./_styles.js";

const accordionVariants = cva("w-full text-sm", {
  variants: {
    variant: {
      bordered:
        "divide-y divide-border overflow-hidden rounded-lg border border-border bg-card",
      separated: "flex flex-col gap-2",
      ghost: "divide-y divide-border",
    },
  },
  defaultVariants: { variant: "bordered" },
});

const accordionItemVariants = cva("group", {
  variants: {
    variant: {
      bordered: "",
      separated: "rounded-lg border border-border bg-card",
      ghost: "",
    },
  },
  defaultVariants: { variant: "bordered" },
});

const AccordionVariantCtx =
  React.createContext<
    NonNullable<VariantProps<typeof accordionVariants>["variant"]>
  >("bordered");

export interface AccordionProps
  extends
    Omit<React.ComponentPropsWithoutRef<typeof DisclosureGroup>, "className">,
    VariantProps<typeof accordionVariants> {
  className?: string;
}

const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, variant, ...props }, ref) => (
    <AccordionVariantCtx.Provider value={variant ?? "bordered"}>
      <DisclosureGroup
        ref={ref}
        className={cn(accordionVariants({ variant }), className)}
        {...props}
      />
    </AccordionVariantCtx.Provider>
  ),
);
AccordionRoot.displayName = "Accordion";

export interface AccordionItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Disclosure>,
  "className"
> {
  className?: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, ...props }, ref) => {
    const variant = React.useContext(AccordionVariantCtx);
    return (
      <Disclosure
        ref={ref}
        className={cn(accordionItemVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
AccordionItem.displayName = "Accordion.Item";

export interface AccordionTriggerProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children" | "slot"
> {
  children?: React.ReactNode;
  /** Hide the chevron affordance. */
  hideIndicator?: boolean;
}

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionTriggerProps
>(({ className, children, hideIndicator, ...props }, ref) => (
  <Heading level={3} className="flex">
    <Button
      ref={ref}
      slot="trigger"
      className={cn(
        "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5 text-left",
        CONTROL_LABEL,
        MOTION_INTERACTIVE,
        FOCUS_RING,
        DISABLED_DATA,
        "data-[hovered]:bg-accent/40",
        className,
      )}
      {...props}
    >
      {children}
      {!hideIndicator && (
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 text-muted-foreground",
            MOTION_INTERACTIVE,
            "group-data-[expanded]:rotate-180",
          )}
        />
      )}
    </Button>
  </Heading>
));
AccordionTrigger.displayName = "Accordion.Trigger";

export interface AccordionContentProps extends Omit<
  React.ComponentPropsWithoutRef<typeof DisclosurePanel>,
  "className"
> {
  className?: string;
}

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <DisclosurePanel
    ref={ref}
    className={cn(
      "grid grid-rows-[0fr] text-sm leading-relaxed text-muted-foreground opacity-0",
      MOTION_COLLAPSE,
      "group-data-[expanded]:grid-rows-[1fr] group-data-[expanded]:opacity-100",
    )}
    {...props}
  >
    <div className="min-h-0 overflow-hidden">
      <div className={cn("px-4 pb-4", className)}>{children}</div>
    </div>
  </DisclosurePanel>
));
AccordionContent.displayName = "Accordion.Content";

const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});

export { Accordion, accordionVariants };
