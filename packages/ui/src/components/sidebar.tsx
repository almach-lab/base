import { cn } from "@almach/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { PanelLeft } from "lucide-react";
import * as React from "react";
import { useIsMobile } from "../hooks/use-media-query.js";
import { Separator } from "./separator.js";
import { Skeleton } from "./skeleton.js";
import { Tooltip } from "./tooltip.js";

// ── Constants ──────────────────────────────────────────────────────────────

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";

// ── Context ────────────────────────────────────────────────────────────────

interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

const SidebarCtx = React.createContext<SidebarContextValue | null>(null);

const SIDEBAR_CONTEXT_DEFAULT: SidebarContextValue = {
  state: "expanded",
  open: true,
  setOpen: () => {},
  openMobile: false,
  setOpenMobile: () => {},
  isMobile: false,
  toggleSidebar: () => {},
};

function useSidebar(): SidebarContextValue {
  return React.useContext(SidebarCtx) ?? SIDEBAR_CONTEXT_DEFAULT;
}

// ── SidebarProvider ────────────────────────────────────────────────────────

interface SidebarProviderProps extends React.ComponentPropsWithoutRef<"div"> {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref,
  ) => {
    const isMobile = useIsMobile();
    const [openState, setOpenState] = React.useState(defaultOpen);
    const [openMobile, setOpenMobile] = React.useState(false);

    const open = openProp ?? openState;
    const setOpen = React.useCallback(
      (value: boolean) => {
        if (onOpenChange) onOpenChange(value);
        else setOpenState(value);
      },
      [onOpenChange],
    );

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) setOpenMobile((v) => !v);
      else setOpen(!open);
    }, [isMobile, open, setOpen]);

    React.useEffect(() => {
      const handler = (e: KeyboardEvent) => {
        if (e.key === SIDEBAR_KEYBOARD_SHORTCUT && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          toggleSidebar();
        }
      };
      window.addEventListener("keydown", handler);
      return () => window.removeEventListener("keydown", handler);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const value: SidebarContextValue = React.useMemo(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar],
    );

    return (
      <SidebarCtx.Provider value={value}>
        <Tooltip.Provider>
          <div
            ref={ref}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className,
            )}
            {...props}
          >
            {children}
          </div>
        </Tooltip.Provider>
      </SidebarCtx.Provider>
    );
  },
);
SidebarProvider.displayName = "SidebarProvider";

// ── Sidebar ────────────────────────────────────────────────────────────────

interface SidebarRootProps extends React.ComponentPropsWithoutRef<"div"> {
  side?: "left" | "right";
  variant?: "sidebar" | "floating" | "inset";
  collapsible?: "offcanvas" | "icon" | "none";
}

const SidebarRoot = React.forwardRef<HTMLDivElement, SidebarRootProps>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
            className,
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <>
          {openMobile && (
            <div
              className="fixed inset-0 z-50"
              onClick={() => setOpenMobile(false)}
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
            </div>
          )}
          <div
            data-state={openMobile ? "open" : "closed"}
            data-side={side}
            className={cn(
              "fixed inset-y-0 z-50 flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground shadow-lg",
              "transition-transform [transition-duration:var(--theme-motion-overlay-duration,220ms)] [transition-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none",
              side === "left"
                ? "left-0 data-[state=closed]:-translate-x-full"
                : "right-0 data-[state=closed]:translate-x-full",
              className,
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </>
      );
    }

    return (
      <div
        ref={ref}
        className="group peer hidden text-sidebar-foreground md:block"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
      >
        {/* Width spacer */}
        <div
          className={cn(
            "relative h-svh w-[--sidebar-width] bg-transparent",
            "transition-[width] [transition-duration:var(--theme-motion-overlay-duration,200ms)] [transition-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none",
            "group-data-[collapsible=offcanvas]:w-0",
            variant === "floating" || variant === "inset"
              ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem)]"
              : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
          )}
        />
        {/* Fixed panel */}
        <div
          className={cn(
            "fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] flex-col",
            "transition-[left,right,width] [transition-duration:var(--theme-motion-overlay-duration,200ms)] [transition-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))] motion-reduce:transition-none md:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            variant === "floating" || variant === "inset"
              ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+1rem+2px)]"
              : cn(
                  "group-data-[collapsible=icon]:w-[--sidebar-width-icon]",
                  side === "left"
                    ? "border-r border-sidebar-border/70"
                    : "border-l border-sidebar-border/70",
                ),
            className,
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full w-full flex-col overflow-hidden bg-sidebar",
              variant === "floating" &&
                "rounded-lg border border-sidebar-border/70 shadow-sm",
              variant === "inset" && "rounded-lg",
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);
SidebarRoot.displayName = "Sidebar";

// ── SidebarTrigger ─────────────────────────────────────────────────────────

const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      data-sidebar="trigger"
      type="button"
      className={cn(
        "inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-sidebar-foreground/70",
        "transition-colors [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "-ml-1",
        className,
      )}
      onClick={(e) => {
        onClick?.(e);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle sidebar</span>
    </button>
  );
});
SidebarTrigger.displayName = "SidebarTrigger";

