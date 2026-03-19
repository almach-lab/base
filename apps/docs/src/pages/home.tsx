import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "../components/code-block";
import { PkgTabs } from "../components/pkg-tabs";

const packages = [
  {
    name: "@almach/ui",
    description: "30+ accessible components built on Radix UI and Tailwind CSS v4.",
    label: "Components",
    href: "/components",
  },
  {
    name: "@almach/forms",
    description: "Type-safe forms with TanStack Form and Zod validation.",
    label: "Forms",
    href: "/forms",
  },
  {
    name: "@almach/query",
    description: "Typed query factories and mutation builders on TanStack Query.",
    label: "Data fetching",
    href: "/query",
  },
  {
    name: "@almach/utils",
    description: "Tree-shakable utilities: cn(), date formatting, and more.",
    label: "Utilities",
    href: "/getting-started",
  },
];

const highlights = [
  {
    title: "Composable",
    description: "Every component uses compound patterns — no prop drilling, no context juggling.",
  },
  {
    title: "Accessible",
    description: "Built on Radix UI primitives with full keyboard navigation and ARIA support.",
  },
  {
    title: "Themeable",
    description: "Override any CSS variable in your stylesheet to match your brand — no config files.",
  },
  {
    title: "Type-safe",
    description: "Full TypeScript coverage across components, forms, and data fetching.",
  },
];

export function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-screen-xl px-4 py-24 md:px-6 lg:py-32">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="flex h-4 w-4 items-center justify-center rounded bg-foreground text-[9px] font-black text-background" aria-hidden="true">B</span>
              Based Code · Open source
            </div>

            <h1 className="mb-5 text-5xl font-bold tracking-tight text-balance sm:text-6xl">
              Build UIs faster,{" "}
              <span className="text-muted-foreground">with less code.</span>
            </h1>

            <p className="mb-10 max-w-xl text-lg text-muted-foreground leading-relaxed">
              A modern React component library — accessible, composable, and fully themeable
              via CSS variables. One install, everything you need.
            </p>

            <div className="mb-10 flex flex-wrap items-center gap-3">
              <Link
                to="/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/components"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Browse components
              </Link>
            </div>

            <PkgTabs packages="@almach/ui" className="max-w-sm" />
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
        <div className="mb-10">
          <h2 className="mb-1.5 text-2xl font-bold tracking-tight">Why Based Code?</h2>
          <p className="text-muted-foreground">Designed for developer experience, built for production.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div key={h.title} className="rounded-xl border p-5">
              <p className="mb-2 font-semibold">{h.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="border-t">
        <div className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
          <div className="mb-10">
            <h2 className="mb-1.5 text-2xl font-bold tracking-tight">Four focused packages</h2>
            <p className="text-muted-foreground">Install only what you need. Each package is independently versioned.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <Link
                key={pkg.name}
                to={pkg.href}
                className="group flex flex-col gap-4 rounded-xl border p-5 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-sm font-semibold">{pkg.name}</p>
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground">
                    {pkg.label}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{pkg.description}</p>
                <span className="mt-auto flex items-center gap-1 text-xs font-medium">
                  Learn more
                  <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Theming callout */}
      <section className="border-t bg-muted/30">
        <div className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-3 text-2xl font-bold tracking-tight">Theme with CSS variables</h2>
            <p className="mb-6 text-muted-foreground">
              Override any design token in your own stylesheet — no config files, no build steps.
            </p>
            <CodeBlock
              filename="globals.css"
              code={`:root {
  --primary:   221.2 83.2% 53.3%;  /* brand blue */
  --ring:      221.2 83.2% 53.3%;  /* focus ring */
  --radius:    0.5rem;              /* border radius */

  /* switch colors */
  --switch-on:  hsl(221.2 83.2% 53.3%);
  --switch-off: hsl(220 8.9% 46.1% / 0.35);
}`}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t">
        <div className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight">Ready to build?</h2>
            <p className="mb-8 text-muted-foreground">
              Start with the docs or explore interactive component demos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-80"
              >
                Read the docs <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/components"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                View components
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
