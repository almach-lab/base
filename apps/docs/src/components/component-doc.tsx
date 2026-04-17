import { Badge, Card } from "@almach/ui";
import { cn } from "@almach/utils";
import * as React from "react";
import { CodeBlock } from "./code-block";

export interface ExampleProps {
  title: string;
  description?: string;
  preview: React.ReactNode;
  code: string;
  lang?: string;
  centered?: boolean;
}

function sanitizeTilePreview(node: React.ReactNode): React.ReactNode {
  if (!React.isValidElement(node)) {
    return node;
  }

  const props = node.props as Record<string, unknown>;
  const {
    id: _id,
    htmlFor: _htmlFor,
    "aria-labelledby": _ariaLabelledBy,
    "aria-describedby": _ariaDescribedBy,
    children,
    ...rest
  } = props;

  const safeChildren = React.Children.map(
    children as React.ReactNode,
    (child) => sanitizeTilePreview(child),
  );

  return React.cloneElement(node, rest, safeChildren);
}

function VariantTile({
  example,
  selected,
  onClick,
}: {
  example: ExampleProps;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      aria-label={`View ${example.title} example`}
      className="group block w-full cursor-pointer rounded-xl text-left outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card
        className={cn(
          "border-border/70 bg-card/40 transition-colors",
          selected ? "border-primary/55 bg-primary/5" : "hover:border-border",
        )}
      >
        <div className="relative flex h-40 w-full items-center justify-center overflow-hidden border-b border-border/60 bg-muted/20 p-4">
          <div
            className={cn(
              "h-full w-full *:max-h-full *:max-w-full",
              example.centered === false && "*:h-full *:w-full",
            )}
          >
            {/* Tile previews are visual-only to avoid nested interactive controls in selector cards. */}
            <div className="pointer-events-none select-none">
              {sanitizeTilePreview(example.preview)}
            </div>
          </div>
        </div>
        <Card.Footer className="flex items-center justify-between gap-2 p-3">
          <p
            className={cn(
              "truncate text-xs font-medium",
              selected
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground",
            )}
          >
            {example.title}
          </p>
          {selected && (
            <span
              className="h-1.5 w-1.5 rounded-full bg-primary"
              aria-hidden="true"
            />
          )}
        </Card.Footer>
      </Card>
    </button>
  );
}

function ExampleViewer({ example }: { example: ExampleProps }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const uid = React.useId();

  React.useEffect(() => {
    setTab("preview");
  }, [example.title]);

  return (
    <div className="rounded-xl border border-border/70 bg-card/40">
      <div
        role="tablist"
        aria-label="Example view"
        className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-3 py-2"
      >
        <div className="flex items-center gap-1">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              aria-controls={`${uid}-tabpanel-${t}`}
              id={`${uid}-tab-${t}`}
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                tab === t
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">
          {example.title}
        </span>
      </div>

      {tab === "preview" ? (
        <div
          id={`${uid}-tabpanel-preview`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-preview`}
          className={cn(
            "min-h-48 bg-background px-4 py-6 sm:px-6",
            example.centered !== false && "flex items-center justify-center",
          )}
        >
          {example.preview}
        </div>
      ) : (
        <div
          id={`${uid}-tabpanel-code`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-code`}
        >
          <CodeBlock
            code={example.code}
            lang={example.lang ?? "tsx"}
            className="rounded-none border-0 bg-transparent"
          />
        </div>
      )}
    </div>
  );
}

export interface PropRow {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

function PropsTable({ props }: { props: PropRow[] }) {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-semibold">Props</h2>
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 bg-muted/25">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {props.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="px-4 py-3">
                  <code className="font-mono text-[12px] text-foreground">
                    {p.name}
                  </code>
                  {p.required && (
                    <span className="ml-1 text-xs text-destructive">*</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-[12px] text-primary/90">
                    {p.type}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-[12px] text-muted-foreground">
                    {p.default ?? "-"}
                  </code>
                </td>
                <td className="px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  {p.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export interface ComponentDocProps {
  name: string;
  description: string;
  pkg?: string;
  examples: ExampleProps[];
  props?: PropRow[];
  children?: React.ReactNode;
}

export function ComponentDoc({
  name,
  description,
  pkg = "@almach/ui",
  examples,
  props,
  children,
}: ComponentDocProps) {
  const [selected, setSelected] = React.useState(0);
  const activeExample = (examples[selected] ?? examples[0])!;
  const handleSelect = React.useCallback(
    (i: number) => {
      // Avoid re-renders and focus/scroll churn when clicking the already active tile.
      if (i === selected) return;
      setSelected(i);
    },
    [selected],
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 md:px-5 md:py-9">
      <div className="space-y-2 border-b border-border/70 pb-6">
        <Badge variant="outline" className="w-fit font-mono text-[11px]">
          {pkg}
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">
          {name}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {description}
        </p>
      </div>

      {children}

      <div className="scroll-mt-16 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-foreground">
            Example: {activeExample.title}
          </h2>
          {activeExample.description && (
            <p className="text-xs text-muted-foreground">
              {activeExample.description}
            </p>
          )}
        </div>
        <ExampleViewer example={activeExample} />
      </div>

      {examples.length > 1 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">
            All Examples
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {examples.map((ex, i) => (
              <VariantTile
                key={i}
                example={ex}
                selected={i === selected}
                onClick={() => handleSelect(i)}
              />
            ))}
          </div>
        </div>
      )}

      {props && props.length > 0 && <PropsTable props={props} />}
    </div>
  );
}
