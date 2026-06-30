import { navigate as transitionNavigate } from "astro:transitions/client";
import { Command } from "@almach/ui";
import { Search } from "lucide-react";
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

const NAV_GROUPS = [
  {
    heading: "Introduction",
    items: [
      { label: "Getting Started", href: "/getting-started" },
      { label: "For LLMs", href: "/llms" },
      { label: "Theme", href: "/theme" },
      { label: "Blocks", href: "/blocks" },
    ],
  },
  {
    heading: "Components",
    items: [{ label: "Overview", href: "/components" }],
  },
  ...DOC_COMPONENT_GROUPS.map((group) => ({
    heading: group.name,
    items: itemsFor(group.name),
  })),
  {
    heading: "Packages",
    items: [
      { label: "Forms", href: "/forms" },
      { label: "Query", href: "/query" },
    ],
  },
];

interface SearchCommandProps {
  variant?: "header" | "sidebar";
}

export function SearchCommand({ variant = "header" }: SearchCommandProps) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const hasSearchables = React.useMemo(
    () => NAV_GROUPS.some((group) => group.items.length > 0),
    [],
  );

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

  const triggerClass =
    variant === "sidebar"
      ? "flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-full border border-border/40 bg-muted/25 px-3.5 text-sm text-muted-foreground transition-colors hover:border-border/60 hover:bg-muted/40 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      : "flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={triggerClass}
        aria-label="Search documentation"
        aria-haspopup="dialog"
      >
        <Search className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {variant === "sidebar" && (
          <>
            <span className="flex-1 text-left">Search…</span>
            <kbd className="hidden rounded border border-border/50 bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/80 sm:inline">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      <Command.Dialog open={open} onOpenChange={setOpen}>
        <Command.Input autoFocus ref={inputRef} placeholder="Search docs…" />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>

          {NAV_GROUPS.map((group, gi) => (
            <React.Fragment key={group.heading}>
              {gi > 0 && <Command.Separator />}
              <Command.Group heading={group.heading}>
                {group.items.map((item) => (
                  <Command.Item
                    key={item.href}
                    value={`${item.label} ${item.href}`}
                    onSelect={() => handleNavigate(item.href)}
                  >
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
