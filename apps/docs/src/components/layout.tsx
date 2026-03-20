import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@almach/utils";
import { Github, Menu, Moon, Sun, X } from "lucide-react";

const sidebarGroups = [
  {
    title: "Introduction",
    items: [
      { name: "Getting Started", href: "/getting-started" },
      { name: "For LLMs", href: "/llms" },
    ],
  },
  {
    title: "Components",
    items: [
      { name: "Overview", href: "/components" },
    ],
  },
  {
    title: "Inputs",
    items: [
      { name: "Button", href: "/components/button" },
      { name: "Checkbox", href: "/components/checkbox" },
      { name: "Combobox", href: "/components/combobox" },
      { name: "Date Input", href: "/components/date-input" },
      { name: "Input", href: "/components/input" },
      { name: "Label", href: "/components/label" },
      { name: "Radio", href: "/components/radio" },
      { name: "Select", href: "/components/select" },
      { name: "Switch", href: "/components/switch" },
      { name: "Tag Input", href: "/components/tag-input" },
      { name: "Textarea", href: "/components/textarea" },
    ],
  },
  {
    title: "Display",
    items: [
      { name: "Alert", href: "/components/alert" },
      { name: "Avatar", href: "/components/avatar" },
      { name: "Badge", href: "/components/badge" },
      { name: "Progress", href: "/components/progress" },
      { name: "Skeleton", href: "/components/skeleton" },
      { name: "Toast", href: "/components/toast" },
      { name: "Tooltip", href: "/components/tooltip" },
    ],
  },
  {
    title: "Layout",
    items: [
      { name: "Card", href: "/components/card" },
      { name: "Carousel", href: "/components/carousel" },
      { name: "Group", href: "/components/group" },
      { name: "Layered Card", href: "/components/layered-card" },
      { name: "Separator", href: "/components/separator" },
    ],
  },
  {
    title: "Overlay",
    items: [
      { name: "Collapsible", href: "/components/collapsible" },
      { name: "Command", href: "/components/command" },
      { name: "Dialog", href: "/components/dialog" },
      { name: "Drawer", href: "/components/drawer" },
      { name: "Dropdown Menu", href: "/components/dropdown-menu" },
      { name: "Modal", href: "/components/modal" },
      { name: "Popover", href: "/components/popover" },
      { name: "Tabs", href: "/components/tabs" },
    ],
  },
  {
    title: "Data",
    items: [
      { name: "Chart", href: "/components/chart" },
      { name: "Calendar", href: "/components/calendar" },
      { name: "Table", href: "/components/table" },
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

function ThemeToggle() {
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const handler = () =>
      setDark(document.documentElement.classList.contains("dark"));
    window.addEventListener("almach-theme-mode-changed", handler);
    return () => window.removeEventListener("almach-theme-mode-changed", handler);
  }, []);

  return (
    <button
      onClick={() => {
        const next = !dark;
        localStorage.setItem("theme", next ? "dark" : "light");
        document.documentElement.classList.toggle("dark", next);
        setDark(next);
        window.dispatchEvent(new CustomEvent("almach-theme-mode-changed"));
      }}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark
        ? <Sun className="h-[15px] w-[15px]" aria-hidden="true" />
        : <Moon className="h-[15px] w-[15px]" aria-hidden="true" />
      }
    </button>
  );
}

function Sidebar({ onNav }: { onNav?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Documentation navigation" className="flex flex-col gap-5">
      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNav}
                className={cn(
                  "relative flex items-center rounded-lg px-2 py-1.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
                {pathname === item.href && (
                  <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-primary" />
                )}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isHome = pathname === "/";

  // close sidebar on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sidebarOpen]);

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-3 px-4 md:px-6">

          {!isHome && (
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
          )}

          <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="Almach home">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-[11px] font-black text-background"
              aria-hidden="true"
            >
              A
            </span>
            <span className="text-sm font-bold tracking-tight">Almach</span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <a
              href="https://github.com/almach-lab/base"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="View on GitHub (opens in new tab)"
            >
              <Github className="h-[15px] w-[15px]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation"
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="mobile-sidebar"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r bg-background shadow-xl"
          >
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="text-sm font-bold">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <Sidebar onNav={() => setSidebarOpen(false)} />
            </div>
          </aside>
        </div>
      )}

      {/* Page content */}
      {isHome ? (
        <main className="flex-1" id="main-content">{children}</main>
      ) : (
        <div className="mx-auto flex w-full max-w-screen-xl flex-1">
          <aside
            className="hidden w-60 shrink-0 border-r lg:block"
            aria-label="Documentation navigation"
          >
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-6 pl-4 pr-3">
              <Sidebar />
            </div>
          </aside>
          <main className="min-w-0 flex-1" id="main-content">{children}</main>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <span
              className="flex h-3.5 w-3.5 items-center justify-center rounded bg-muted-foreground text-[9px] font-black text-background"
              aria-hidden="true"
            >
              A
            </span>
            <span>Almach · MIT License</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React · Vite · Tailwind CSS v4</span>
            <a
              href="https://github.com/almach-lab/base"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
              aria-label="GitHub repository (opens in new tab)"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
