import { Command } from "@almach/ui";
import { navigate as transitionNavigate } from "astro:transitions/client";
import {
  BarChart2,
  BookOpen,
  Bot,
  FileText,
  Layers,
  LayoutGrid,
  Search,
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
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const hasSearchables = React.useMemo(
    () => NAV_GROUPS.some((group) => group.items.length > 0),
    [],
  );

  // ⌘K / Ctrl+K to open
  React.useEffect(() => {
    const isEditable = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      if (target.isContentEditable) return true;
      const tag = target.tagName.toLowerCase();
      return tag === "input" || tag === "textarea" || tag === "select";
    };

    const handler = (e: KeyboardEvent) => {
      if (isEditable(e.target)) return;
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Focus the command input as soon as the dialog opens.
  React.useEffect(() => {
    if (!open || !hasSearchables) return;

    const frame = requestAnimationFrame(() => {
      inputRef.current?.focus();
    });

    const timeout = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [open, hasSearchables]);

  const handleNavigate = (href: string) => {
    setOpen(false);

    try {
      void transitionNavigate(href);
    } catch {
      window.location.assign(href);
    }
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
        <Search className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Desktop: expanded search bar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden h-9 min-w-55 cursor-pointer items-center gap-2.5 rounded-lg border border-input bg-muted/30 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 lg:flex xl:min-w-65"
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span className="flex-1 text-left">Search documentation...</span>
        <kbd className="flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
          Ctrl+K
        </kbd>
      </button>

      {/* Command dialog */}
      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input autoFocus ref={inputRef} placeholder="Search docs…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          {NAV_GROUPS.map((group, gi) => (
            <React.Fragment key={gi}>
              {gi > 0 && <Command.Separator />}
              <Command.Group heading={group.heading}>
                {group.items.map((item) => (
                  <Command.Item
                    key={item.href}
                    onSelect={() => handleNavigate(item.href)}
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
