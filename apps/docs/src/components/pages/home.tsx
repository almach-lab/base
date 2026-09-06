import {
  Badge,
  Button,
  Card,
  Input,
  Progress,
  Separator,
  Slider,
  Switch,
  ToggleGroup,
} from "@almach/ui";
import { cn } from "@almach/utils";
import {
  ArrowRight,
  Braces,
  Check,
  LayoutGrid,
  List,
  Search,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { getPackageVersion } from "../../lib/package-versions";
import { CodeBlock } from "../code-block";
import { PkgTabs } from "../pkg-tabs";

const PACKAGES = [
  {
    pkg: "@almach/ui",
    version: getPackageVersion("@almach/ui"),
    title: "Interface",
    description: "Accessible controls, overlays, feedback and layout pieces.",
    href: "/components",
    icon: LayoutGrid,
  },
  {
    pkg: "@almach/forms",
    version: getPackageVersion("@almach/forms"),
    title: "Validation",
    description: "Form fields that keep TanStack Form and Zod in sync.",
    href: "/forms",
    icon: Braces,
  },
  {
    pkg: "@almach/query",
    version: getPackageVersion("@almach/query"),
    title: "Data",
    description: "Typed helpers for read, write and server-action flows.",
    href: "/query",
    icon: Zap,
  },
] as const;

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

const tileHeader = "px-5 pt-5";
const tileContent = "px-5 pb-5 pt-4";
const tileCopy = "text-sm leading-6 text-muted-foreground";

function ShowcaseTile({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn("h-full overflow-hidden bg-card/95 shadow-none", className)}
    >
      {children}
    </Card>
  );
}

function ControlsTile() {
  const [view, setView] = useState("grid");
  const [color, setColor] = useState("#d39d2a");

  return (
    <ShowcaseTile>
      <Card.Header className={tileHeader}>
        <Card.Title>Controls</Card.Title>
        <Card.Description>Buttons, color and view mode.</Card.Description>
      </Card.Header>
      <Card.Content className={cn("flex flex-col gap-4", tileContent)}>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Save</Button>
          <Button size="sm" variant="secondary">
            Draft
          </Button>
          <Button size="sm" variant="outline">
            Preview
          </Button>
        </div>
        <div className="grid gap-3">
          <Input.Color
            value={color}
            onChange={setColor}
            aria-label="Theme accent"
          />
          <ToggleGroup
            variant="segmented"
            selectionMode="single"
            disallowEmptySelection
            selectedKeys={[view]}
            onSelectionChange={(keys) => {
              const [first] = keys;
              if (typeof first === "string") setView(first);
            }}
            aria-label="View"
          >
            <ToggleGroup.Item id="grid" size="sm">
              <LayoutGrid />
              Grid
            </ToggleGroup.Item>
            <ToggleGroup.Item id="list" size="sm">
              <List />
              List
            </ToggleGroup.Item>
          </ToggleGroup>
        </div>
      </Card.Content>
    </ShowcaseTile>
  );
}

function FormTile() {
  return (
    <ShowcaseTile>
      <Card.Header className={tileHeader}>
        <Card.Title>Form field</Card.Title>
        <Card.Description>Input and range controls.</Card.Description>
      </Card.Header>
      <Card.Content className={cn("flex flex-col gap-4", tileContent)}>
        <Input placeholder="team@company.com" aria-label="Email" readOnly />
        <Slider label="Density" size="sm" showValue defaultValue={68} />
      </Card.Content>
    </ShowcaseTile>
  );
}

function StatusTile() {
  return (
    <ShowcaseTile>
      <Card.Header
        className={tileHeader}
        action={<Badge variant="success">Stable</Badge>}
      >
        <Card.Title>Status</Card.Title>
        <Card.Description>Progress and preference state.</Card.Description>
      </Card.Header>
      <Card.Content className={cn("flex flex-col gap-4", tileContent)}>
        <Progress value={76} />
        <div className="flex items-center justify-between rounded-md border border-border bg-muted/25 px-3 py-2.5">
          <span className="text-sm text-muted-foreground">Notifications</span>
          <Switch defaultSelected aria-label="Notifications" />
        </div>
      </Card.Content>
    </ShowcaseTile>
  );
}

function SearchTile() {
  return (
    <ShowcaseTile>
      <Card.Header className={tileHeader}>
        <Card.Title>Find docs</Card.Title>
        <Card.Description>Search and jump to component pages.</Card.Description>
      </Card.Header>
      <Card.Content className={cn("flex flex-col gap-3", tileContent)}>
        <div className="flex items-center gap-2 rounded-md border border-border bg-muted/25 px-3 py-2 text-sm text-muted-foreground">
          <Search aria-hidden="true" className="size-4 shrink-0" />
          <span className="min-w-0 flex-1">Search docs</span>
          <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            K
          </kbd>
        </div>
        <div className="flex flex-col text-sm">
          {["Button", "Input Color", "Dialog"].map((item, index) => (
            <a
              key={item}
              href="/components"
              className={cn(
                "flex items-center justify-between gap-3 border-t border-border px-1 py-2.5 transition-colors hover:text-primary",
                focusRing,
              )}
            >
              <span>{item}</span>
              {index === 1 && <Badge variant="secondary">New</Badge>}
            </a>
          ))}
        </div>
      </Card.Content>
    </ShowcaseTile>
  );
}

