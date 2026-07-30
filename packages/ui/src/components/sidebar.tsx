"use client";

import { cn } from "@almach/utils";
import { cva } from "class-variance-authority";
import { ChevronRight, PanelLeft } from "lucide-react";
import * as React from "react";
import {
  Dialog as AriaDialog,
  Modal as AriaModal,
  ModalOverlay,
} from "react-aria-components";
import { useIsMobile } from "../hooks/use-media-query.js";
import { MOTION_INTERACTIVE } from "./_motion.js";
import { FOCUS_RING, OVERLAY_BACKDROP } from "./_styles.js";

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3.5rem";

interface SidebarContextValue {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
  contained: boolean;
  contentId: string;
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  openMobile: openMobileProp,
  onOpenMobileChange,
  contained = false,
  sidebarWidth = SIDEBAR_WIDTH,
  sidebarWidthIcon = SIDEBAR_WIDTH_ICON,
  className,
  children,
  ...props
}: React.PropsWithChildren<{
  defaultOpen?: boolean | undefined;
  open?: boolean | undefined;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean | undefined;
  onOpenMobileChange?: (open: boolean) => void;
  contained?: boolean;
  sidebarWidth?: string;
  sidebarWidthIcon?: string;
  className?: string;
}>) {
  const isMobile = useIsMobile();
  const [openState, setOpenState] = React.useState(defaultOpen);
  const [openMobileState, setOpenMobileState] = React.useState(false);
  const contentId = React.useId();

  const open = openProp ?? openState;
  const setOpen = (value: boolean) => {
    onOpenChange?.(value);
    if (openProp === undefined) setOpenState(value);
  };

  const openMobile = openMobileProp ?? openMobileState;
  const setOpenMobile = (value: boolean) => {
    onOpenMobileChange?.(value);
    if (openMobileProp === undefined) setOpenMobileState(value);
  };

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    } else {
      setOpen(!open);
    }
  }, [isMobile, open, openMobile, setOpen, setOpenMobile]);

  React.useEffect(() => {
    if (isMobile) {
      return;
    }

    setOpenMobile(false);
  }, [isMobile]);

  const state = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
        contained,
        contentId,
      }}
    >
      <div
        style={
          {
            "--sidebar-width": sidebarWidth,
            "--sidebar-width-icon": sidebarWidthIcon,
          } as React.CSSProperties
        }
        className={cn(
          contained
            ? "group/sidebar-wrapper flex h-full w-full bg-background"
            : "group/sidebar-wrapper flex min-h-svh w-full bg-background",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
}

export const SidebarRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "sidebar" | "floating" | "inset";
    contained?: boolean;
  }
>(({ variant = "sidebar", contained, className, children, ...props }, ref) => {
  const {
    isMobile,
    open,
    openMobile,
    setOpenMobile,
    contained: containedFromProvider,
    contentId,
  } = useSidebar();
  const isContained = contained ?? containedFromProvider;
  const desktopWidthClass = open
    ? "w-[var(--sidebar-width)]"
    : "w-[var(--sidebar-width-icon)]";

  if (isMobile) {
    return (
      <ModalOverlay
        isOpen={openMobile}
        onOpenChange={setOpenMobile}
        className={cn(
          OVERLAY_BACKDROP,
          "data-[entering]:animate-in data-[exiting]:animate-out",
          "data-[entering]:fade-in data-[exiting]:fade-out",
        )}
      >
        <AriaModal
          className={cn(
            "fixed inset-y-0 left-0 w-72 max-w-[85vw] border-r border-sidebar-border bg-sidebar shadow-lg",
            "data-[entering]:animate-in data-[exiting]:animate-out",
            "data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left duration-300",
            className,
          )}
        >
          <AriaDialog
            id={contentId}
            aria-label="Navigation Sidebar"
            className="flex h-full flex-col outline-none"
          >
            {children}
          </AriaDialog>
        </AriaModal>
      </ModalOverlay>
    );
  }

  return (
    <div
      ref={ref}
      className={cn(
        isContained ? "group peer shrink-0" : "group peer hidden md:block",
        variant === "inset" && "px-3 py-3",
      )}
      data-state={open ? "expanded" : "collapsed"}
      data-variant={variant}
    >
      <div
        id={contentId}
        className={cn(
          isContained
            ? cn(
                "relative flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
                MOTION_INTERACTIVE,
                desktopWidthClass,
              )
            : cn(
                "fixed inset-y-0 left-0 z-10 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200",
                MOTION_INTERACTIVE,
                desktopWidthClass,
              ),
          variant === "floating" &&
            (isContained
              ? "m-3 h-[calc(100%-1.5rem)] rounded-lg shadow-md"
              : "m-3 h-[calc(100vh-1.5rem)] rounded-lg shadow-md"),
          variant === "inset" &&
            "rounded-lg border border-sidebar-border shadow-sm",
          className,
        )}
        {...props}
      >
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
});
SidebarRoot.displayName = "Sidebar";

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar, isMobile, open, openMobile, contentId } = useSidebar();
  const expanded = isMobile ? openMobile : open;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md text-sidebar-foreground/70",
        MOTION_INTERACTIVE,
        FOCUS_RING,
        "hover:bg-sidebar-accent hover:text-sidebar-foreground",
        className,
      )}
      aria-label="Toggle sidebar"
      aria-controls={contentId}
      aria-expanded={expanded}
    >
      <PanelLeft className="size-4 rtl:rotate-180" />
    </button>
  );
}

