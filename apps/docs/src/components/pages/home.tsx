import { Badge, Button, Card, Checkbox, Input, Switch } from "@almach/ui";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

const PKG_MANAGERS = ["bun", "npm", "pnpm", "yarn"] as const;
type PM = (typeof PKG_MANAGERS)[number];

const INSTALL: Record<PM, string> = {
  bun: "bun add @almach/ui @almach/forms @almach/query",
  npm: "npm install @almach/ui @almach/forms @almach/query",
  pnpm: "pnpm add @almach/ui @almach/forms @almach/query",
  yarn: "yarn add @almach/ui @almach/forms @almach/query",
};

function InstallBar() {
  const [pm, setPm] = useState<PM>("bun");

  return (
    <div className="mx-auto mt-6 w-full max-w-2xl rounded-xl border border-border/70 bg-card/40 p-3">
      <div className="mb-2 flex flex-wrap gap-1.5">
        {PKG_MANAGERS.map((manager) => (
          <button
            key={manager}
            onClick={() => setPm(manager)}
            className={
              pm === manager
                ? "rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"
                : "rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
            }
          >
            {manager}
          </button>
        ))}
      </div>

      <pre className="overflow-x-auto rounded-lg border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground sm:text-sm">
        <code>
          <span className="text-muted-foreground">$ </span>
          {INSTALL[pm]}
        </code>
      </pre>
    </div>
  );
}

