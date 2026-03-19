import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@almach/utils";
import { Github, Menu, Moon, Sun, X } from "lucide-react";

const sidebarGroups = [
  {
    title: "Introduction",
    items: [
      { name: "Getting Started", href: "/getting-started" },
    ],
  },
  {
    title: "Components",
    items: [
      { name: "Overview", href: "/components" },
      { name: "Alert", href: "/components/alert" },
      { name: "Avatar", href: "/components/avatar" },
      { name: "Badge", href: "/components/badge" },
      { name: "Button", href: "/components/button" },
      { name: "Calendar", href: "/components/calendar" },
      { name: "Card", href: "/components/card" },
      { name: "Carousel", href: "/components/carousel" },
      { name: "Checkbox", href: "/components/checkbox" },
      { name: "Collapsible", href: "/components/collapsible" },
      { name: "Command", href: "/components/command" },
      { name: "Date Input", href: "/components/date-input" },
      { name: "Dialog", href: "/components/dialog" },
      { name: "Drawer", href: "/components/drawer" },
      { name: "Dropdown Menu", href: "/components/dropdown-menu" },
      { name: "Group", href: "/components/group" },
      { name: "Input", href: "/components/input" },
      { name: "Label", href: "/components/label" },
      { name: "Modal", href: "/components/modal" },
      { name: "Progress", href: "/components/progress" },
      { name: "Radio", href: "/components/radio" },
      { name: "Select", href: "/components/select" },
      { name: "Separator", href: "/components/separator" },
      { name: "Skeleton", href: "/components/skeleton" },
      { name: "Switch", href: "/components/switch" },
      { name: "Table", href: "/components/table" },
      { name: "Tabs", href: "/components/tabs" },
      { name: "Tag Input", href: "/components/tag-input" },
      { name: "Textarea", href: "/components/textarea" },
      { name: "Toast", href: "/components/toast" },
      { name: "Tooltip", href: "/components/tooltip" },
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
  return (
    <button
      onClick={() => {
        document.documentElement.classList.toggle("dark");
        setDark((d) => !d);
      }}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Sun className="h-[15px] w-[15px]" aria-hidden="true" /> : <Moon className="h-[15px] w-[15px]" aria-hidden="true" />}
    </button>
  );
}

function Sidebar({ onNav }: { onNav?: () => void }) {
  const { pathname } = useLocation();
  return (
    <nav aria-label="Documentation navigation" className="flex flex-col gap-6">
      {sidebarGroups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {group.title}
          </p>
          <div className="space-y-0.5">
            {group.items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNav}
                className={cn(
                  "flex items-center rounded-md px-2 py-1.5 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-foreground/8 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
                aria-current={pathname === item.href ? "page" : undefined}
              >
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

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-4 px-4 md:px-6">
          {!isHome && (
            <button
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              aria-controls="mobile-sidebar"
            >
              <Menu className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5" aria-label="Based Code home">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-[11px] font-black text-background" aria-hidden="true">
              B
            </span>
            <span className="text-sm font-semibold tracking-tight">Based Code</span>
          </Link>

          <div className="ml-auto flex items-center gap-1">
            <ThemeToggle />
            <a
              href="https://github.com/rafaalrazzak/based"
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              aria-label="View on GitHub (opens in new tab)"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside id="mobile-sidebar" className="absolute inset-y-0 left-0 w-60 border-r bg-background p-5 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-semibold">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md hover:bg-accent"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <Sidebar onNav={() => setSidebarOpen(false)} />
          </aside>
        </div>
      )}

      {/* Page content */}
      {isHome ? (
        <main className="flex-1" id="main-content">{children}</main>
      ) : (
        <div className="mx-auto flex w-full max-w-screen-xl flex-1">
          <aside className="hidden w-56 shrink-0 border-r lg:block" aria-label="Documentation navigation">
            <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto py-8 pl-5 pr-3">
              <Sidebar />
            </div>
          </aside>
          <main className="min-w-0 flex-1" id="main-content">{children}</main>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-screen-xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row md:px-6">
          <div className="flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-[9px] font-black text-background" aria-hidden="true">
              B
            </span>
            <span>Based Code · MIT License</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React · Vite · Tailwind CSS v4</span>
            <a
              href="https://github.com/rafaalrazzak/based"
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
