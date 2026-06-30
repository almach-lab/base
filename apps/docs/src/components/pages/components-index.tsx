import { Input } from "@almach/ui";
import { ArrowRight, Search } from "lucide-react";
import * as React from "react";
import { DOC_COMPONENT_GROUPS } from "../../lib/doc-components";
import { docsLayout } from "../../lib/docs-layout";
import { DocCopyButton, DocPageHeader } from "../docs/doc-page-header";

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

  const filtered = React.useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    return ALL_ITEMS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q),
    );
  }, [query]);

  const copyMarkdown = React.useCallback(async () => {
    const lines = [
      "# All Components",
      "",
      ...GROUPS.flatMap((group) => [
        `## ${group.name}`,
        ...group.items.map((item) => `- [${item.name}](${item.href})`),
        "",
      ]),
    ];

    await navigator.clipboard.writeText(lines.join("\n"));
  }, []);

  return (
    <article className={docsLayout.article}>
      <DocPageHeader
        title="Components"
        description={`${TOTAL} documented components, grouped by category.`}
        action={<DocCopyButton label="Copy list" onClick={copyMarkdown} />}
      >
        <Input
          type="search"
          placeholder="Search components..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label="Search components"
          className="h-9"
          leftElement={<Search className="h-4 w-4" aria-hidden="true" />}
        />
      </DocPageHeader>

      {filtered !== null ? (
        filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No components match &ldquo;{query}&rdquo;.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2">
            {filtered.map((item) => (
              <ComponentCard key={item.href} {...item} />
            ))}
          </div>
        )
      ) : (
        <div className="space-y-10">
          {GROUPS.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-20">
              <h2 className="mb-4 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
                {group.name}
              </h2>
              <div className="grid gap-2 sm:grid-cols-2">
                {group.items.map((item) => (
                  <ComponentCard key={item.href} {...item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </article>
  );
}

function ComponentCard({
  name,
  href,
  description,
}: {
  name: string;
  href: string;
  description: string;
}) {
  return (
    <a
      href={href}
      className="group flex items-start justify-between gap-3 rounded-lg border border-border/50 px-4 py-3 transition-colors hover:border-border hover:bg-muted/40"
    >
      <div className="min-w-0">
        <p className="text-sm font-medium">{name}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <ArrowRight
        className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        aria-hidden="true"
      />
    </a>
  );
}
