import { Alert, Badge } from "@almach/ui";
import { ArrowRight, Copy, Info } from "lucide-react";
import React from "react";
import { CodeBlock } from "../code-block";
import { PkgTabs } from "../pkg-tabs";

/* ── Small reusable layout pieces ─────────────────────────────────────────── */

function Note({ children }: { children: React.ReactNode }) {
  return (
    <Alert variant="default" className="text-sm">
      <Alert.Icon>
        <Info />
      </Alert.Icon>
      <Alert.Body>
        <Alert.Description className="leading-relaxed">
          {children}
        </Alert.Description>
      </Alert.Body>
    </Alert>
  );
}

function TokenGrid({ tokens }: { tokens: string[] }) {
  return (
    <div className="rounded-lg border bg-muted/20 p-4">
      <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        Available tokens
      </p>
      <div className="flex flex-wrap gap-1.5">
        {tokens.map((t) => (
          <code
            key={t}
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground"
          >
            {t}
          </code>
        ))}
      </div>
    </div>
  );
}

function PackageSection({
  label,
  pkg,
  required,
}: {
  label: string;
  pkg: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-sm font-medium">
        {label}
        {required && (
          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            required
          </span>
        )}
      </p>
      <PkgTabs packages={pkg} />
    </div>
  );
}

interface StepProps {
  id?: string;
  n: number;
  title: string;
  description?: string;
  last?: boolean;
  children?: React.ReactNode;
}

