import React from "react";
import {
  TextField,
  TextareaField,
  SelectField,
  CheckboxField,
  SwitchField,
  useBasedForm,
  z,
} from "@almach/forms";
import { Badge, Button, Card, Separator, Tabs } from "@almach/ui";
import { useToast } from "@almach/ui";
import { CodeBlock } from "../code-block";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  rememberMe: z.boolean(),
});

function LoginForm() {
  const { toast: showToast } = useToast();
  const form = useBasedForm({
    defaultValues: { email: "", password: "", rememberMe: false },
    validators: { onChange: loginSchema },
    onSubmit: async ({ value }) => {
      await new Promise((r) => setTimeout(r, 800));
      showToast({
        title: "Signed in!",
        description: `Welcome back, ${value.email}`,
        variant: "success",
      });
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="space-y-4"
    >
      <form.AppField name="email">
        {() => <TextField label="Email" type="email" placeholder="john@example.com" required />}
      </form.AppField>
      <form.AppField name="password">
        {() => <TextField label="Password" type="password" placeholder="••••••••" required />}
      </form.AppField>
      <form.AppField name="rememberMe">
        {() => <CheckboxField label="Remember me for 30 days" />}
      </form.AppField>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Sign in
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

const registerSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  role: z.enum(["developer", "designer", "manager", "other"], {
    required_error: "Please select a role",
  }),
  bio: z.string().max(200, "Bio must be under 200 characters"),
  notifications: z.boolean(),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms" }),
  }),
});

function RegisterForm() {
  const { toast: showToast } = useToast();
  const form = useBasedForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: undefined as unknown as "developer" | "designer" | "manager" | "other",
      bio: "",
      notifications: true,
      terms: undefined as unknown as true,
    },
    validators: { onChange: registerSchema },
    onSubmit: async () => {
      await new Promise((r) => setTimeout(r, 1000));
      showToast({ title: "Account created!", description: "Welcome to Almach.", variant: "success" });
      form.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <form.AppField name="firstName">
          {() => <TextField label="First name" placeholder="John" required />}
        </form.AppField>
        <form.AppField name="lastName">
          {() => <TextField label="Last name" placeholder="Doe" required />}
        </form.AppField>
      </div>
      <form.AppField name="email">
        {() => <TextField label="Email" type="email" placeholder="john@example.com" required />}
      </form.AppField>
      <form.AppField name="role">
        {() => (
          <SelectField
            label="Role"
            placeholder="Select your role"
            required
            options={[
              { label: "Developer", value: "developer" },
              { label: "Designer", value: "designer" },
              { label: "Manager", value: "manager" },
              { label: "Other", value: "other" },
            ]}
          />
        )}
      </form.AppField>
      <form.AppField name="bio">
        {() => (
          <TextareaField
            label="Bio"
            placeholder="Tell us a bit about yourself…"
            description="Optional. Max 200 characters."
          />
        )}
      </form.AppField>
      <form.AppField name="notifications">
        {() => (
          <SwitchField
            label="Email notifications"
            description="Receive updates about your account."
          />
        )}
      </form.AppField>
      <form.AppField name="terms">
        {() => (
          <CheckboxField
            label="I agree to the Terms of Service and Privacy Policy"
            required
          />
        )}
      </form.AppField>
      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" className="w-full" loading={isSubmitting}>
            Create account
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}

const installCode = `npm install @almach/forms`;

const setupCode = `// 1. Define your schema with Zod
import { z } from "@almach/forms";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "At least 8 characters"),
});

// 2. Create the form with useBasedForm
import { useBasedForm, TextField } from "@almach/forms";
import { Button } from "@almach/ui";

function LoginForm() {
  const form = useBasedForm({
    defaultValues: { email: "", password: "" },
    validators: { onChange: schema },
    onSubmit: async ({ value }) => {
      await signIn(value);
    },
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
      <form.AppField name="email">
        {() => <TextField label="Email" type="email" required />}
      </form.AppField>

      <form.AppField name="password">
        {() => <TextField label="Password" type="password" required />}
      </form.AppField>

      <form.Subscribe selector={(s) => s.isSubmitting}>
        {(isSubmitting) => (
          <Button type="submit" loading={isSubmitting}>Sign in</Button>
        )}
      </form.Subscribe>
    </form>
  );
}`;

const fieldsCode = `import { TextField, TextareaField, SelectField, CheckboxField, SwitchField } from "@almach/forms";

// Text input
<form.AppField name="email">
  {() => <TextField label="Email" type="email" required />}
</form.AppField>

// Textarea
<form.AppField name="bio">
  {() => <TextareaField label="Bio" description="Max 200 characters." />}
</form.AppField>

// Select
<form.AppField name="role">
  {() => (
    <SelectField
      label="Role"
      placeholder="Select role"
      options={[
        { label: "Developer", value: "developer" },
        { label: "Designer", value: "designer" },
      ]}
    />
  )}
</form.AppField>

// Checkbox
<form.AppField name="terms">
  {() => <CheckboxField label="I agree to the terms" required />}
</form.AppField>

// Switch
<form.AppField name="notifications">
  {() => <SwitchField label="Email notifications" />}
</form.AppField>`;

