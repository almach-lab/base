import { Sidebar, useSidebar } from "@almach/ui";
import * as React from "react";
import { DOC_COMPONENT_GROUPS } from "../lib/doc-components";

// ── Logo ───────────────────────────────────────────────────────────────────

function AlmachLogo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 3000 3000"
      className={className}
    >
      <path
        fill="#d39d2a"
        d="M1770 1939.4c-10.1 2.6-19.2 14.8-24.3 25.5-135.4 322.7-142.7 681.1-236.4 1016.2-3.3 10-6.7 16.7-10 18.5-1.5.8-3.1.6-4.4-.4-3.4-2.5-6.8-10.4-10-21.4-84.6-332.3-101.9-683.7-242.3-1000.6-5.4-12.6-13.7-27-22.7-32.9-8.3-5.7-17.6-6.3-28.4-2.5-6.1 2.1-12.6 5.5-19.3 9.7-117.9 79.3-240 156.7-357.3 234.9-5.5 3.7-10.7 7.1-15 9.7-8.1 4.9-13.4 7.1-14.9 5.6-.1-.1-.2-.1-.3-.4-1.1-1.8 1.2-7 5.7-14.5 15.3-24.2 32.8-48.9 48.8-73 65.1-96.9 131.1-193.5 196-291 4.2-6.8 7.6-13.4 9.6-19.6 3.6-10.8 2.9-20.2-2.8-28.5-6.5-10.1-23.3-18.9-36.5-24.6C698.9 1613.9 358.7 1594 36.6 1511c-21.2-6.5-33.2-14.1-.6-24.6 308.9-86.6 638.9-89.5 939.1-210.6 21-9.3 55.2-19.2 67.6-38.1 12-18.1-.9-41.3-11-58.4-10.3-17.2-20.9-34.3-31.7-51.3-61-96-128.4-187.8-185.7-286.1-5.4-9.4-10.8-18.8-14.1-28.1-7.7-22.7 22.4-1.5 31.4 3.9 111.4 73.5 222.4 147.1 334 220.9 9.3 6.1 20.4 13.1 30.1 16.1 23.7 8 36.6-8.1 46.1-29.4 130.2-320.5 154.5-671 238.6-1004.7 3-10.1 6-17.3 9-19.7 1.6-1.5 3.9-1.1 5.3.4 2.9 2.8 5.7 10 8.5 19.9 79.6 330 105 674.5 229.8 993 9.5 24.7 22.7 51.1 52.4 42.7 6.3-1.6 13-4.5 19.9-8.1 120.4-68 230.5-152.5 349.1-223.2 16.5-9.6 34.3-20.6 40.2-16.7 1.5 1.4 1.3 4.5-.6 9.1-2.5 6.4-7.5 14.2-11.7 20.9-74.9 114.8-153 227.7-226.5 343.3-5.8 11-11.3 24.3-8.9 35.6 1.4 7.7 6 14.1 12.6 19.8 189.8 142.9 729.6 161.4 1001.6 248.1 3 1 5.9 2 8.5 3.1 8.5 3.3 14.2 6.7 15.4 10.1.4 1.1.4 2.1-.1 3.2-1.6 3.5-8.6 6.9-19.3 9.9-333.2 74-679.6 103.8-996.5 236.2-11.1 5-22.3 13.2-26.2 21.9-8.2 16.9 5.7 37.9 15.3 53 75.2 116.2 155.2 231.7 228.1 347.8 4.3 7.6 6.1 12.6 4.5 14.2l-.3.3c-1.9 1.2-6.9-.8-14.3-5.1-119.6-77.3-242.8-150.1-362.6-228-12.7-7.9-30-17.4-43.6-13h-.1Z"
      />
    </svg>
  );
}

// ── Nav data ───────────────────────────────────────────────────────────────

const SIDEBAR_GROUPS = [
  {
    title: "Introduction",
    items: [
      { name: "Getting Started", href: "/getting-started" },
      { name: "For LLMs", href: "/llms" },
    ],
  },
  {
    title: "Components",
    items: [{ name: "Overview", href: "/components" }],
  },
  ...DOC_COMPONENT_GROUPS.map((group) => ({
    title: group.name,
    items: group.items.map((item) => ({
      name: item.name,
      href: `/components/${item.slug}`,
    })),
  })),
  {
    title: "Blocks",
    items: [
      { name: "Overview", href: "/blocks" },
      { name: "Dashboard Overview", href: "/blocks#dashboard-overview" },
      { name: "Analytics Panel", href: "/blocks#analytics-panel" },
      { name: "Revenue Tracker", href: "/blocks#revenue-tracker" },
      { name: "Activity Feed", href: "/blocks#activity-feed" },
      { name: "Team Performance", href: "/blocks#team-performance" },
    ],
  },
  {
    title: "Packages",
    items: [
      { name: "Forms", href: "/forms" },
      { name: "Query", href: "/query" },
    ],
  },
];