function ShowcaseCanvas() {
  const TABS = [
    "Examples",
    "Dashboard",
    "Tasks",
    "Playground",
    "Authentication",
  ] as const;
  type ShowcaseTab = (typeof TABS)[number];
  const [activeTab, setActiveTab] = useState<ShowcaseTab>("Examples");

  const renderPanel = () => {
    if (activeTab === "Examples") {
      return (
        <div className="grid gap-3 lg:grid-cols-12">
          <Card className="border-border/70 bg-background lg:col-span-4">
            <Card.Content className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Payment Method
              </p>
              <Input placeholder="Name on card" />
              <div className="grid grid-cols-3 gap-2">
                <Input className="col-span-2" placeholder="Card number" />
                <Input placeholder="CVV" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Month" />
                <Input placeholder="Year" />
              </div>
              <Button size="sm" className="w-full">
                Submit
              </Button>
            </Card.Content>
          </Card>

          <Card className="border-border/70 bg-background lg:col-span-3">
            <Card.Content className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Team
              </p>
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-center">
                <p className="text-sm font-semibold">No team members</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Invite your team to collaborate.
                </p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                Invite members
              </Button>
              <div className="rounded-lg border border-border/70 bg-muted/20 p-2 text-xs text-muted-foreground">
                Syncing • Updating • Loading
              </div>
            </Card.Content>
          </Card>

          <Card className="border-border/70 bg-background lg:col-span-5">
            <Card.Content className="space-y-3 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Settings
                </p>
                <Badge variant="outline">Neutral</Badge>
              </div>
              <Input placeholder="https://" />
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
                <p className="text-sm font-semibold">
                  Two-factor authentication
                </p>
                <p className="text-xs text-muted-foreground">
                  Verify via email or phone number.
                </p>
              </div>
              <div className="space-y-2 rounded-lg border border-border/70 bg-muted/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Allow notifications</span>
                  <Switch defaultChecked size="sm" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tint wallpaper</span>
                  <Switch size="sm" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      );
    }

    if (activeTab === "Dashboard") {
      return (
        <div className="grid gap-3 lg:grid-cols-12">
          {[
            { label: "Active Users", value: "12,430", change: "+8.2%" },
            { label: "Conversion", value: "4.73%", change: "+0.6%" },
            { label: "MRR", value: "$84,200", change: "+11.4%" },
            { label: "Retention", value: "92.1%", change: "+1.1%" },
          ].map((item) => (
            <Card
              key={item.label}
              className="border-border/70 bg-background lg:col-span-3"
            >
              <Card.Content className="space-y-1.5 p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-xl font-semibold">{item.value}</p>
                <p className="text-xs text-primary">{item.change}</p>
              </Card.Content>
            </Card>
          ))}
          <Card className="border-border/70 bg-background lg:col-span-8">
            <Card.Content className="p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Revenue trend
              </p>
              <div className="h-36 rounded-lg border border-border/70 bg-[linear-gradient(to_top,hsl(var(--primary)/0.2),transparent_70%)]" />
            </Card.Content>
          </Card>
          <Card className="border-border/70 bg-background lg:col-span-4">
            <Card.Content className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Top channels
              </p>
              {[
                { name: "Organic", share: "34%" },
                { name: "Paid", share: "28%" },
                { name: "Referral", share: "22%" },
                { name: "Direct", share: "16%" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-md border border-border/70 px-2.5 py-2 text-sm"
                >
                  <span>{item.name}</span>
                  <span className="text-muted-foreground">{item.share}</span>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      );
    }

    if (activeTab === "Tasks") {
      return (
        <div className="grid gap-3 lg:grid-cols-12">
          <Card className="border-border/70 bg-background lg:col-span-7">
            <Card.Content className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Sprint board
              </p>
              {[
                "Polish button loading states",
                "Add swipe actions docs page",
                "Improve keyboard accessibility for modal",
                "Finalize release notes",
              ].map((task, idx) => (
                <label
                  key={task}
                  className="flex items-center gap-2 rounded-md border border-border/70 px-3 py-2 text-sm"
                >
                  <Checkbox defaultChecked={idx < 2} className="h-4 w-4" />
                  <span>{task}</span>
                </label>
              ))}
            </Card.Content>
          </Card>
          <Card className="border-border/70 bg-background lg:col-span-5">
            <Card.Content className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Create task
              </p>
              <Input placeholder="Task title" />
              <Input placeholder="Assignee" />
              <Input placeholder="Due date" />
              <Button size="sm" className="w-full">
                Add task
              </Button>
            </Card.Content>
          </Card>
        </div>
      );
    }

    if (activeTab === "Playground") {
      return (
        <div className="grid gap-3 lg:grid-cols-12">
          <Card className="border-border/70 bg-background lg:col-span-8">
            <Card.Content className="space-y-3 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Prompt playground
              </p>
              <Input placeholder="Ask, search, or make anything..." />
              <div className="rounded-lg border border-border/70 bg-muted/20 p-3 text-sm text-muted-foreground">
                Suggestion: \"Generate settings panel with switches and
                badges.\"
              </div>
              <div className="flex gap-2">
                <Button size="sm">Run</Button>
                <Button size="sm" variant="outline">
                  Archive
                </Button>
                <Button size="sm" variant="outline">
                  Snooze
                </Button>
              </div>
            </Card.Content>
          </Card>
          <Card className="border-border/70 bg-background lg:col-span-4">
            <Card.Content className="space-y-2 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                Tokens
              </p>
              {[
                { label: "Input", value: "1,482" },
                { label: "Output", value: "604" },
                { label: "Latency", value: "1.2s" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between rounded-md border border-border/70 px-2.5 py-2 text-sm"
                >
                  <span>{row.label}</span>
                  <span className="text-muted-foreground">{row.value}</span>
                </div>
              ))}
            </Card.Content>
          </Card>
        </div>
      );
    }

    return (
      <div className="grid gap-3 lg:grid-cols-12">
        <Card className="border-border/70 bg-background lg:col-span-5">
          <Card.Content className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Sign in
            </p>
            <Input placeholder="Email" type="email" />
            <Input placeholder="Password" type="password" />
            <Button size="sm" className="w-full">
              Continue with Email
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </Card.Content>
        </Card>
        <Card className="border-border/70 bg-background lg:col-span-7">
          <Card.Content className="space-y-3 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              Security
            </p>
            <div className="rounded-lg border border-border/70 bg-muted/20 p-3">
              <p className="text-sm font-semibold">Two-factor authentication</p>
              <p className="text-xs text-muted-foreground">
                Recommended for all admin members.
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-md border border-border/70 p-3 text-sm">
                Magic link
              </div>
              <div className="rounded-md border border-border/70 p-3 text-sm">
                Recovery codes
              </div>
            </div>
            <div className="flex items-center justify-between rounded-md border border-border/70 px-3 py-2 text-sm">
              <span>Remember this device</span>
              <Switch size="sm" />
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  return (
    <section className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-6 md:py-12">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-card/40 p-1">
            {TABS.map((item) => (
              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === item
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("almach-customizer-toggle"))
            }
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            Open Theme Builder
          </button>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card/30 p-3">
          {renderPanel()}
        </div>
      </div>
    </section>
  );
}

function ExamplesSection() {
  const blocks = [
    {
      label: "@almach/ui",
      title: "Components",
      description: "Composable UI primitives with clean defaults.",
      preview: (
        <div className="space-y-2 rounded-lg border border-border/70 bg-background p-3">
          <Input placeholder="Search components..." />
          <div className="flex items-center gap-2">
            <Button size="sm">Continue</Button>
            <Button size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      ),
      code: `import { Button, Input } from "@almach/ui";\n\n<Input placeholder="Search..." />\n<Button>Continue</Button>`,
      href: "/components",
      cta: "Browse components",
    },
    {
      label: "@almach/forms",
      title: "Forms",
      description: "Typed form patterns with Zod schema validation.",
      preview: (
        <div className="space-y-2 rounded-lg border border-border/70 bg-background p-3">
          <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            john@example.com
          </div>
          <div className="rounded-md border border-border bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
            Password ••••••••
          </div>
          <div className="rounded-md bg-primary px-3 py-2 text-center text-xs font-semibold text-primary-foreground">
            Submit
          </div>
        </div>
      ),
      code: `const form = useBasedForm({\n  defaultValues: { email: "" },\n  validators: { onChange: schema },\n});`,
      href: "/forms",
      cta: "Open forms docs",
    },
    {
      label: "@almach/query",
      title: "Data",
      description: "Typed query/mutation factories for TanStack Query.",
      preview: (
        <div className="space-y-2 rounded-lg border border-border/70 bg-background p-3 text-xs">
          <div className="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
            <span>users</span>
            <span className="text-success">fresh</span>
          </div>
          <div className="flex items-center justify-between rounded-md border border-border px-2.5 py-2">
            <span>posts</span>
            <span className="text-warning">stale</span>
          </div>
        </div>
      ),
      code: `const usersQuery = createQuery({\n  queryKey: () => ["users"],\n  queryFn: fetchUsers,\n});`,
      href: "/query",
      cta: "Open query docs",
    },
  ];

  return (
    <section className="border-t border-border/70 bg-muted/10">
      <div className="mx-auto max-w-screen-xl px-4 py-10 md:px-6 md:py-12">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-semibold tracking-tight">
            Examples you can ship with
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Reference snippets for components, forms, and server-state
            workflows.
          </p>
        </div>

        <div className="grid gap-3 lg:grid-cols-3">
          {blocks.map((block) => (
            <Card key={block.label} className="border-border/70 bg-card/50">
              <Card.Content className="space-y-3 p-4">
                <Badge
                  variant="outline"
                  className="w-fit font-mono text-[11px]"
                >
                  {block.label}
                </Badge>
                <div>
                  <h3 className="text-base font-semibold">{block.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {block.description}
                  </p>
                </div>
                {block.preview}
                <pre className="overflow-x-auto rounded-lg border border-border/70 bg-background p-3 text-[11px] leading-relaxed text-muted-foreground">
                  <code>{block.code}</code>
                </pre>
                <a
                  href={block.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-opacity hover:opacity-80"
                >
                  {block.cta}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  return (
    <div>
      <section className="border-b border-border/70 bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_40%)]">
        <div className="mx-auto max-w-screen-xl px-4 py-14 md:px-6 md:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Almach UI
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.5rem]">
              The foundation for a clean design system.
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              A compact React UI system with typed forms and query helpers.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <a
                href="/getting-started"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                Get started
              </a>
              <a
                href="/components"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                View components
              </a>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              React 18+ · Tailwind CSS v4 · Open source
            </p>
          </div>

          <InstallBar />
        </div>
      </section>

      <ShowcaseCanvas />
      <ExamplesSection />
    </div>
  );
}
