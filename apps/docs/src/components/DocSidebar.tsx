"use client";

import { cn } from "@almach/utils";
import { ChevronRight, LayoutGrid, Package, PlayCircle } from "lucide-react";
import * as React from "react";
import { DOC_COMPONENT_GROUPS } from "../lib/doc-components";

interface SidebarItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
  defaultOpen?: boolean;
}

const DESKTOP_QUERY = "(min-width: 1024px)";

const DOCS_NAV_GROUPS: SidebarGroup[] = [
  {
    title: "Getting Started",
    defaultOpen: true,
    items: [
      {
        name: "Introduction",
        href: "/getting-started",
        icon: <PlayCircle className="size-3.5" />,
      },
      { name: "For LLMs", href: "/llms" },
    ],
  },
  {
    title: "Components",
    defaultOpen: true,
    items: [
      {
        name: "Overview",
        href: "/components",
        icon: <LayoutGrid className="size-3.5" />,
      },
    ],
  },
  ...DOC_COMPONENT_GROUPS.map((group) => ({
    title: group.name,
    defaultOpen: false,
    items: group.items.map((item) => ({
      name: item.name,
      href: `/components/${item.slug}`,
    })),
  })),
  {
    title: "Packages",
    defaultOpen: false,
    items: [
      { name: "Forms", href: "/forms", icon: <Package className="size-3.5" /> },
      { name: "Query", href: "/query" },
    ],
  },
];

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function isItemActive(currentPath: string, itemHref: string) {
  const normalizedCurrentPath = normalizePath(currentPath);
  const normalizedHref = normalizePath(itemHref);

  if (normalizedCurrentPath === normalizedHref) {
    return true;
  }

  if (normalizedHref === "/") {
    return false;
  }

  return normalizedCurrentPath.startsWith(`${normalizedHref}/`);
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setIsDesktop(mediaQuery.matches);

    onChange();

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}

function SidebarMenuGroup({
  title,
  defaultOpen,
  items,
  currentPath,
  onItemClick,
}: {
  title: string;
  defaultOpen?: boolean;
  items: SidebarItem[];
  currentPath: string;
  onItemClick: () => void;
}) {
  const shouldStartExpanded =
    defaultOpen ?? items.some((item) => isItemActive(currentPath, item.href));

  const [isExpanded, setIsExpanded] = React.useState(shouldStartExpanded);
  const panelId = React.useId();

  React.useEffect(() => {
    if (items.some((item) => isItemActive(currentPath, item.href))) {
      setIsExpanded(true);
    }
  }, [currentPath, items]);

  return (
    <section className="flex flex-col gap-1">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className="group flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-[10px] font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent/45 hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex-1 truncate">{title}</span>
        <ChevronRight
          className={cn(
            "size-3 text-sidebar-foreground/40 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      </button>

      <div
        id={panelId}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0">
          <div className="ml-2 border-l border-sidebar-border/55 py-1 pl-2">
            {items.map((item) => {
              const isActive = isItemActive(currentPath, item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={onItemClick}
                  className={cn(
                    "mb-0.5 flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground shadow-[inset_0_0_0_1px_hsl(var(--sidebar-border)/0.55)]"
                      : "text-sidebar-foreground/72 hover:bg-sidebar-accent/65 hover:text-sidebar-foreground",
                  )}
                >
                  {item.icon && <span className="shrink-0 text-sidebar-foreground/70">{item.icon}</span>}
                  <span className="truncate">{item.name}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function SidebarNav({
  currentPath,
  onItemClick,
}: {
  currentPath: string;
  onItemClick: () => void;
}) {
  return (
    <nav className="flex flex-col gap-1 px-2.5 pb-4" aria-label="Documentation sidebar">
      {DOCS_NAV_GROUPS.map((group) => (
        <SidebarMenuGroup
          key={group.title}
          title={group.title}
          items={group.items}
          currentPath={currentPath}
          onItemClick={onItemClick}
          {...(group.defaultOpen !== undefined
            ? { defaultOpen: group.defaultOpen }
            : {})}
        />
      ))}
    </nav>
  );
}

export function DocSidebar({ currentPath }: { currentPath: string }) {
  const normalizedCurrentPath = normalizePath(currentPath);
  const isDesktop = useIsDesktop();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [renderMobileLayer, setRenderMobileLayer] = React.useState(false);
  const [mobileLayerActive, setMobileLayerActive] = React.useState(false);

  React.useEffect(() => {
    const toggle = () => setOpenMobile((value) => !value);
    const closeOnSwap = () => setOpenMobile(false);

    window.addEventListener("almach-sidebar-toggle", toggle);
    document.addEventListener("astro:before-swap", closeOnSwap);

    return () => {
      window.removeEventListener("almach-sidebar-toggle", toggle);
      document.removeEventListener("astro:before-swap", closeOnSwap);
    };
  }, []);

  React.useEffect(() => {
    const btn = document.getElementById("sidebar-toggle");
    if (btn) {
      btn.setAttribute("aria-expanded", String(openMobile));
    }
  }, [openMobile]);

  React.useEffect(() => {
    if (!openMobile) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenMobile(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMobile]);

  React.useEffect(() => {
    if (!openMobile || isDesktop) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMobile, isDesktop]);

  const showMobileSidebar = openMobile && !isDesktop;

  React.useEffect(() => {
    if (showMobileSidebar) {
      setRenderMobileLayer(true);
      const frame = window.requestAnimationFrame(() => {
        setMobileLayerActive(true);
      });

      return () => window.cancelAnimationFrame(frame);
    }

    setMobileLayerActive(false);

    if (!renderMobileLayer) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setRenderMobileLayer(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [showMobileSidebar, renderMobileLayer]);

  return (
    <>
      <aside className="hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r border-sidebar-border/60 bg-sidebar/80 lg:sticky lg:top-14 lg:flex lg:flex-col">
        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          <SidebarNav currentPath={normalizedCurrentPath} onItemClick={() => undefined} />
        </div>
      </aside>

      <div
        id="mobile-overlay"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !renderMobileLayer && "hidden",
          !mobileLayerActive && "pointer-events-none",
          mobileLayerActive && "sidebar-open",
        )}
        aria-hidden={!mobileLayerActive}
      >
        <button
          id="mobile-backdrop"
          className="absolute inset-0 bg-background/70 backdrop-blur-sm"
          onClick={() => setOpenMobile(false)}
          aria-label="Close sidebar"
          type="button"
        />

        <aside
          id="mobile-sidebar"
          className="relative flex h-full w-[min(20rem,84vw)] flex-col border-r border-sidebar-border bg-sidebar"
        >
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border/60 px-4">
            <span className="text-sm font-semibold">Navigation</span>
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="rounded-md px-2 py-1 text-xs text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              Close
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto py-2">
            <SidebarNav
              currentPath={normalizedCurrentPath}
              onItemClick={() => setOpenMobile(false)}
            />
          </div>
        </aside>
      </div>
    </>
  );
}
