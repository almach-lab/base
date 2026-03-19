import React from "react";
import { cn } from "@almach/utils";
import { CodeBlock } from "../components/code-block";
import { PkgTabs } from "../components/pkg-tabs";

interface StepProps {
  n: number;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}

function Step({ n, title, children, last }: StepProps) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-xs font-bold text-background"
          aria-hidden="true"
        >
          {n}
        </div>
        {!last && <div className="mt-2 w-px flex-1 bg-border" aria-hidden="true" />}
      </div>
      <div className={cn("flex-1 pb-10", last && "pb-0")}>
        <h2 className="mb-4 mt-0.5 text-lg font-semibold">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 flex gap-3 rounded-lg border bg-muted/40 p-4 text-sm" role="note">
      <span className="mt-0.5 shrink-0 text-muted-foreground" aria-hidden="true">ℹ</span>
      <div className="text-muted-foreground leading-relaxed">{children}</div>
    </div>
  );
}

export function GettingStartedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:px-8">
      <div className="mb-12 border-b pb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Introduction
        </p>
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">Getting Started</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Set up Based Code in minutes. Each package is independently installable and tree-shakable.
        </p>
      </div>

      <Step n={1} title="Install packages">
        <p className="mb-3 text-sm text-muted-foreground">
          Install only what you need — each package is independently versioned.
        </p>

        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">UI components (required)</p>
            <PkgTabs packages="@almach/ui" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Form handling — TanStack Form + Zod</p>
            <PkgTabs packages="@almach/forms" />
          </div>
          <div>
            <p className="mb-1.5 text-xs font-medium text-muted-foreground">Data fetching — TanStack Query</p>
            <PkgTabs packages="@almach/query" />
          </div>
        </div>
      </Step>

      <Step n={2} title="Add styles">
        <p className="mb-3 text-sm text-muted-foreground">
          Import Tailwind and the design tokens in your root CSS file. Then tell Tailwind where to
          scan for class names inside the component packages.
        </p>
        <CodeBlock
          filename="globals.css"
          lang="css"
          code={`@import "tailwindcss";

/* Tell Tailwind v4 to scan component source for class names.
 * Without this, classes inside @almach/ui are stripped from the build. */
@source "../node_modules/@almach/ui/dist/**/*.js";

@import "@almach/ui/styles";`}
        />
        <Callout>
          <strong>Why <code className="font-mono text-xs">@source</code>?</strong>
          {" "}Tailwind CSS v4 auto-scans your app directory only. Component classes live
          in a separate package and get stripped without explicit scanning.
          <br /><br />
          In a <strong>monorepo</strong> with local workspaces, point at the source directly:
          <br />
          <code className="font-mono text-xs">@source "../../packages/ui/src/**/*.&#123;ts,tsx&#125;";</code>
        </Callout>
      </Step>

      <Step n={3} title="Customize colors (optional)">
        <p className="mb-3 text-sm text-muted-foreground">
          Override any CSS variable to apply your brand. All components respond automatically — no config files.
        </p>
        <CodeBlock
          filename="globals.css"
          lang="css"
          code={`@import "tailwindcss";
@import "@almach/ui/styles";

/* ── Brand overrides ───────────────────────────────── */
:root {
  --primary:    221.2 83.2% 53.3%;   /* brand blue */
  --ring:       221.2 83.2% 53.3%;   /* focus rings */
  --radius:     0.5rem;               /* border radius */

  /* Switch track colors (full hsl() values) */
  --switch-on:  hsl(221.2 83.2% 53.3%);
  --switch-off: hsl(220 8.9% 46.1% / 0.35);
}

/* ── Dark mode overrides ───────────────────────────── */
.dark {
  --primary:    213.3 93.9% 67.8%;
  --ring:       213.3 93.9% 67.8%;
  --switch-on:  hsl(213.3 93.9% 67.8%);
}`}
        />

        <div className="mt-4 rounded-lg border p-4">
          <p className="mb-3 text-sm font-semibold">Available tokens</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-muted-foreground font-mono">
            {[
              ["--background", "--foreground"],
              ["--card", "--card-foreground"],
              ["--popover", "--popover-foreground"],
              ["--primary", "--primary-foreground"],
              ["--secondary", "--secondary-foreground"],
              ["--muted", "--muted-foreground"],
              ["--accent", "--accent-foreground"],
              ["--destructive", "--destructive-foreground"],
              ["--success", "--success-foreground"],
              ["--warning", "--warning-foreground"],
              ["--border", "--input"],
              ["--ring", "--radius"],
              ["--switch-on", "--switch-off"],
            ].map(([a, b]) => (
              <React.Fragment key={a}>
                <span>{a}</span>
                <span>{b}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </Step>

      <Step n={4} title="Wrap with providers">
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
        <Callout>
          <code className="font-mono text-xs">BasedQueryProvider</code> wraps TanStack QueryClient.
          Skip it if you're not using <code className="font-mono text-xs">@almach/query</code>.
        </Callout>
      </Step>

      <Step n={5} title="Use components">
        <CodeBlock
          filename="my-component.tsx"
          lang="tsx"
          code={`import { Button, Card, Input, Select, Switch } from "@almach/ui";

// Date input with calendar picker (Input.Date)
<Input.Date withCalendar value={date} onChange={setDate} />

// Card with layered sections (settings-panel style)
<Card.Layers>
  <Card.LayerHeader>Preferences</Card.LayerHeader>
  <Card.LayerRow action={<Switch defaultChecked size="sm" />}>
    Dark mode
  </Card.LayerRow>
</Card.Layers>

// Searchable select — replaces standalone Combobox
<Select.Searchable
  options={[{ value: "react", label: "React" }]}
  value={value}
  onChange={setValue}
  placeholder="Pick a framework…"
/>`}
        />
      </Step>

      <Step n={6} title="Handle forms">
        <p className="mb-3 text-sm text-muted-foreground">
          Use <code className="font-mono text-xs">useBasedForm</code> with Zod schemas for type-safe validated forms.
        </p>
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
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} className="space-y-4">
      <form.AppField name="email">
        {() => <TextField label="Email" type="email" required />}
      </form.AppField>
      <form.AppField name="password">
        {() => <TextField label="Password" type="password" required />}
      </form.AppField>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(submitting) => (
          <Button type="submit" loading={submitting} className="w-full">Sign in</Button>
        )}
      </form.Subscribe>
    </form>
  );
}`}
        />
      </Step>

      <Step n={7} title="Fetch data" last>
        <p className="mb-3 text-sm text-muted-foreground">
          Define queries once, use them anywhere with full type inference.
        </p>
        <CodeBlock
          filename="users.tsx"
          lang="tsx"
          code={`import { createQuery, createMutation, useQuery } from "@almach/query";
