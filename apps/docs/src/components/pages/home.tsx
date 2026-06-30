import { Badge, Button } from "@almach/ui";
import {
  ArrowRight,
  Blocks,
  Braces,
  Layers,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";
import { getPackageVersion } from "../../lib/package-versions";
import { HeroPreview } from "../landing/hero-preview";
import { LandingSection, SectionHeader } from "../landing/landing-section";
import { CodeBlock } from "../code-block";
import { PkgTabs } from "../pkg-tabs";

const PACKAGES = [
  {
    pkg: "@almach/ui",
    version: getPackageVersion("@almach/ui"),
    title: "UI",
    description: "Accessible primitives with polished defaults for product surfaces.",
    href: "/components",
    icon: Layers,
  },
  {
    pkg: "@almach/forms",
    version: getPackageVersion("@almach/forms"),
    title: "Forms",
    description: "Zod schemas and TanStack Form fields with consistent validation.",
    href: "/forms",
    icon: Braces,
  },
  {
    pkg: "@almach/query",
    version: getPackageVersion("@almach/query"),
    title: "Query",
    description: "Typed query and mutation factories with cache invalidation.",
    href: "/query",
    icon: Zap,
  },
] as const;

const CAPABILITIES = [
  {
    icon: Sparkles,
    title: "Accessible by default",
    description:
      "React Aria primitives with keyboard navigation, focus management, and screen reader support baked in.",
  },
  {
    icon: Palette,
    title: "Themeable tokens",
    description:
      "Semantic CSS variables and a live theme customizer — swap palettes without touching component code.",
  },
  {
    icon: Blocks,
    title: "Production blocks",
    description:
      "Dashboard layouts, charts, and form patterns you can copy into real products, not placeholder boxes.",
  },
] as const;

const SHOWCASE_COMPONENTS = [
  { name: "Button", href: "/components/button", tag: "Input" },
  { name: "Dialog", href: "/components/dialog", tag: "Overlay" },
  { name: "Select", href: "/components/select", tag: "Input" },
  { name: "Chart", href: "/components/chart", tag: "Data" },
  { name: "Sidebar", href: "/components/sidebar", tag: "Layout" },
  { name: "Table", href: "/components/table", tag: "Data" },
] as const;

const USAGE_EXAMPLE = `import { Button, Card, Input } from "@almach/ui";
import { Form, TextField, useBasedForm, z } from "@almach/forms";

const schema = z.object({ email: z.string().email() });

export function InviteForm() {
  const form = useBasedForm({
    schema,
    defaultValues: { email: "" },
    onSubmit: async (values) => {
      await inviteUser(values.email);
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit} className="space-y-4">
        <Card>
          <Card.Header>
            <Card.Title>Invite teammate</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-4">
            <TextField name="email" label="Email" required />
            <Button type="submit" loading={form.formState.isSubmitting}>
              Send invite
            </Button>
          </Card.Content>
        </Card>
      </form>
    </Form>
  );
}`;

export function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="landing-hero relative overflow-hidden border-b border-border/60">
        <div className="landing-hero-grid pointer-events-none absolute inset-0" />
        <div className="landing-hero-glow pointer-events-none absolute inset-0" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-8 pt-16 text-center sm:px-6 sm:pb-12 sm:pt-24 lg:px-8">
          <Badge variant="outline" className="mb-6 font-mono text-[11px] tracking-wide">
            React · Tailwind v4 · Open source
          </Badge>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-[-0.03em] sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
            Build polished interfaces{" "}
            <span className="landing-gradient-text">without the glue code</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Accessible components, typed forms, and query utilities — one cohesive
            toolkit with live docs and copy-paste examples.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button href="/getting-started" size="lg">
              Get started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="outline" href="/components" size="lg">
              Browse components
            </Button>
          </div>

          <div className="mt-10 w-full max-w-md text-left">
            <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
              Install
            </p>
            <PkgTabs packages="@almach/ui" />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8">
          <HeroPreview />
        </div>
      </section>

      <LandingSection>
        <SectionHeader
          eyebrow="Why Almach"
          title="Everything you need to ship UI"
          description="Primitives, patterns, and documentation designed to work together — not a loose collection of copy-pasted snippets."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border/60 bg-card/50 p-5 transition-colors hover:border-border hover:bg-card"
            >
              <item.icon
                className="h-4 w-4 text-primary"
                aria-hidden="true"
              />
              <h3 className="mt-3 text-sm font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </LandingSection>

      <LandingSection id="example">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionHeader
            eyebrow="Example"
            title="Real patterns, not toy demos"
            description="Forms compose with UI primitives out of the box. Copy the example into your app and adapt the schema."
            className="mb-0 lg:sticky lg:top-24"
          />

          <div className="min-w-0">
            <CodeBlock
              code={USAGE_EXAMPLE}
              lang="tsx"
              filename="invite-form.tsx"
            />
          </div>
        </div>
      </LandingSection>

      <LandingSection>
        <SectionHeader
          eyebrow="Explore"
          title="Start with a component"
          description="Jump into the docs for the pieces you need — each page includes live previews and API reference."
        />

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SHOWCASE_COMPONENTS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="group flex items-center justify-between rounded-lg border border-border/60 px-4 py-3 transition-colors hover:border-border hover:bg-accent/40"
            >
              <div>
                <p className="text-sm font-medium">{item.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {item.tag}
                </p>
              </div>
              <ArrowRight
                className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Button variant="ghost" href="/components">
            View all components
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </LandingSection>

      <LandingSection>
        <SectionHeader
          eyebrow="Packages"
          title="Install only what you need"
          description="All packages share the same design tokens and work independently or together."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {PACKAGES.map((item) => (
            <a
              key={item.pkg}
              href={item.href}
              className="group flex flex-col rounded-xl border border-border/60 p-5 transition-colors hover:border-border hover:bg-card"
            >
              <div className="flex items-start justify-between gap-3">
                <item.icon
                  className="h-4 w-4 text-primary"
                  aria-hidden="true"
                />
                <span className="font-mono text-[11px] text-muted-foreground">
                  v{item.version}
                </span>
              </div>
              <p className="mt-4 font-mono text-xs text-muted-foreground">
                {item.pkg}
              </p>
              <h3 className="mt-1 text-base font-semibold">{item.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary">
                View docs
                <ArrowRight
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </a>
          ))}
        </div>
      </LandingSection>

      <LandingSection border={false} containerClassName="py-20 sm:py-24">
        <div className="landing-cta relative overflow-hidden rounded-2xl border border-border/60 px-6 py-12 text-center sm:px-10 sm:py-14">
          <div className="landing-hero-glow pointer-events-none absolute inset-0 opacity-60" />
          <div className="relative">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to build?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
              Follow the getting started guide to wire up tokens, install packages,
              and render your first component in minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="/getting-started" size="lg">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" href="/blocks" size="lg">
                View blocks
              </Button>
            </div>
          </div>
        </div>
      </LandingSection>
    </div>
  );
}
