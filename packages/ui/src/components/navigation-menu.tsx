import { cn } from "@almach/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { DISABLED_DATA, FOCUS_RING } from "./_styles.js";
import { HoverCard } from "./hover-card.js";

const itemClasses = cn(
  "inline-flex h-9 cursor-pointer select-none items-center gap-1.5 rounded-md px-3",
  "text-sm font-medium text-muted-foreground outline-none",
  MOTION_INTERACTIVE,
  FOCUS_RING,
  DISABLED_DATA,
  "hover:bg-accent hover:text-accent-foreground",
  "[&_svg]:size-4 [&_svg]:shrink-0",
);

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Accessible label for the surrounding `nav`. */
  label?: string;
}

const NavigationMenuRoot = React.forwardRef<HTMLElement, NavigationMenuProps>(
  ({ className, label = "Main", ...props }, ref) => (
    <nav ref={ref} aria-label={label} className={cn("flex", className)}>
      <div className={cn("flex items-center gap-0.5")} {...props} />
    </nav>
  ),
);
NavigationMenuRoot.displayName = "NavigationMenu";

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Marks the link as the current page. */
  active?: boolean;
}

/** A plain top-level link, for sections with no dropdown panel. */
const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuLinkProps
>(({ className, active = false, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(itemClasses, active && "text-foreground", className)}
    {...(active ? { "aria-current": "page" as const } : {})}
    {...props}
  />
));
NavigationMenuLink.displayName = "NavigationMenu.Link";

export interface NavigationMenuItemProps {
  /** Trigger label. */
  label: React.ReactNode;
  /** Panel contents. */
  children?: React.ReactNode;
  className?: string;
  /** Panel width. Defaults to a comfortable two-column panel. */
  panelClassName?: string;
  /** Delay before the panel opens, in ms. */
  openDelay?: number;
}

/**
 * A top-level entry that reveals a panel. Built on HoverCard, so it opens on
 * pointer hover and on keyboard focus.
 */
function NavigationMenuItem({
  label,
  children,
  className,
  panelClassName,
  openDelay = 120,
}: NavigationMenuItemProps) {
  return (
    <HoverCard openDelay={openDelay} closeDelay={160}>
      <HoverCard.Trigger>
        <button
          type="button"
          className={cn(itemClasses, "group/nav", className)}
        >
          {label}
          <ChevronDown
            aria-hidden="true"
            className={cn(MOTION_INTERACTIVE, "text-muted-foreground/70")}
          />
        </button>
      </HoverCard.Trigger>
      <HoverCard.Content
        side="bottom"
        align="start"
        sideOffset={6}
        className={cn("w-[26rem] p-3", panelClassName)}
      >
        {children}
      </HoverCard.Content>
    </HoverCard>
  );
}
NavigationMenuItem.displayName = "NavigationMenu.Item";

/** Grid wrapper for panel entries. */
const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement> & { columns?: 1 | 2 }
>(({ className, columns = 2, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      "grid gap-1",
      columns === 2 ? "grid-cols-2" : "grid-cols-1",
      className,
    )}
    {...props}
  />
));
NavigationMenuList.displayName = "NavigationMenu.List";

export interface NavigationMenuEntryProps extends Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "title"
> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

/** One link inside a panel: title, optional description and icon. */
const NavigationMenuEntry = React.forwardRef<
  HTMLAnchorElement,
  NavigationMenuEntryProps
>(({ className, title, description, icon, ...props }, ref) => (
  <li>
    <a
      ref={ref}
      className={cn(
        "flex items-start gap-3 rounded-md p-2.5 outline-none",
        MOTION_INTERACTIVE,
        FOCUS_RING,
        "hover:bg-accent/60",
        className,
      )}
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-muted/40 text-muted-foreground [&_svg]:size-4"
        >
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="text-sm font-medium leading-tight text-foreground">
          {title}
        </span>
        {description && (
          <span className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </span>
        )}
      </span>
    </a>
  </li>
));
NavigationMenuEntry.displayName = "NavigationMenu.Entry";

const NavigationMenu = Object.assign(NavigationMenuRoot, {
  Item: NavigationMenuItem,
  Link: NavigationMenuLink,
  List: NavigationMenuList,
  Entry: NavigationMenuEntry,
});

export { NavigationMenu };