function InstallTile() {
  return (
    <ShowcaseTile>
      <Card.Header className={tileHeader}>
        <Card.Title>Install what you use</Card.Title>
        <Card.Description>Start with UI. Add more later.</Card.Description>
      </Card.Header>
      <Card.Content className={tileContent}>
        <PkgTabs packages="@almach/ui" />
      </Card.Content>
    </ShowcaseTile>
  );
}

function CodeTile() {
  return (
    <ShowcaseTile>
      <Card.Header className={tileHeader}>
        <Card.Title>Normal React</Card.Title>
        <Card.Description>
          No generated wrapper layer. Import the component and ship.
        </Card.Description>
      </Card.Header>
      <Card.Content className={tileContent}>
        <pre className="overflow-x-auto rounded-md bg-muted/40 p-3 font-mono text-xs leading-5">
          <code>{`import { Button } from "@almach/ui";

<Button>Save changes</Button>`}</code>
        </pre>
      </Card.Content>
    </ShowcaseTile>
  );
}

function ComponentShowcase() {
  return (
    <div className="relative mx-auto w-full max-w-6xl">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ControlsTile />
        <FormTile />
        <StatusTile />
        <SearchTile />
        <InstallTile />
        <CodeTile />
      </div>
    </div>
  );
}

function PackageCard({ entry }: { entry: (typeof PACKAGES)[number] }) {
  return (
    <a href={entry.href} className={cn("group block rounded-lg", focusRing)}>
      <Card className="h-full shadow-none transition-colors hover:border-primary/40">
        <Card.Header
          action={
            <Badge variant="secondary" className="font-mono">
              v{entry.version}
            </Badge>
          }
        >
          <div className="mb-1 flex size-9 items-center justify-center rounded-md border border-border bg-muted/30 text-muted-foreground">
            <entry.icon aria-hidden="true" className="size-4" />
          </div>
          <Card.Title>{entry.title}</Card.Title>
          <Card.Description className="font-mono text-xs">
            {entry.pkg}
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <p className="text-sm leading-6 text-muted-foreground">
            {entry.description}
          </p>
        </Card.Content>
      </Card>
    </a>
  );
}

export function HomePage() {
  return (
    <main className="flex flex-col">
      <section className="border-b border-border px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
          <a
            href="/components/input-color"
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
              focusRing,
            )}
          >
            Input Color is available
            <ArrowRight aria-hidden="true" className="size-3" />
          </a>
          <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Build typed React interfaces without rebuilding the basics.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Almach packages give teams shared controls, validation patterns and
            data helpers that fit the same theme contract.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/getting-started" size="lg">
              Start building
              <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Button>
            <Button href="/components" variant="outline" size="lg">
              Browse library
            </Button>
          </div>
        </div>

        <div className="mt-8 sm:mt-10">
          <ComponentShowcase />
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[18rem_1fr] lg:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-2xl font-semibold tracking-tight">
            Pick the layer you need.
          </h2>
          <p className={tileCopy}>
            The packages are separate. The naming, tokens and TypeScript style
            stay aligned.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {PACKAGES.map((entry) => (
            <PackageCard key={entry.pkg} entry={entry} />
          ))}
        </div>
      </section>

      <Separator />

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_20rem] lg:px-8">
        <div className="flex min-w-0 flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">
              Ship the same code shown in the docs.
            </h2>
            <p className={tileCopy}>
              Examples use public package exports, so the path from docs to app
              stays short.
            </p>
          </div>
          <CodeBlock
            filename="save-button.tsx"
            lang="tsx"
            code={`import { Button } from "@almach/ui";

export function SaveButton() {
  return <Button>Save changes</Button>;
}`}
          />
        </div>

        <Card className="shadow-none">
          <Card.Header>
            <Card.Title>Start here</Card.Title>
            <Card.Description>A short path through the docs.</Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-3">
            {[
              { href: "/getting-started", label: "Install packages" },
              { href: "/components", label: "Browse components" },
              { href: "/theme", label: "Adjust theme" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2 text-sm font-medium transition-colors hover:border-primary/40 hover:text-primary",
                  focusRing,
                )}
              >
                <span className="flex items-center gap-2">
                  <Check aria-hidden="true" className="size-3.5" />
                  {link.label}
                </span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 text-muted-foreground"
                />
              </a>
            ))}
          </Card.Content>
        </Card>
      </section>
    </main>
  );
}
