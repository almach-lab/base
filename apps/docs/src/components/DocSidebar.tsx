"use client";

import { cn } from "@almach/utils";
import { ChevronRight } from "lucide-react";
import * as React from "react";
import { DOC_COMPONENT_GROUPS } from "../lib/doc-components";
import { docsLayout } from "../lib/docs-layout";
import { SearchCommand } from "./SearchCommand";

interface SidebarItem {
  name: string;
  href: string;
}

interface SidebarGroup {
  title: string;
  items: SidebarItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
}

const GETTING_STARTED: SidebarGroup = {
  title: "Getting Started",
  items: [
    { name: "Introduction", href: "/getting-started" },
    { name: "For LLMs", href: "/llms" },
    { name: "Theme", href: "/theme" },
    { name: "Blocks", href: "/blocks" },
  ],
};

const COMPONENTS_OVERVIEW: SidebarGroup = {
  title: "Components",
  items: [{ name: "Overview", href: "/components" }],
};

const COMPONENT_GROUPS: SidebarGroup[] = DOC_COMPONENT_GROUPS.map((group) => ({
  title: group.name,
  collapsible: true,
  defaultOpen: true,
  items: group.items.map((item) => ({
    name: item.name,
    href: `/components/${item.slug}`,
  })),
}));

const PACKAGES: SidebarGroup = {
  title: "Packages",
  items: [
    { name: "Forms", href: "/forms" },
    { name: "Query", href: "/query" },
  ],
};

const DESKTOP_QUERY = "(min-width: 1024px)";
const SIDEBAR_SCROLL_KEY = "almach:doc-sidebar-scroll";

function usePersistedScroll(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;

    const save = () => {
      const el = ref.current;
      if (el) sessionStorage.setItem(SIDEBAR_SCROLL_KEY, String(el.scrollTop));
    };

    const restore = () => {
      const el = ref.current;
      const raw = sessionStorage.getItem(SIDEBAR_SCROLL_KEY);
      if (!el || raw === null) return;
      const top = Number(raw);
      if (!Number.isNaN(top)) el.scrollTop = top;
    };

    const el = ref.current;
    el?.addEventListener("scroll", save, { passive: true });
    document.addEventListener("astro:before-swap", save);
    document.addEventListener("astro:after-swap", restore);

    restore();

    return () => {
      el?.removeEventListener("scroll", save);
      document.removeEventListener("astro:before-swap", save);
      document.removeEventListener("astro:after-swap", restore);
    };
  }, [enabled, ref]);
}

function useSyncedPath(currentPath: string) {
  const normalized = normalizePath(currentPath);
  const [path, setPath] = React.useState(normalized);

  React.useEffect(() => {
    setPath(normalized);
  }, [normalized]);

  React.useEffect(() => {
    const sync = () => setPath(normalizePath(window.location.pathname));
    document.addEventListener("astro:after-swap", sync);
    document.addEventListener("astro:page-load", sync);
    return () => {
      document.removeEventListener("astro:after-swap", sync);
      document.removeEventListener("astro:page-load", sync);
    };
  }, []);

  return path;
}

const SECTION_LABEL_CLASS =
  "px-2.5 pb-1.5 pt-0.5 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/50";

const GROUP_LABEL_CLASS =
  "flex w-full items-center gap-1.5 rounded-md px-2.5 py-1.5 text-left text-xs font-medium text-muted-foreground/75 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const SIDEBAR_LINK_CLASS =
  "block w-full truncate rounded-md px-2.5 py-1.5 text-[13px] leading-5 transition-colors";

const SIDEBAR_SCROLL_CLASS =
  "scroll-fade no-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-3.5 pb-10 pt-3";

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

function isItemActive(currentPath: string, itemHref: string) {
  return normalizePath(currentPath) === normalizePath(itemHref);
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

function SidebarDivider() {
  return (
    <div
      className="mx-1.5 my-3 border-t border-border/30"
      role="presentation"
    />
  );
}

function SidebarLink({
  item,
  currentPath,
  onItemClick,
  nested = false,
}: {
  item: SidebarItem;
  currentPath: string;
  onItemClick: () => void;
  nested?: boolean;
}) {
  const isActive = isItemActive(currentPath, item.href);

  return (
    <a
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      onClick={onItemClick}
      data-active={isActive ? "true" : undefined}
      className={cn(
        SIDEBAR_LINK_CLASS,
        nested && "pl-3.5",
        isActive
          ? "bg-muted/65 font-medium text-foreground"
          : "text-muted-foreground/90 hover:bg-muted/40 hover:text-foreground",
      )}
    >
      {item.name}
    </a>
  );
}

function SidebarLinkList({
  items,
  currentPath,
  onItemClick,
  nested = false,
}: {
  items: SidebarItem[];
  currentPath: string;
  onItemClick: () => void;
  nested?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((item) => (
        <SidebarLink
          key={item.href}
          item={item}
          currentPath={currentPath}
          onItemClick={onItemClick}
          nested={nested}
        />
      ))}
    </div>
  );
}