export function FormsPage() {
  return (
    <div className="px-4 py-10 md:px-8">
      <div className="mb-10 border-b pb-8">
        <Badge variant="outline" className="mb-2 font-mono">@almach/forms</Badge>
        <h1 className="mb-3 text-3xl font-bold tracking-tight sm:text-4xl">Form Handling</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Type-safe forms powered by TanStack Form and Zod. Inline validation,
          field-level and schema-level errors, accessible by default.
        </p>
      </div>

      {/* Interactive demos */}
      <div className="grid gap-6 md:grid-cols-2 mb-12">
        <Card>
          <Card.Header>
            <Card.Title className="text-base">Login form</Card.Title>
            <p className="text-sm text-muted-foreground">
              Submit without filling fields to see validation.
            </p>
          </Card.Header>
          <Card.Content>
            <LoginForm />
          </Card.Content>
        </Card>

        <Card>
          <Card.Header>
            <Card.Title className="text-base">Registration form</Card.Title>
            <p className="text-sm text-muted-foreground">
              All field types: text, select, textarea, switch, checkbox.
            </p>
          </Card.Header>
          <Card.Content>
            <RegisterForm />
          </Card.Content>
        </Card>
      </div>

      <Separator className="mb-10" />

      {/* Documentation */}
      <div className="space-y-8">
        <div>
          <h2 className="mb-1 text-lg font-semibold">Installation</h2>
          <p className="mb-3 text-sm text-muted-foreground">Install the forms package independently.</p>
          <CodeBlock filename="Terminal" code={installCode} />
        </div>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Quick start</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            Define a Zod schema, call <code className="font-mono text-xs">useBasedForm</code>, and render fields inside <code className="font-mono text-xs">form.AppField</code>.
          </p>
          <Tabs defaultValue="code">
            <Tabs.List>
              <Tabs.Trigger value="code">Code</Tabs.Trigger>
              <Tabs.Trigger value="how">How it works</Tabs.Trigger>
            </Tabs.List>
            <Tabs.Content value="code">
              <CodeBlock code={setupCode} className="mt-2" />
            </Tabs.Content>
            <Tabs.Content value="how">
              <div className="mt-2 rounded-xl border p-5 space-y-3 text-sm font-mono text-muted-foreground">
                <p><span className="text-foreground">useBasedForm</span>{"({ defaultValues, validators, onSubmit })"}</p>
                <p className="pl-4 text-xs">↳ wraps TanStack Form with Zod Standard Schema support</p>
                <p><span className="text-foreground">form.AppField</span>{" name=\"fieldName\""}</p>
                <p className="pl-4 text-xs">↳ injects field context via createFormHookContexts</p>
                <p><span className="text-foreground">TextField</span>{" / SelectField / ..."}</p>
                <p className="pl-4 text-xs">↳ reads field context · renders label, input, error</p>
                <p className="pl-4 text-xs">↳ aria-invalid + aria-describedby for accessibility</p>
              </div>
            </Tabs.Content>
          </Tabs>
        </div>

        <div>
          <h2 className="mb-1 text-lg font-semibold">Field components</h2>
          <p className="mb-3 text-sm text-muted-foreground">
            All field components read from field context automatically — no <code className="font-mono text-xs">name</code> or <code className="font-mono text-xs">register</code> needed.
          </p>
          <CodeBlock code={fieldsCode} />
        </div>

        <div className="rounded-xl border p-5">
          <h3 className="mb-3 font-semibold text-sm">API reference</h3>
          <div className="grid gap-4 sm:grid-cols-2 text-sm">
            {[
              { prop: "defaultValues", type: "object", desc: "Initial field values." },
              { prop: "validators.onChange", type: "ZodSchema", desc: "Validates on each change." },
              { prop: "validators.onBlur", type: "ZodSchema", desc: "Validates on field blur." },
              { prop: "validators.onSubmit", type: "ZodSchema", desc: "Validates on form submit." },
              { prop: "onSubmit", type: "(value) => Promise", desc: "Called when form is valid." },
              { prop: "form.AppField", type: "component", desc: "Wraps a field with context." },
              { prop: "form.Subscribe", type: "component", desc: "Subscribes to form state." },
              { prop: "form.reset()", type: "fn", desc: "Resets all fields to defaults." },
            ].map(({ prop, type, desc }) => (
              <div key={prop} className="space-y-0.5">
                <p className="font-mono text-xs font-medium text-foreground">{prop}</p>
                <p className="font-mono text-[11px] text-muted-foreground/70">{type}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
