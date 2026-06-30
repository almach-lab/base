import { cn } from "@almach/utils";
import type * as React from "react";
import { docsLayout } from "../lib/docs-layout";
import { DocExample } from "./docs/doc-example";
import { DocPageHeader, DocSectionHeading } from "./docs/doc-page-header";

export interface ExampleProps {
  title: string;
  description?: string;
  preview: React.ReactNode;
  code: string;
  lang?: string;
  centered?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function ExampleSection({ example }: { example: ExampleProps }) {
  const id = slugify(example.title);

  return (
    <section id={id} className={cn(docsLayout.scrollAnchor, "space-y-3")}>
      <DocSectionHeading
        level={3}
        title={example.title}
        {...(example.description ? { description: example.description } : {})}
      />

      <DocExample
        preview={example.preview}
        code={example.code}
        lang={example.lang ?? "tsx"}
        centered={example.centered !== false}
      />
    </section>
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
    <section id="props" className={cn(docsLayout.scrollAnchor, "space-y-3")}>
      <DocSectionHeading title="API Reference" />
      <div className="overflow-x-auto rounded-lg border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/40 bg-muted/15">
              {["Prop", "Type", "Default", "Description"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {props.map((p) => (
              <tr key={p.name} className="align-top">
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-foreground">
                    {p.name}
                  </code>
                  {p.required && (
                    <span className="ml-1 text-xs text-destructive">*</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-primary">
                    {p.type}
                  </code>
                </td>
                <td className="px-4 py-3">
                  <code className="font-mono text-xs text-muted-foreground">
                    {p.default ?? "—"}
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
    </section>
  );
}

export interface ComponentDocProps {
  name: string;
  description: string;
  examples: ExampleProps[];
  props?: PropRow[];
  children?: React.ReactNode;
}

export function ComponentDoc({
  name,
  description,
  examples,
  props,
  children,
}: ComponentDocProps) {
  return (
    <article className={docsLayout.article}>
      <DocPageHeader title={name} description={description} />

      {children}

      {examples.length > 0 && (
        <section
          id="examples"
          className={cn(docsLayout.scrollAnchor, docsLayout.section)}
        >
          <DocSectionHeading title="Examples" />
          <div className="flex flex-col gap-8">
            {examples.map((example) => (
              <ExampleSection key={example.title} example={example} />
            ))}
          </div>
        </section>
      )}

      {props && props.length > 0 && <PropsTable props={props} />}
    </article>
  );
}
