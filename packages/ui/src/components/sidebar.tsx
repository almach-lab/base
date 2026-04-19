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
import { useIsMobile } from "../hooks/use-media-query";

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
}

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

export function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

// ── Provider ──────────────────────────────────────────────────────────────

export function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange,
  openMobile: openMobileProp,
  onOpenMobileChange,
  contained = false,
  className,
  children,
  ...props
}: React.PropsWithChildren<{
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  openMobile?: boolean;
  onOpenMobileChange?: (open: boolean) => void;
  contained?: boolean;
  className?: string;
}>) {
  const isMobile = useIsMobile();
  const [openState, setOpenState] = React.useState(defaultOpen);
  const [openMobileState, setOpenMobileState] = React.useState(false);

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
      }}
    >
      <div
        style={
          {
            "--sidebar-width": SIDEBAR_WIDTH,
            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
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

// ── Root ──────────────────────────────────────────────────────────────────

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
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden
                   data-[entering]:animate-in data-[exiting]:animate-out
                   data-[entering]:fade-in data-[exiting]:fade-out"
      >
        <AriaModal
          className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-sidebar border-r border-sidebar-border shadow-2xl
                             data-[entering]:animate-in data-[exiting]:animate-out
                             data-[entering]:slide-in-from-left data-[exiting]:slide-out-to-left duration-300"
        >
          <AriaDialog
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
        isContained ? "group peer flex h-full w-full" : "group peer hidden lg:block",
      )}
      data-state={open ? "expanded" : "collapsed"}
      data-variant={variant}
    >
      <div
        className={cn(
          isContained
            ? cn(
                "relative flex h-full flex-col border-r border-sidebar-border/50 bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-sidebar",
                desktopWidthClass,
              )
            : cn(
                "fixed inset-y-0 left-0 z-10 flex flex-col border-r border-sidebar-border/50 bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-sidebar",
                desktopWidthClass,
              ),
          variant === "floating" &&
            (isContained
              ? "m-3 h-[calc(100%-1.5rem)] rounded-2xl shadow-xl"
              : "m-3 h-[calc(100vh-1.5rem)] rounded-2xl shadow-xl"),
          className,
        )}
        {...props}
      >
        <div className="flex h-full flex-col overflow-hidden">{children}</div>
      </div>
    </div>
  );
});

// ── Trigger (with RTL support) ────────────────────────────────────────────

export function SidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-lg text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label="Toggle sidebar"
    >
      <PanelLeft className="size-4 rtl:rotate-180" />
    </button>
  );
}

// ── Menu Components ───────────────────────────────────────────────────────

const menuButtonVariants = cva(
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none",
  {
    variants: {
      isActive: {
        true: "bg-sidebar-accent text-sidebar-primary",
        false: "text-sidebar-foreground/70",
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
}: any) {
  const { state } = useSidebar();
  const hasSubmenu = !!onToggle;
  const collapsed = state === "collapsed";
  const childArray = React.Children.toArray(children);
  const textLabel = childArray
    .map((child) =>
      typeof child === "string" || typeof child === "number" ? String(child) : "",
    )
    .join(" ")
    .trim();
  const iconChild = childArray.find(
    (child) => React.isValidElement(child),
  );
  const expandedChildren = <div className="flex flex-1 items-center gap-3 truncate">{children}</div>;
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

    return React.cloneElement(children as React.ReactElement, {
      className: cn(sharedClassName, childProps.className),
      onClick: onToggle ?? childProps.onClick,
      ...props,
      children: content,
    });
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

  if (state === "collapsed") {
    return null;
  }

  return (
    <div
      className={cn(
        "grid transition-all duration-300",
        isOpen
          ? "grid-rows-[1fr] opacity-100"
          : "grid-rows-[0fr] opacity-0 overflow-hidden",
      )}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex flex-col gap-0.5 pl-6 pr-2 py-1 ml-4 border-l border-sidebar-border/60">
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
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  const content = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as any, {
        isOpen,
        onToggle: () => setIsOpen(!isOpen),
      });
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

// ── Layout Parts ──────────────────────────────────────────────────────────

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
      className={cn("shrink-0 border-t border-sidebar-border/50", className)}
      {...props}
    />
  );
}

// ── Main Export ───────────────────────────────────────────────────────────

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
