import { cn } from "@almach/utils";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import * as React from "react";
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
} from "react-aria-components";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";

type AriaBreadcrumbsProps = React.ComponentPropsWithoutRef<
  typeof AriaBreadcrumbs
>;

export interface BreadcrumbProps extends Omit<
  AriaBreadcrumbsProps,
  "className"
> {
  className?: string;
}

const BreadcrumbRoot = React.forwardRef<HTMLOListElement, BreadcrumbProps>(
  ({ className, ...props }, ref) => (
    <AriaBreadcrumbs
      ref={ref}
      className={cn(
        "flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbRoot.displayName = "Breadcrumb";

export interface BreadcrumbItemProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaBreadcrumb>,
  "className" | "children"
> {
  className?: string;
  /** Crumb content. Render-function children are not supported here. */
  children?: React.ReactNode;
}

/**
 * A single crumb. The trailing separator is hidden on the current (last) crumb
 * via React Aria's `data-current` state, so no manual separator is needed.
 */
const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
  ({ className, children, ...props }, ref) => (
    <AriaBreadcrumb
      ref={ref}
      className={cn("group flex items-center gap-1.5", className)}
      {...props}
    >
      {children}
      <ChevronRight
        aria-hidden="true"
        className="size-3.5 shrink-0 text-muted-foreground/60 group-data-[current]:hidden"
      />
    </AriaBreadcrumb>
  ),
);
BreadcrumbItem.displayName = "Breadcrumb.Item";

export interface BreadcrumbLinkProps extends Omit<
  React.ComponentPropsWithoutRef<typeof AriaLink>,
  "className"
> {
  className?: string;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, ...props }, ref) => (
    <AriaLink
      ref={ref}
      className={cn(
        "rounded-sm text-muted-foreground",
        MOTION_INTERACTIVE,
        FOCUS_RING,
        DISABLED_DATA,
        "data-[hovered]:text-foreground",
        className,
      )}
      {...props}
    />
  ),
);
BreadcrumbLink.displayName = "Breadcrumb.Link";

/** The final, non-interactive crumb. */
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    aria-current="page"
    className={cn("font-medium text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "Breadcrumb.Page";

/** Collapsed-crumbs affordance. Pair with a DropdownMenu to reveal the rest. */
const BreadcrumbEllipsis = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    className={cn("flex size-5 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal aria-hidden="true" className="size-4" />
    <span className="sr-only">More</span>
  </span>
));
BreadcrumbEllipsis.displayName = "Breadcrumb.Ellipsis";

const Breadcrumb = Object.assign(BreadcrumbRoot, {
  Item: BreadcrumbItem,
  Link: BreadcrumbLink,
  Page: BreadcrumbPage,
  Ellipsis: BreadcrumbEllipsis,
});

export { Breadcrumb };
