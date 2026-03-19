import React, { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { CodeBlock } from "../code-block";

/* ── Deterministic star field ─────────────────────────────────────────────── *
 * Uses a seeded LCG so positions never change between renders (no hydration   *
 * mismatch, no re-layout on re-render).                                       */

interface StarData {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  golden: boolean; // primary-colored glow star
}

function seededStars(count: number): StarData[] {
  let s = 0xdeadbeef;
  const next = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 0x100000000; };

  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: next() * 100,
    y: next() * 100,
    size: 0.5 + next() * 1.5,          // 0.5 – 2 px
    opacity: 0.15 + next() * 0.65,        // 0.15 – 0.80
    duration: 2.5 + next() * 4,            // 2.5 – 6.5 s
    delay: next() * 6,                  // 0 – 6 s
    golden: i % 22 === 0,               // every 22nd star is primary-colored
  }));
}

function StarField({ count = 180 }: { count?: number }) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stars = useMemo(() => seededStars(count), []);

  return (
    /*
     * Opacity wrapper: very dim in light mode so the dark dots on white bg are
     * barely visible (decorative only); full brightness in dark mode.
     * text-foreground/dark:text-white makes non-golden stars inherit the
     * correct color for each theme via currentColor.
     */
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden text-foreground opacity-[0.18] dark:text-white dark:opacity-100"
      aria-hidden="true"
    >
      {stars.map((star) => (
        <span
          key={star.id}
          className="absolute rounded-full"
          style={
            {
              "--star-o": star.opacity,
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
              background: star.golden ? "hsl(var(--primary))" : "currentColor",
              boxShadow: star.golden
                ? `0 0 ${star.size * 5}px 1px hsl(var(--primary) / 0.55)`
                : `0 0 ${star.size * 1.5}px currentColor`,
              animation: `star-twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

/* ── Hero install snippet (always dark-styled inside the dark hero) ───────── */

const PKG_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;
type PM = (typeof PKG_MANAGERS)[number];
const INSTALL: Record<PM, string> = {
  bun: "bun add @almach/ui",
  npm: "npm install @almach/ui",
  pnpm: "pnpm add @almach/ui",
  yarn: "yarn add @almach/ui",
};

function HeroInstall() {
  const [pm, setPm] = useState<PM>("bun");
  return (
    <div className="max-w-xs">
      <div className="mb-1.5 flex gap-0.5">
        {PKG_MANAGERS.map((m) => (
          <button
            key={m}
            onClick={() => setPm(m)}
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${m === pm
              ? "bg-foreground/10 text-foreground dark:bg-white/15 dark:text-white"
              : "text-foreground/35 hover:bg-foreground/8 hover:text-foreground/60 dark:text-white/35 dark:hover:bg-white/[0.08] dark:hover:text-white/60"
              }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/40 px-4 py-2.5 font-mono text-sm dark:border-white/10 dark:bg-white/[0.05]">
        <span className="select-none text-foreground/25 dark:text-white/25">$</span>
        <span className="text-foreground/55 dark:text-white/55">{INSTALL[pm].split(" ").slice(0, -1).join(" ")} </span>
        <span className="text-primary">@almach/ui</span>
      </div>
    </div>
  );
}

/* ── Data ─────────────────────────────────────────────────────────────────── */

const highlights = [
  {
    title: "Composable",
    description:
      "Compound component patterns — no prop drilling, no context juggling. Build any layout from first principles.",
  },
  {
    title: "Themed",
    description:
      "Golden and infinitely adaptable. Override any CSS variable in your stylesheet — no config files, no build steps.",
  },
  {
    title: "Accessible",
    description:
      "Built on Radix UI primitives with full keyboard navigation, ARIA attributes, and focus management out of the box.",
  },
  {
    title: "Type-safe",
    description:
      "γ Andromedae — precision at every layer. Full TypeScript coverage across components, forms, and data fetching.",
  },
];

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
    label: "Query",
    href: "/query",
  },
  {
    name: "@almach/utils",
    description: "Tree-shakable utilities: cn(), date formatting, and more.",
    label: "Utils",
    href: "/getting-started",
  },
];

/* ── Page ─────────────────────────────────────────────────────────────────── */

export function HomePage() {
  return (
    <div>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}

      <section className="relative overflow-hidden bg-background dark:bg-[hsl(224_30%_5%)]">

        {/* Star field — dim/dark in light, bright/white in dark (see StarField) */}
        <StarField />

        {/* Nebula glow — visible in both modes, just more dramatic in dark */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 45% at 25% 55%, hsl(var(--primary) / 0.07) 0%, transparent 70%), " +
              "radial-gradient(ellipse 40% 35% at 75% 20%, hsl(200 80% 60% / 0.04) 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div className="relative mx-auto max-w-screen-xl px-4 pb-28 pt-24 md:px-6 lg:pb-36 lg:pt-36">
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span className="text-[10px]">✦</span>
              γ Andromedae · Open source
            </div>

            {/* Title */}
            <h1 className="mb-4 text-[4.5rem] font-black leading-[0.9] tracking-tighter text-foreground dark:text-white sm:text-[7rem]">
              Almach
            </h1>

            <p className="mb-5 text-xl font-medium tracking-tight text-foreground/75 dark:text-white/75">
              Build UIs that shine.
            </p>

            <p className="mb-10 max-w-lg text-base leading-relaxed text-muted-foreground dark:text-white/45">
              Named after γ Andromedae — the luminous double star at the foot of the Princess.
              A modern React component library: accessible, composable, and fully themeable via CSS variables.
            </p>

            {/* CTAs */}
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <a
                href="/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-accent dark:border-white/15 dark:text-white/75 dark:hover:border-white/25 dark:hover:bg-white/[0.08]"
              >
                Browse components
              </a>
            </div>

            {/* Install snippet */}
            <HeroInstall />
          </div>
        </div>

        {/* Bottom fade — only needed in dark mode (light hero bg == page bg) */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 hidden h-40 bg-gradient-to-t from-background to-transparent dark:block" />
      </section>

      {/* ── The Constellation ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-screen-xl px-4 py-24 md:px-6">

        <div className="mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
            The constellation
          </p>
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Crafted for the modern web
          </h2>
          <p className="text-muted-foreground">
            Four principles. Each named after a star in Andromeda.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="group rounded-xl border bg-card p-5 transition-colors hover:border-primary/40"
            >
              <p className="mb-2 font-semibold">{h.title}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Packages ──────────────────────────────────────────────────────── */}
      <section className="border-t">
        <div className="mx-auto max-w-screen-xl px-4 py-24 md:px-6">

          <div className="mb-12">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Packages
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Four focused packages
            </h2>
            <p className="text-muted-foreground">
              Install only what you need. Each package is independently versioned.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {packages.map((pkg) => (
              <a
                key={pkg.name}
                href={pkg.href}
                className="group flex flex-col gap-4 rounded-xl border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-primary/[0.025]"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-mono text-sm font-semibold">{pkg.name}</p>
                  <span className="shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {pkg.label}
                  </span>
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {pkg.description}
                </p>
                <span className="flex items-center gap-1 text-xs font-medium text-primary">
                  Learn more
                  <ArrowRight
                    className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Theming callout ───────────────────────────────────────────────── */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-screen-xl px-4 py-24 md:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">
              Theming
            </p>
            <h2 className="mb-3 text-2xl font-bold tracking-tight">
              Every star has its own color
            </h2>
            <p className="mb-7 text-muted-foreground">
              Override any design token in your stylesheet — no config files, no build steps.
              The golden theme is just the default.
            </p>
            <CodeBlock
              filename="globals.css"
              code={`:root {
  --primary:   43 90% 48%;    /* golden — like Sandy  */
  --ring:      43 90% 48%;    /* focus ring           */
  --radius:    0.625rem;      /* border radius        */
}`}
            />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="border-t">
        <div className="mx-auto max-w-screen-xl px-4 py-24 md:px-6">
          <div className="mx-auto max-w-md text-center">
            <h2 className="mb-3 text-2xl font-bold tracking-tight">Ready to build?</h2>
            <p className="mb-8 text-muted-foreground">
              Start with the docs or explore the interactive component demos.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Read the docs
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="/components"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                View components
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