// ── Shared nav groups ──────────────────────────────────────────────────────

function NavGroups({
  currentPath,
  onNavigate,
}: {
  currentPath: string;
  onNavigate: () => void;
}) {
  return (
    <>
      {SIDEBAR_GROUPS.map((group) => (
        <Sidebar.Group key={group.title} className="mb-1 p-0">
          <Sidebar.GroupLabel className="mb-1 px-2">
            {group.title}
          </Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {group.items.map((item) => (
                <Sidebar.MenuItem key={item.href}>
                  <Sidebar.MenuButton
                    asChild
                    isActive={currentPath === item.href}
                    size="sm"
                    onClick={onNavigate}
                  >
                    <a
                      href={item.href}
                      aria-current={
                        currentPath === item.href ? "page" : undefined
                      }
                    >
                      {item.name}
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              ))}
            </Sidebar.Menu>
          </Sidebar.GroupContent>
        </Sidebar.Group>
      ))}
    </>
  );
}

// ── Inner component (accesses sidebar context) ─────────────────────────────

function DocSidebarInner({ currentPath }: { currentPath: string }) {
  const { openMobile, setOpenMobile, toggleSidebar } = useSidebar();

  // Bridge the Astro header toggle button to the React sidebar
  React.useEffect(() => {
    const handler = () => toggleSidebar();
    window.addEventListener("almach-sidebar-toggle", handler);
    return () => window.removeEventListener("almach-sidebar-toggle", handler);
  }, [toggleSidebar]);

  // Sync aria-expanded on the header button + lock body scroll
  React.useEffect(() => {
    document
      .getElementById("sidebar-toggle")
      ?.setAttribute("aria-expanded", String(openMobile));
    document.body.style.overflow = openMobile ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [openMobile]);

  // Close on Escape
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && openMobile) setOpenMobile(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [openMobile, setOpenMobile]);

  const close = React.useCallback(() => setOpenMobile(false), [setOpenMobile]);

  return (
    <>
      {/* Mobile overlay sidebar (< 1024px) */}
      <div className="lg:hidden">
        <Sidebar collapsible="offcanvas">
          <Sidebar.Header className="h-[3.25rem] flex-row items-center justify-between border-b border-sidebar-border/70 px-4 py-0">
            <a
              href="/"
              className="flex items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label="Almach home"
              onClick={close}
            >
              <AlmachLogo className="h-5 w-5" />
              <span className="text-sm font-bold text-sidebar-foreground">
                Almach
              </span>
            </a>
            <button
              type="button"
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
              aria-label="Close navigation"
              onClick={close}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </Sidebar.Header>
          <Sidebar.Content className="px-3 py-4">
            <nav aria-label="Mobile navigation">
              <NavGroups currentPath={currentPath} onNavigate={close} />
            </nav>
          </Sidebar.Content>
        </Sidebar>
      </div>

      {/* Desktop sticky sidebar (>= 1024px) */}
      <aside
        className="hidden w-56 shrink-0 border-r border-sidebar-border/70 bg-sidebar lg:flex lg:flex-col"
        aria-label="Documentation navigation"
      >
        <div className="sticky top-[3.25rem] flex h-[calc(100vh-3.25rem)] flex-col">
          <Sidebar.Content className="px-2 py-3">
            <nav aria-label="Documentation navigation" className="pb-8 pr-1">
              <NavGroups currentPath={currentPath} onNavigate={() => {}} />
            </nav>
          </Sidebar.Content>
        </div>
      </aside>
    </>
  );
}

// ── Exported component ─────────────────────────────────────────────────────

interface DocSidebarProps {
  currentPath: string;
}

export function DocSidebar({ currentPath }: DocSidebarProps) {
  return (
    <Sidebar.Provider
      mobileBreakpoint={1024}
      className="min-h-0 w-auto shrink-0"
    >
      <DocSidebarInner currentPath={currentPath} />
    </Sidebar.Provider>
  );
}