// ── SidebarRail ────────────────────────────────────────────────────────────

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle sidebar"
      tabIndex={-1}
      type="button"
      onClick={toggleSidebar}
      title="Toggle sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 cursor-col-resize select-none",
        "transition-[opacity,color] [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-0.5 after:-translate-x-1/2",
        "after:bg-sidebar-border after:opacity-0 hover:after:opacity-100",
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        className,
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = "SidebarRail";

// ── SidebarInset ───────────────────────────────────────────────────────────

const SidebarInset = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    className={cn(
      "relative flex min-h-svh flex-1 flex-col bg-background",
      "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))]",
      "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2",
      "md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
      className,
    )}
    {...props}
  />
));
SidebarInset.displayName = "SidebarInset";

// ── SidebarHeader ──────────────────────────────────────────────────────────

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="header"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
));
SidebarHeader.displayName = "SidebarHeader";

// ── SidebarFooter ──────────────────────────────────────────────────────────

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="footer"
    className={cn("flex flex-col gap-2 p-2", className)}
    {...props}
  />
));
SidebarFooter.displayName = "SidebarFooter";

// ── SidebarSeparator ───────────────────────────────────────────────────────

const SidebarSeparator = React.forwardRef<
  React.ComponentRef<typeof Separator>,
  React.ComponentPropsWithoutRef<typeof Separator>
>(({ className, ...props }, ref) => (
  <Separator
    ref={ref}
    data-sidebar="separator"
    className={cn("mx-2 w-auto bg-sidebar-border/70", className)}
    {...props}
  />
));
SidebarSeparator.displayName = "SidebarSeparator";

// ── SidebarContent ─────────────────────────────────────────────────────────

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="content"
    className={cn(
      "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
      "group-data-[collapsible=icon]:overflow-hidden",
      className,
    )}
    {...props}
  />
));
SidebarContent.displayName = "SidebarContent";

// ── SidebarGroup ───────────────────────────────────────────────────────────

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group"
    className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
    {...props}
  />
));
SidebarGroup.displayName = "SidebarGroup";

// ── SidebarGroupLabel ──────────────────────────────────────────────────────

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "div";
  return (
    <Comp
      ref={ref as React.Ref<HTMLDivElement>}
      data-sidebar="group-label"
      className={cn(
        "flex h-8 shrink-0 items-center rounded-md px-2",
        "text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/40",
        "overflow-hidden",
        "transition-[margin,opacity] [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";

// ── SidebarGroupAction ─────────────────────────────────────────────────────

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      ref={ref as React.Ref<HTMLButtonElement>}
      data-sidebar="group-action"
      type={asChild ? undefined : "button"}
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "text-sidebar-foreground/60 outline-none",
        "transition-colors [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = "SidebarGroupAction";

// ── SidebarGroupContent ────────────────────────────────────────────────────

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
));
SidebarGroupContent.displayName = "SidebarGroupContent";

// ── SidebarMenu ────────────────────────────────────────────────────────────

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-0.5", className)}
    {...props}
  />
));
SidebarMenu.displayName = "SidebarMenu";

// ── SidebarMenuItem ────────────────────────────────────────────────────────

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
));
SidebarMenuItem.displayName = "SidebarMenuItem";

