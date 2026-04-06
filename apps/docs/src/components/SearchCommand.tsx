import { Command } from "@almach/ui";
import {
  BarChart2,
  BookOpen,
  Bot,
  FileText,
  Layers,
  LayoutGrid,
  Zap,
} from "lucide-react";
import * as React from "react";
import { DOC_COMPONENT_GROUPS } from "../lib/doc-components";

function itemsFor(groupName: (typeof DOC_COMPONENT_GROUPS)[number]["name"]) {
  const group = DOC_COMPONENT_GROUPS.find((entry) => entry.name === groupName);
  if (!group) throw new Error(`Missing docs component group: ${groupName}`);
  return group.items.map((item) => ({
    label: item.name,
    href: `/components/${item.slug}`,
  }));
}

// ── Navigation groups ───────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    heading: "Introduction",
    icon: BookOpen,
    items: [
      { label: "Getting Started", href: "/getting-started" },
      { label: "For LLMs", href: "/llms" },
    ],
  },
  {
    heading: "Inputs",
    icon: Zap,
    items: itemsFor("Inputs"),
  },
  {
    heading: "Display",
    icon: LayoutGrid,
    items: itemsFor("Display"),
  },
  {
    heading: "Layout",
    icon: Layers,
    items: itemsFor("Layout"),
  },
  {
    heading: "Overlay",
    icon: FileText,
    items: itemsFor("Overlay"),
  },
  {
    heading: "Data",
    icon: BarChart2,
    items: itemsFor("Data"),
  },
  {
    heading: "Packages",
    icon: Bot,
    items: [
      { label: "Forms", href: "/forms" },
      { label: "Query", href: "/query" },
    ],
  },
];

// ── Component ───────────────────────────────────────────────────────────────
export function SearchCommand() {
  const [open, setOpen] = React.useState(false);

  // ⌘K / Ctrl+K to open
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    window.location.href = href;
  };

  return (
    <>
      {/* Mobile: icon-only button */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 lg:hidden"
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <svg
          className="h-[15px] w-[15px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </button>

      {/* Desktop: expanded search bar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden h-9 min-w-[220px] cursor-pointer items-center gap-2.5 rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 lg:flex xl:min-w-[260px]"
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <svg
          className="h-3.5 w-3.5 shrink-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <span className="flex-1 text-left">Search docs…</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
          Ctrl K
        </kbd>
      </button>

      {/* Command dialog */}
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input placeholder="Search docs…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          {NAV_GROUPS.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <Command.Separator />}
              <Command.Group heading={group.heading}>
                {group.items.map((item) => (
                  <Command.Item
                    key={item.href}
                    onSelect={() => navigate(item.href)}
                  >
                    <group.icon className="h-4 w-4 text-muted-foreground" />
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            </React.Fragment>
          ))}
        </Command.List>
      </Command.Dialog>
    </>
  );
}
