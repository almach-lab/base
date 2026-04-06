import {
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Input,
  Progress,
  Radio,
  Separator,
  Switch,
  Tabs,
  Textarea,
} from "@almach/ui";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { getPackageVersion } from "../../lib/package-versions";

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
    <div className="w-full rounded-2xl border border-border/70 bg-card/50 p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Install all packages
        </p>
        <Badge variant="outline" className="text-[10px]">
          Copy-ready
        </Badge>
      </div>
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

      <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background px-3 py-2 text-xs text-muted-foreground sm:text-sm">
        <code>
          <span className="text-muted-foreground">$ </span>
          {INSTALL[pm]}
        </code>
      </pre>
    </div>
  );
}

export function HomePage() {
  const [notifications, setNotifications] = useState(true);
  const [plan, setPlan] = useState("starter");

  return (
    <div className="bg-[radial-gradient(860px_420px_at_50%_-120px,hsl(var(--primary)/0.18),transparent),linear-gradient(to_bottom,hsl(var(--background)),hsl(var(--background)))]">
      <section className="border-b border-border/70">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-12 md:px-6 md:py-14">
          <div className="space-y-4 md:col-span-7">
            <Badge variant="outline" className="w-fit text-[11px]">
              <Sparkles className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              New generation React toolkit
            </Badge>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-[2.6rem]">
              Build polished products faster with one cohesive system.
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              Almach combines UI components, typed forms, and query utilities
              into one workflow so teams ship clean interfaces with fewer bugs.
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild>
                <a href="/getting-started">
                  Start building
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <a href="/components">Explore components</a>
              </Button>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {[
                { label: "UI primitives", value: "35+" },
                { label: "Form fields", value: "Typed" },
                { label: "Query helpers", value: "Factory-first" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-border/70 bg-background/65 px-3 py-2"
                >
                  <p className="text-[11px] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <InstallBar />
          </div>

          <Card className="border-border/70 bg-card/60 shadow-sm md:col-span-5">
            <Card.Header>
              <Card.Title className="text-base">Team activity</Card.Title>
              <p className="text-sm text-muted-foreground">
                A compact preview of common interface states.
              </p>
            </Card.Header>
            <Card.Content className="space-y-3">
              <div className="flex items-center gap-2.5 rounded-lg border border-border/70 bg-background/80 p-3">
                <Avatar size="sm">
                  <Avatar.Fallback>AR</Avatar.Fallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">Weekly release</p>
                  <p className="truncate text-xs text-muted-foreground">
                    QA checklist completed
                  </p>
                </div>
                <Badge variant="outline">Ready</Badge>
              </div>

              <div className="space-y-1.5 rounded-lg border border-border/70 bg-background/80 p-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Migration progress</span>
                  <span>74%</span>
                </div>
                <Progress value={74} />
              </div>

              <div className="rounded-lg border border-border/70 bg-background/80 p-3">
                <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Release checklist</span>
                  <span>2/3 complete</span>
                </div>
                <div className="space-y-1.5 text-sm">
                  <label className="flex items-center gap-2">
                    <Checkbox defaultChecked className="h-4 w-4" />
                    <span>Visual QA</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox defaultChecked className="h-4 w-4" />
                    <span>Docs snapshot</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <Checkbox className="h-4 w-4" />
                    <span>Publish release notes</span>
                  </label>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-2">
                <Button size="sm" variant="outline" className="w-full">
                  Open roadmap
                </Button>
                <Button size="sm" className="w-full">
                  Deploy preview
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      </section>

      <section className="border-b border-border/70">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Interactive studio
              </h2>
              <p className="text-sm text-muted-foreground">
                Clean, production-like patterns built with shared primitives.
              </p>
            </div>
            <Badge className="hidden sm:inline-flex" variant="outline">
              <Zap className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
              Composable by default
            </Badge>
          </div>

          <Tabs defaultValue="ui" className="space-y-3">
            <Tabs.List>
              <Tabs.Trigger value="ui">UI Flow</Tabs.Trigger>
              <Tabs.Trigger value="forms">Forms Flow</Tabs.Trigger>
              <Tabs.Trigger value="query">Data Flow</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="ui">
              <Card className="border-border/70 bg-card/45">
                <Card.Content className="grid gap-3 p-4 md:grid-cols-12">
                  <div className="space-y-2 md:col-span-7">
                    <Input placeholder="Search project settings..." />
                    <Textarea placeholder="Write release note summary..." />
                    <div className="flex gap-2">
                      <Button size="sm">Save draft</Button>
                      <Button size="sm" variant="outline">
                        Preview
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2 rounded-xl border border-border/70 bg-background/80 p-3 md:col-span-5">
                    <div className="flex items-center justify-between text-sm">
                      <span>Enable notifications</span>
                      <Switch
                        size="sm"
                        isSelected={notifications}
                        onChange={setNotifications}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-2 text-sm">
                      <label className="flex items-center gap-2">
                        <Checkbox defaultChecked className="h-4 w-4" />
                        <span>Ship with analytics enabled</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox className="h-4 w-4" />
                        <span>Require review approvals</span>
                      </label>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="forms">
              <Card className="border-border/70 bg-card/45">
                <Card.Content className="grid gap-3 p-4 md:grid-cols-12">
                  <div className="space-y-2 md:col-span-7">
                    <Input placeholder="Email address" type="email" />
                    <Input placeholder="Workspace name" />
                    <Textarea placeholder="Tell us about your project" />
                  </div>
                  <div className="rounded-xl border border-border/70 bg-background/80 p-3 md:col-span-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Plan
                    </p>
                    <Radio value={plan} onChange={setPlan}>
                      <Radio.Item
                        value="starter"
                        label="Starter"
                        description="Best for new teams"
                      />
                      <Radio.Item
                        value="scale"
                        label="Scale"
                        description="Advanced workflows"
                      />
                    </Radio>
                    <Button size="sm" className="mt-3 w-full">
                      Continue
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </Tabs.Content>

            <Tabs.Content value="query">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  { label: "Users query", value: "fresh", pct: 92 },
                  { label: "Projects query", value: "warm", pct: 67 },
                  { label: "Audit logs", value: "stale", pct: 31 },
                ].map((item) => (
                  <Card
                    key={item.label}
                    className="border-border/70 bg-card/45"
                  >
                    <Card.Content className="space-y-2 p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">{item.label}</p>
                        <Badge variant="outline">{item.value}</Badge>
                      </div>
                      <Progress value={item.pct} />
                      <p className="text-xs text-muted-foreground">
                        Cache health {item.pct}%
                      </p>
                    </Card.Content>
                  </Card>
                ))}
              </div>
            </Tabs.Content>
          </Tabs>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-12">
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">
              One ecosystem, three focused packages
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Start simple, scale intentionally, and keep implementation clean.
            </p>
          </div>

          <div className="grid gap-3 lg:grid-cols-3">
            {[
              {
                pkg: "@almach/ui",
                version: getPackageVersion("@almach/ui"),
                title: "UI components",
                desc: "Accessible primitives and polished defaults for product interfaces.",
                href: "/components",
                sample: '<Button variant="default">Save</Button>',
              },
              {
                pkg: "@almach/forms",
                version: getPackageVersion("@almach/forms"),
                title: "Typed forms",
                desc: "Zod + TanStack Form patterns for predictable validation flows.",
                href: "/forms",
                sample: '<TextField label="Email" required />',
              },
              {
                pkg: "@almach/query",
                version: getPackageVersion("@almach/query"),
                title: "Data layer",
                desc: "Typed query and mutation factories with consistent invalidation.",
                href: "/query",
                sample: "const q = createQuery({ queryKey, queryFn })",
              },
            ].map((item) => (
              <Card
                key={item.pkg}
                className="border-border/70 bg-card/50 shadow-sm"
              >
                <Card.Content className="space-y-3 p-4">
                  <Badge
                    variant="outline"
                    className="w-fit font-mono text-[11px]"
                  >
                    {item.pkg}
                  </Badge>
                  <p className="text-[11px] font-mono text-muted-foreground">
                    v{item.version}
                  </p>
                  <div>
                    <h3 className="text-base font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <pre className="overflow-x-auto rounded-xl border border-border/70 bg-background px-3 py-2 text-[11px] text-muted-foreground">
                    <code>{item.sample}</code>
                  </pre>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a href={item.href}>
                      Open docs
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