// ── SidebarMenuButton ──────────────────────────────────────────────────────

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2",
    "text-left text-sm outline-none",
    "ring-sidebar-ring",
    "transition-[width,height,padding,background-color,color]",
    "[transition-duration:var(--theme-motion-interactive-duration,0.15s)]",
    "[transition-timing-function:var(--theme-motion-ease-standard,cubic-bezier(0.22,1,0.36,1))]",
    "motion-reduce:transition-none",
    "focus-visible:ring-2",
    "active:bg-sidebar-accent active:text-sidebar-accent-foreground",
    "disabled:pointer-events-none disabled:opacity-50",
    "aria-disabled:pointer-events-none aria-disabled:opacity-50",
    "group-has-[[data-sidebar=menu-action]]/menu-item:pr-8",
    "[&>span:last-child]:truncate",
    "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
    "group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2",
    "group-data-[collapsible=icon]:[&>span:last-child]:hidden",
    "group-data-[collapsible=icon]:[&>svg]:mx-auto",
  ],
  {
    variants: {
      variant: {
        default:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
      isActive: {
        true: "bg-sidebar-primary/12 font-medium text-sidebar-primary",
        false: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      isActive: false,
    },
  },
);

interface SidebarMenuButtonProps
  extends React.ComponentPropsWithoutRef<"button">,
    VariantProps<typeof sidebarMenuButtonVariants> {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | React.ComponentPropsWithoutRef<typeof Tooltip.Content>;
}

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuButtonProps
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { isMobile, state } = useSidebar();

    const button = asChild ? (
      React.cloneElement(
        React.Children.only(children as React.ReactElement),
        {
          ref,
          "data-sidebar": "menu-button",
          "data-active": isActive,
          className: cn(
            sidebarMenuButtonVariants({ variant, size, isActive }),
            className,
          ),
          ...props,
        },
      )
    ) : (
      <button
        ref={ref}
        data-sidebar="menu-button"
        data-active={isActive}
        type="button"
        className={cn(
          sidebarMenuButtonVariants({ variant, size, isActive }),
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );

    if (!tooltip) return button;

    const tooltipProps: React.ComponentPropsWithoutRef<typeof Tooltip.Content> =
      typeof tooltip === "string" ? { children: tooltip } : tooltip;

    return (
      <Tooltip>
        <Tooltip.Trigger asChild>{button}</Tooltip.Trigger>
        <Tooltip.Content
          side="right"
          align="center"
          {...tooltipProps}
          className={cn(
            state !== "collapsed" || isMobile ? "hidden" : undefined,
            tooltipProps.className,
          )}
        />
      </Tooltip>
    );
  },
);
SidebarMenuButton.displayName = "SidebarMenuButton";

// ── SidebarMenuAction ──────────────────────────────────────────────────────

interface SidebarMenuActionProps
  extends React.ComponentPropsWithoutRef<"button"> {
  asChild?: boolean;
  showOnHover?: boolean;
}

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  SidebarMenuActionProps
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button";
  return (
    <Comp
      ref={ref as React.Ref<HTMLButtonElement>}
      data-sidebar="menu-action"
      type={asChild ? undefined : "button"}
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0",
        "text-sidebar-foreground/60 outline-none",
        "transition-colors [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
        "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        "[&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[active=true]/menu-button:text-sidebar-primary-foreground",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-primary-foreground md:opacity-0",
        "group-data-[collapsible=icon]:hidden",
        className,
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = "SidebarMenuAction";

// ── SidebarMenuBadge ───────────────────────────────────────────────────────

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1",
      "text-[10px] font-medium tabular-nums text-sidebar-foreground",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-primary-foreground",
      "flex items-center",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = "SidebarMenuBadge";

// ── SidebarMenuSkeleton ────────────────────────────────────────────────────

interface SidebarMenuSkeletonProps
  extends React.ComponentPropsWithoutRef<"div"> {
  showIcon?: boolean;
}

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  SidebarMenuSkeletonProps
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(
    () => `${Math.floor(Math.random() * 40) + 50}%`,
    [],
  );
  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="h-4 w-4 shrink-0 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[--skeleton-width] flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width } as React.CSSProperties}
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";

// ── SidebarMenuSub ─────────────────────────────────────────────────────────

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentPropsWithoutRef<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-0.5 border-l border-sidebar-border/50 px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className,
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = "SidebarMenuSub";

// ── SidebarMenuSubItem ─────────────────────────────────────────────────────

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

// ── SidebarMenuSubButton ───────────────────────────────────────────────────

interface SidebarMenuSubButtonProps
  extends React.ComponentPropsWithoutRef<"a"> {
  asChild?: boolean;
  size?: "sm" | "md";
  isActive?: boolean;
}

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  SidebarMenuSubButtonProps
>(
  (
    { asChild = false, size = "md", isActive = false, className, ...props },
    ref,
  ) => {
    const Comp = asChild ? React.Fragment : "a";
    return (
      <Comp
        ref={ref as React.Ref<HTMLAnchorElement>}
        data-sidebar="menu-sub-button"
        data-active={isActive}
        className={cn(
          "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2",
          "text-sidebar-foreground/70 outline-none",
          "transition-colors [transition-duration:var(--theme-motion-interactive-duration,0.15s)] motion-reduce:transition-none",
          "hover:bg-sidebar-accent hover:text-sidebar-foreground",
          "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
          "active:bg-sidebar-accent active:text-sidebar-foreground",
          isActive && "font-medium text-sidebar-primary",
          size === "sm" ? "text-xs" : "text-sm",
          "[&>span:last-child]:truncate",
          "[&>svg]:h-3.5 [&>svg]:w-3.5 [&>svg]:shrink-0 [&>svg]:text-sidebar-foreground/60",
          "group-data-[collapsible=icon]:hidden",
          className,
        )}
        {...props}
      />
    );
  },
);
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

// ── Exports ────────────────────────────────────────────────────────────────

export { useSidebar };

export const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Trigger: SidebarTrigger,
  Rail: SidebarRail,
  Inset: SidebarInset,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  Separator: SidebarSeparator,
  Group: SidebarGroup,
  GroupLabel: SidebarGroupLabel,
  GroupAction: SidebarGroupAction,
  GroupContent: SidebarGroupContent,
  Menu: SidebarMenu,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuAction: SidebarMenuAction,
  MenuBadge: SidebarMenuBadge,
  MenuSkeleton: SidebarMenuSkeleton,
  MenuSub: SidebarMenuSub,
  MenuSubItem: SidebarMenuSubItem,
  MenuSubButton: SidebarMenuSubButton,
});