function Step({
  id,
  n,
  title,
  description,
  last = false,
  children,
}: StepProps) {
  return (
    <div id={id} className="relative flex scroll-mt-20 gap-5">
      {/* Connector line */}
      {!last && (
        <div className="absolute left-[17px] top-9 bottom-0 w-px bg-border" />
      )}

      {/* Step number */}
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {n}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1 pb-12 pt-1.5">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        {description && (
          <p className="mb-4 mt-1 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {children && (
          <div className="space-y-4">
            {!description && <div className="mt-4" />}
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────────────────────── */

const CSS_TOKENS = [
  "--background",
  "--foreground",
  "--card",
  "--popover",
  "--primary",
  "--secondary",
  "--muted",
  "--accent",
  "--destructive",
  "--success",
  "--warning",
  "--border",
  "--input",
  "--ring",
  "--radius",
  "--switch-on",
  "--switch-off",
];

export function GettingStartedPage() {
  const [copied, setCopied] = React.useState(false);

  const copyMarkdown = React.useCallback(async () => {
    const text = `# Getting Started

1. Install packages
2. Add styles
3. Customize colors
4. Wrap with providers
5. Use components
6. Handle forms`;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:px-5 md:py-9">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-9 border-b pb-7">
        <div className="mb-4 flex items-center justify-between gap-3">
          <Badge>Quick start</Badge>
          <button
            onClick={copyMarkdown}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            {copied ? "Copied" : "Copy Markdown"}
          </button>
        </div>
        <h1 className="mb-2.5 text-3xl font-semibold tracking-tight md:text-[2.2rem]">
          Getting Started
        </h1>
        <p className="mb-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Set up Almach in minutes. Each package is independently installable,
          so you can keep your bundle focused.
        </p>
        <div className="flex flex-wrap gap-2">
          {["React 18+", "TypeScript", "Tailwind CSS v4", "Vite / Next.js"].map(
            (req) => (
              <Badge key={req} variant="ghost">
                {req}
              </Badge>
            ),
          )}
        </div>
      </div>

      {/* ── Steps ──────────────────────────────────────────────────────────── */}
      <div>
        {/* Step 1 */}
        <Step
          id="step-install"
          n={1}
          title="Install packages"
          description="Install only what you need. Every package is independently versioned and zero-dependency from each other."
        >
          <PackageSection label="UI components" pkg="@almach/ui" required />
          <PackageSection
            label="Form handling — TanStack Form + Zod"
            pkg="@almach/forms"
          />
          <PackageSection
            label="Data fetching — TanStack Query"
            pkg="@almach/query"
          />
        </Step>

        {/* Step 2 */}
        <Step
          id="step-styles"
          n={2}
          title="Add styles"
          description="Import Tailwind and the Almach design tokens in your root CSS file. Then tell Tailwind where to scan for class names inside the packages."
        >
          <CodeBlock
            filename="globals.css"
            lang="css"
            code={`@import "tailwindcss";

/* Monorepo source scan (local dev) */
@source "../../../../packages/ui/src/**/*.{ts,tsx}";

/* Package scan (installed/build output) */
@source "../node_modules/@almach/ui/dist/**/*.js";

@import "@almach/ui/styles";`}
          />
          <Note>
            <strong className="text-foreground">Monorepo?</strong> Point{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
              @source
            </code>{" "}
            at both workspace source and dist so local dev and packaged builds
            both work:{" "}
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
              @source "../../../../packages/ui/src/**/*.{"{ts,tsx}"}";
            </code>
          </Note>
        </Step>

        {/* Step 3 */}
        <Step
          id="step-colors"
          n={3}
          title="Customize colors"
          description="Override any CSS variable to apply your brand. Every component responds automatically — no config files, no build steps."
        >
          <CodeBlock
            filename="globals.css"
            lang="css"
            code={`:root {
  --primary:    43 90% 44%;           /* golden — Almach theme */
  --ring:       43 90% 44%;           /* focus rings           */
  --radius:     0.625rem;             /* border radius         */

  --switch-on:  hsl(43 90% 44%);
  --switch-off: hsl(240 3.8% 46.1% / 0.35);
}

.dark {
  --primary:    43 92% 58%;
  --ring:       43 92% 58%;
  --switch-on:  hsl(43 92% 58%);
}`}
          />
          <TokenGrid tokens={CSS_TOKENS} />
        </Step>

        {/* Step 4 */}
        <Step
          id="step-providers"
          n={4}
          title="Wrap with providers"
          description="Add BasedQueryProvider and Toaster at your app root. Skip if you're not using @almach/query."
        >
          <CodeBlock
            filename="main.tsx"
            lang="tsx"
            code={`import { BasedQueryProvider } from "@almach/query";
import { Toaster } from "@almach/ui";

ReactDOM.createRoot(root).render(
  <BasedQueryProvider>
    <App />
    <Toaster />
  </BasedQueryProvider>
);`}
          />
          <Note>
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs text-foreground">
              BasedQueryProvider
            </code>{" "}
            wraps TanStack QueryClient with sensible defaults. Skip it if you
            manage your own QueryClient.
          </Note>
        </Step>

        {/* Step 5 */}
        <Step
          id="step-components"
          n={5}
          title="Use components"
          description="Import and compose components directly. Compound APIs keep related parts together."
        >
          <CodeBlock
            filename="my-component.tsx"
            lang="tsx"
            code={`import { Button, Card, Input, Select, Switch } from "@almach/ui";

// Date input with built-in calendar picker
<Input.Date withCalendar value={date} onChange={setDate} />

// Settings-panel style layered card
<Card.Layers>
  <Card.LayerHeader>Preferences</Card.LayerHeader>
  <Card.LayerRow action={<Switch defaultChecked size="sm" />}>
    Dark mode
  </Card.LayerRow>
</Card.Layers>

// Searchable select
<Select.Searchable
  options={[{ value: "react", label: "React" }]}
  value={value}
  onChange={setValue}
  placeholder="Pick a framework…"
/>`}
          />
        </Step>

        {/* Step 6 */}
        <Step
          id="step-forms"
          n={6}
          title="Handle forms"
          description="useBasedForm gives you TanStack Form with Zod validation, type-safe field names, and automatic error display."
          last
        >
          <CodeBlock
            filename="login-form.tsx"
            lang="tsx"
            code={`import { useBasedForm, TextField, z } from "@almach/forms";
import { Button } from "@almach/ui";

const schema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
});

export function LoginForm() {
  const form = useBasedForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => console.log(value),
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="space-y-4"
    >
      <form.AppField name="email">
        {() => <TextField label="Email" type="email" required />}
      </form.AppField>
      <form.AppField name="password">
        {() => <TextField label="Password" type="password" required />}
      </form.AppField>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(submitting) => (
          <Button type="submit" loading={submitting} className="w-full">
            Sign in
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}`}
          />
        </Step>
      </div>

      {/* ── What's next ────────────────────────────────────────────────────── */}
      <div className="border-t pt-10">
        <h2 className="mb-5 text-xl font-bold tracking-tight">What's next?</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            {
              href: "/components",
              label: "Components",
              desc: "Browse 30+ interactive component demos",
            },
            {
              href: "/forms",
              label: "Forms",
              desc: "Type-safe form patterns with Zod",
            },
            {
              href: "/query",
              label: "Query",
              desc: "Data fetching and mutation helpers",
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              aria-label={`${link.label} — ${link.desc}`}
              className="group flex flex-col gap-1.5 rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-primary/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-1.5 text-sm font-semibold">
                {link.label}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
              <span className="text-xs leading-relaxed text-muted-foreground">
                {link.desc}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
