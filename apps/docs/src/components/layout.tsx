import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@almach/utils";
import { Github, Menu, Moon, MoreHorizontal, Paintbrush, Sun, X } from "lucide-react";

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
    items: [{ name: "Overview", href: "/components" }],
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

// ── Theme helpers ────────────────────────────────────────────────────────────
function isDark() {
  return document.documentElement.classList.contains("dark");
}

// ── Sidebar nav ──────────────────────────────────────────────────────────────
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
                  "relative flex items-center rounded-lg px-3 py-1.5 text-sm transition-colors",
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

// ── More menu (mobile) ───────────────────────────────────────────────────────
function MoreMenu() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(isDark);
  const [llmCopied, setLlmCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", handler); document.removeEventListener("keydown", esc); };
  }, []);

  // Sync dark state when theme changes externally
  useEffect(() => {
    const handler = () => setDark(isDark());
    window.addEventListener("almach-theme-mode-changed", handler);
    return () => window.removeEventListener("almach-theme-mode-changed", handler);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    window.dispatchEvent(new CustomEvent("almach-theme-mode-changed"));
    setOpen(false);
  };

  const copyLLMs = async () => {
    try {
      const text = await fetch("/llms.txt").then((r) => r.text());
      await navigator.clipboard.writeText(text);
      setLlmCopied(true);
      setTimeout(() => { setLlmCopied(false); setOpen(false); }, 1500);
    } catch (_) {}
  };

  const openCustomizer = () => {
    window.dispatchEvent(new CustomEvent("almach-customizer-toggle"));
    setOpen(false);
  };

  const menuItem = "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <div ref={ref} className="relative lg:hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="More actions"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <MoreHorizontal className="h-[15px] w-[15px]" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 w-52 origin-top-right rounded-xl border bg-background p-1 shadow-lg">
          {/* LLMs */}
          <button onClick={copyLLMs} className={menuItem}>
            {llmCopied ? (
              <svg className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            )}
            {llmCopied ? "Copied!" : "Copy for LLMs"}
          </button>

          <div className="my-1 h-px bg-border" />

          {/* Customize */}
          <button onClick={openCustomizer} className={menuItem}>
            <Paintbrush className="h-4 w-4 shrink-0" />
            Customize theme
          </button>

          {/* Theme */}
          <button onClick={toggleTheme} className={menuItem}>
            {dark
              ? <Sun className="h-4 w-4 shrink-0" />
              : <Moon className="h-4 w-4 shrink-0" />
            }
            {dark ? "Light mode" : "Dark mode"}
          </button>

          <div className="my-1 h-px bg-border" />

          {/* GitHub */}
          <a
            href="https://github.com/almach-lab/base"
            target="_blank"
            rel="noopener noreferrer"
            className={menuItem}
          >
            <Github className="h-4 w-4 shrink-0" />
            GitHub
            <svg className="ml-auto h-3 w-3 opacity-50" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}

// ── Main layout ──────────────────────────────────────────────────────────────
export function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dark, setDark] = useState(isDark);
  const isHome = pathname === "/";

  useEffect(() => {
    const handler = () => setDark(isDark());
    window.addEventListener("almach-theme-mode-changed", handler);
    return () => window.removeEventListener("almach-theme-mode-changed", handler);
  }, []);

  // Escape closes sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [sidebarOpen]);

  const toggleTheme = () => {
    const next = !dark;
    localStorage.setItem("theme", next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    window.dispatchEvent(new CustomEvent("almach-theme-mode-changed"));
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="mx-auto flex h-14 max-w-screen-xl items-center gap-2 px-4 md:px-6">

          {/* Left */}
          <div className="flex shrink-0 items-center gap-2">
            {!isHome && (
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
                onClick={() => setSidebarOpen(true)}
                aria-label="Open navigation"
                aria-expanded={sidebarOpen}
              >
                <Menu className="h-[15px] w-[15px]" />
              </button>
            )}
            <Link to="/" className="flex items-center gap-2" aria-label="Almach home">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-[11px] font-black text-background">
                A
              </span>
              <span className="text-sm font-bold tracking-tight">Almach</span>
            </Link>
          </div>

          {/* Right */}
          <div className="flex flex-1 items-center justify-end gap-1">

            {/* Search: icon on mobile, bar on desktop */}
            <button
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
              aria-label="Search"
            >
              <svg className="h-[15px] w-[15px]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>
            <button className="hidden h-9 items-center gap-2.5 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:flex">
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <span className="flex-1 text-left">Search docs…</span>
              <kbd className="flex items-center rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none">⌘K</kbd>
            </button>

            {/* Desktop actions */}
            <div className="hidden items-center gap-1 lg:flex">
              <div className="mx-1.5 h-4 w-px bg-border" />
              <button
                onClick={toggleTheme}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
              >
                {dark ? <Sun className="h-[15px] w-[15px]" /> : <Moon className="h-[15px] w-[15px]" />}
              </button>
              <a
                href="https://github.com/almach-lab/base"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="View on GitHub"
              >
                <Github className="h-[15px] w-[15px]" />
              </a>
            </div>

            {/* Mobile: one "more" button */}
            <MoreMenu />
          </div>
        </div>
      </header>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col border-r bg-background shadow-2xl">
            <div className="flex h-14 shrink-0 items-center justify-between border-b px-4">
              <span className="text-sm font-bold">Navigation</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                aria-label="Close navigation"
              >
                <X className="h-4 w-4" />
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
          <aside className="hidden w-60 shrink-0 border-r lg:block" aria-label="Documentation navigation">
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
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded bg-muted-foreground text-[9px] font-black text-background">A</span>
            <span>Almach · MIT License</span>
          </div>
          <div className="flex items-center gap-4">
            <span>React · Vite · Tailwind CSS v4</span>
            <a href="https://github.com/almach-lab/base" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              GitHub ↗
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