function SidebarSection({
  title,
  items,
  currentPath,
  onItemClick,
  collapsible = false,
  defaultOpen = true,
  showLabel = true,
}: SidebarGroup & {
  currentPath: string;
  onItemClick: () => void;
  showLabel?: boolean;
}) {
  const hasActiveItem = items.some((item) =>
    isItemActive(currentPath, item.href),
  );
  const [isExpanded, setIsExpanded] = React.useState(
    collapsible ? defaultOpen || hasActiveItem : true,
  );
  const panelId = React.useId();

  React.useEffect(() => {
    if (hasActiveItem) {
      setIsExpanded(true);
    }
  }, [hasActiveItem]);

  if (!collapsible) {
    return (
      <section className="flex flex-col gap-1">
        {showLabel && <p className={SECTION_LABEL_CLASS}>{title}</p>}
        <SidebarLinkList
          items={items}
          currentPath={currentPath}
          onItemClick={onItemClick}
        />
      </section>
    );
  }

  return (
    <section className="flex flex-col">
      <button
        type="button"
        onClick={() => setIsExpanded((value) => !value)}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        className={GROUP_LABEL_CLASS}
      >
        <span className="flex-1 truncate text-left">{title}</span>
        <ChevronRight
          className={cn(
            "size-3.5 shrink-0 text-muted-foreground/45 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
          aria-hidden="true"
        />
      </button>

      <div
        id={panelId}
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <div className="flex flex-col gap-0.5 pb-1 pt-0.5 pl-0.5">
            {items.map((item) => (
              <SidebarLink
                key={item.href}
                item={item}
                currentPath={currentPath}
                onItemClick={onItemClick}
                nested
              />
            ))}
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
    <nav className="flex flex-col" aria-label="Documentation sidebar">
      <SidebarLinkList
        items={GETTING_STARTED.items}
        currentPath={currentPath}
        onItemClick={onItemClick}
      />

      <SidebarDivider />

      <section className="flex flex-col gap-2">
        <SidebarSection
          {...COMPONENTS_OVERVIEW}
          currentPath={currentPath}
          onItemClick={onItemClick}
        />

        <div className="flex flex-col gap-3">
          {COMPONENT_GROUPS.map((group) => (
            <SidebarSection
              key={group.title}
              {...group}
              collapsible
              showLabel={false}
              currentPath={currentPath}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </section>

      <SidebarDivider />

      <SidebarLinkList
        items={PACKAGES.items}
        currentPath={currentPath}
        onItemClick={onItemClick}
      />
    </nav>
  );
}

function useScrollActiveLinkIntoView(
  containerRef: React.RefObject<HTMLElement | null>,
  currentPath: string,
  enabled: boolean,
) {
  React.useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    const activeLink = container.querySelector<HTMLElement>(
      'a[data-active="true"]',
    );
    if (!activeLink) return;

    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (
      linkRect.top < containerRect.top + 12 ||
      linkRect.bottom > containerRect.bottom - 12
    ) {
      activeLink.scrollIntoView({ block: "nearest" });
    }
  }, [containerRef, currentPath, enabled]);
}

export function DocSidebar({ currentPath }: { currentPath: string }) {
  const normalizedCurrentPath = useSyncedPath(currentPath);
  const isDesktop = useIsDesktop();
  const [openMobile, setOpenMobile] = React.useState(false);
  const [isMobileLayerMounted, setIsMobileLayerMounted] = React.useState(false);
  const desktopScrollRef = React.useRef<HTMLDivElement>(null);
  const mobileScrollRef = React.useRef<HTMLDivElement>(null);

  usePersistedScroll(desktopScrollRef, isDesktop);
  useScrollActiveLinkIntoView(desktopScrollRef, normalizedCurrentPath, isDesktop);
  useScrollActiveLinkIntoView(mobileScrollRef, normalizedCurrentPath, !isDesktop);

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
    if (!openMobile) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenMobile(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openMobile]);

  React.useEffect(() => {
    if (isDesktop) setOpenMobile(false);
  }, [isDesktop]);

  React.useEffect(() => {
    if (!openMobile || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [openMobile, isDesktop]);

  React.useEffect(() => {
    if (openMobile && !isDesktop) {
      setIsMobileLayerMounted(true);
      return;
    }

    if (!isMobileLayerMounted) return;

    const timeout = window.setTimeout(() => {
      setIsMobileLayerMounted(false);
    }, 220);

    return () => window.clearTimeout(timeout);
  }, [isDesktop, isMobileLayerMounted, openMobile]);

  const showMobileSidebar = openMobile && !isDesktop;

  return (
    <>
      <aside className={docsLayout.sidebar}>
        <div className="shrink-0 px-3.5 pb-3 pt-4">
          <SearchCommand variant="sidebar" />
        </div>

        <div ref={desktopScrollRef} className={SIDEBAR_SCROLL_CLASS}>
          <SidebarNav
            currentPath={normalizedCurrentPath}
            onItemClick={() => undefined}
          />
        </div>
      </aside>

      <div
        id="mobile-overlay"
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          !isMobileLayerMounted && "hidden",
          !showMobileSidebar && "pointer-events-none",
          showMobileSidebar && "sidebar-open",
        )}
        aria-hidden={!showMobileSidebar}
      >
        <button
          id="mobile-backdrop"
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          onClick={() => setOpenMobile(false)}
          aria-label="Close sidebar"
          type="button"
        />

        <aside
          id="mobile-sidebar"
          role="dialog"
          aria-modal="true"
          aria-label="Documentation navigation"
          className="relative flex h-full w-[min(17rem,88vw)] flex-col border-r border-border/30 bg-background"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/35 px-3.5">
            <span className="text-sm font-medium">Menu</span>
            <button
              type="button"
              onClick={() => setOpenMobile(false)}
              className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent/45 hover:text-foreground"
            >
              Close
            </button>
          </div>

          <div className="shrink-0 px-3.5 pb-2 pt-3">
            <SearchCommand variant="sidebar" />
          </div>

          <div ref={mobileScrollRef} className={SIDEBAR_SCROLL_CLASS}>
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