import { Button, Skeleton } from "@almach/ui";

const usersQuery = createQuery({
  queryKey: () => ["users"],
  queryFn:  () => fetch("/api/users").then((r) => r.json()),
  staleTime: 5 * 60 * 1000,
});

const useDeleteUser = createMutation({
  mutationFn: (id: string) => fetch(\`/api/users/\${id}\`, { method: "DELETE" }),
  invalidates: [["users"]], // auto-invalidates on success
});

function UserList() {
  const { data, isLoading } = useQuery(usersQuery.options());
  const deleteUser = useDeleteUser();

  if (isLoading) return <Skeleton className="h-32" />;

  return data?.map((user) => (
    <div key={user.id} className="flex items-center justify-between">
      <span>{user.name}</span>
      <Button
        variant="destructive"
        size="sm"
        loading={deleteUser.isPending}
        onClick={() => deleteUser.mutate(user.id)}
      >
        Delete
      </Button>
    </div>
  ));
}`}
        />

        <div className="mt-8 rounded-lg border p-5 text-sm">
          <p className="font-semibold">What's next?</p>
          <p className="mt-1 text-muted-foreground">
            Explore{" "}
            <a href="/components" className="font-medium underline underline-offset-4 hover:text-foreground">Components</a>
            ,{" "}
            <a href="/forms" className="font-medium underline underline-offset-4 hover:text-foreground">Forms</a>
            , and{" "}
            <a href="/query" className="font-medium underline underline-offset-4 hover:text-foreground">Query</a>
            {" "}for live interactive examples.
          </p>
        </div>
      </Step>
    </div>
  );
}
