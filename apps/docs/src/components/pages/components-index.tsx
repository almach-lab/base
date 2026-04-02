import * as React from "react";
import { ArrowRight, Copy, Search } from "lucide-react";
import { Badge, Input } from "@almach/ui";
import { DOC_COMPONENT_GROUPS } from "../../lib/doc-components";

type Group = {
  name: string;
  id: string;
  items: { name: string; href: string; description: string }[];
};

const GROUPS: Group[] = DOC_COMPONENT_GROUPS.map((group) => ({
  name: group.name,
  id: `group-${group.name.toLowerCase()}`,
  items: group.items.map((item) => ({
    name: item.name,
    href: `/components/${item.slug}`,
    description: item.description,
  })),
}));

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
const TOTAL = ALL_ITEMS.length;

export function ComponentsIndexPage() {
  const [query, setQuery] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return ALL_ITEMS.filter((item) => item.name.toLowerCase().includes(q) || item.description.toLowerCase().includes(q));
  }, [query]);

  const copyMarkdown = React.useCallback(async () => {
    const lines = ["# All Components", "", ...GROUPS.flatMap((group) => [
      `## ${group.name}`,
      ...group.items.map((item) => `- [${item.name}](${item.href})`),
      "",
    ])];

    try {
      await navigator.clipboard.writeText(lines.join("\n"));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 md:px-5 md:py-8">
      <div className="mb-5 border-b border-border/70 pb-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="font-mono text-[11px]">
            @almach/ui
          </Badge>
          <button
            onClick={copyMarkdown}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/70 hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copied ? "Copied" : "Copy Markdown"}
          </button>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-[2.2rem]">All Components</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
          Browse documented components by category. {TOTAL} components are currently available.
        </p>
      </div>

      <div className="mb-6">
        <Input
          type="search"
          placeholder="Search components..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search components"
          className="h-10 border-border/80"
          leftElement={<Search className="h-4 w-4" aria-hidden="true" />}
        />
      </div>

      {filtered !== null ? (
        filtered.length === 0 ? (
          <div className="rounded-xl border border-border/70 bg-muted/20 px-4 py-8 text-center text-sm text-muted-foreground">
            No components match "{query}".
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((item) => (
              <ComponentCard key={item.href} {...item} />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-9 md:space-y-10">
          {GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <h2 className="mb-3 text-xl font-semibold tracking-tight md:text-2xl">{group.name}</h2>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.items.map((item) => (
                  <ComponentCard key={item.href} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function ComponentCard({ name, href, description }: { name: string; href: string; description: string }) {
  return (
    <a
      href={href}
      aria-label={`${name} — ${description}`}
      className="group block rounded-xl border border-border/70 bg-card/50 p-2.5 transition-all hover:border-primary/45 hover:bg-card"
    >
      <div className="mb-2.5 flex h-32 items-center justify-center rounded-lg border border-border/60 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.16),transparent_52%)] md:h-36">
        <span className="rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-medium text-primary">
          {name}
        </span>
      </div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold md:text-base">{name}</p>
          <p className="mt-1 text-xs text-muted-foreground md:text-sm">{description}</p>
        </div>
        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
      </div>
    </a>
  );
}