const menuButtonVariants = cva(
  cn(
    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium outline-none",
    MOTION_INTERACTIVE,
    FOCUS_RING,
  ),
  {
    variants: {
      isActive: {
        true: "bg-sidebar-accent text-sidebar-foreground",
        false:
          "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
      },
    },
    defaultVariants: { isActive: false },
  },
);

export function SidebarMenuButton({
  children,
  isActive = false,
  onToggle,
  isOpen,
  asChild = false,
  className,
  ...props
}: React.PropsWithChildren<{
  isActive?: boolean | undefined;
  onToggle?: () => void;
  isOpen?: boolean | undefined;
  asChild?: boolean;
  className?: string;
}>) {
  const { state } = useSidebar();
  const hasSubmenu = !!onToggle;
  const collapsed = state === "collapsed";
  const childArray = React.Children.toArray(children);
  const textLabel = childArray
    .map((child) =>
      typeof child === "string" || typeof child === "number"
        ? String(child)
        : "",
    )
    .join(" ")
    .trim();
  const iconChild = childArray.find((child) => React.isValidElement(child));
  const expandedChildren = (
    <div className="flex flex-1 items-center gap-3 truncate">{children}</div>
  );
  const collapsedChildren = (
    <>
      <div className="flex flex-1 items-center justify-center gap-0 truncate">
        {iconChild ?? children}
      </div>
      {textLabel ? <span className="sr-only">{textLabel}</span> : null}
    </>
  );

  const content = collapsed ? collapsedChildren : expandedChildren;

  const sharedClassName = cn(
    menuButtonVariants({ isActive }),
    "group/menu-button",
    collapsed && "justify-center px-2",
    className,
  );

  if (asChild && React.isValidElement(children)) {
    const childProps = children.props as {
      className?: string;
      onClick?: React.MouseEventHandler<HTMLElement>;
    };

    const cloneProps: {
      className: string;
      onClick?: React.MouseEventHandler<HTMLElement>;
      children: React.ReactNode;
    } = {
      className: cn(sharedClassName, childProps.className),
      children: content,
    };

    const resolvedOnClick = onToggle ?? childProps.onClick;
    if (resolvedOnClick) {
      cloneProps.onClick = resolvedOnClick;
    }

    return React.cloneElement(
      children as React.ReactElement<{
        className?: string;
        onClick?: React.MouseEventHandler<HTMLElement>;
        children?: React.ReactNode;
      }>,
      cloneProps,
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className={sharedClassName}
      {...props}
    >
      {content}
      {hasSubmenu && state === "expanded" && (
        <ChevronRight
          className={cn(
            "size-3.5 opacity-50 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
      )}
    </button>
  );
}

export function SidebarMenuSub({
  children,
  isOpen,
}: {
  children: React.ReactNode;
  isOpen: boolean;
}) {
  const { state } = useSidebar();
  const panelId = React.useId();

  if (state === "collapsed") {
    return null;
  }

  return (
    <div
      id={panelId}
      aria-hidden={!isOpen}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-all duration-200 ease-out",
        isOpen
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 overflow-hidden",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="ml-3 flex flex-col gap-0.5 border-l border-sidebar-border py-1 pl-4 pr-2">
          {children}
        </div>
      </div>
    </div>
  );
}

export function SidebarMenuItem({
  children,
  defaultOpen = false,
}: {
  children: React.ReactNode;
  defaultOpen?: boolean | undefined;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const content = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(
        child as React.ReactElement<{
          isOpen?: boolean | undefined;
          onToggle?: () => void;
        }>,
        {
          isOpen,
          onToggle: () => setIsOpen((value) => !value),
        },
      );
    }
    return child;
  });

  return (
    <div
      className="flex flex-col w-full"
      data-state={isOpen ? "open" : "closed"}
    >
      {content}
    </div>
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col shrink-0", className)} {...props} />;
}

export function SidebarContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex-1 overflow-y-auto themed-scroll", className)}
      {...props}
    />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("shrink-0 border-t border-sidebar-border", className)}
      {...props}
    />
  );
}

export const Sidebar = Object.assign(SidebarRoot, {
  Provider: SidebarProvider,
  Header: SidebarHeader,
  Content: SidebarContent,
  Footer: SidebarFooter,
  MenuItem: SidebarMenuItem,
  MenuButton: SidebarMenuButton,
  MenuSub: SidebarMenuSub,
  Trigger: SidebarTrigger,
});
