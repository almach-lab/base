import { Badge, Button, Card, Input, Separator, Switch } from "@almach/ui";
import {
  ArrowRight,
  Bell,
  CheckCircle,
  CreditCard,
  Settings,
  Shield,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function CardPage() {
  return (
    <ComponentDoc
      name="Card"
      description="Surface containers for grouping content. Card covers standard layouts; Card.Layers stacks bordered rows for settings panels; Group provides labelled form and navigation rows."
      pkg="@almach/ui"
      examples={[
        /* ── Card ───────────────────────────────────────────────── */
        {
          title: "Basic card",
          description: "Header, Content, and Footer slots.",
          preview: (
            <Card className="w-full max-w-xs">
              <Card.Header>
                <Card.Title>Pro plan</Card.Title>
                <Card.Description>
                  For individuals and small teams.
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <p className="text-3xl font-bold">
                  $12
                  <span className="text-sm font-normal text-muted-foreground">
                    /month
                  </span>
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {[
                    "Unlimited projects",
                    "Priority support",
                    "Advanced analytics",
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle
                        className="h-3.5 w-3.5 text-success shrink-0"
                        aria-hidden="true"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
              </Card.Content>
              <Card.Footer>
                <Button className="w-full">Get started</Button>
              </Card.Footer>
            </Card>
          ),
          code: `<Card className="w-full max-w-xs">
  <Card.Header>
    <Card.Title>Pro plan</Card.Title>
    <Card.Description>For individuals and small teams.</Card.Description>
  </Card.Header>
  <Card.Content>
    <p className="text-3xl font-bold">
      $12<span className="text-sm font-normal text-muted-foreground">/month</span>
    </p>
  </Card.Content>
  <Card.Footer>
    <Button className="w-full">Get started</Button>
  </Card.Footer>
</Card>`,
        },
        {
          title: "Header action",
          description: "Pass action to Card.Header for a right-side element.",
          preview: (
            <Card className="w-full max-w-sm">
              <Card.Header action={<Badge variant="secondary">3 new</Badge>}>
                <Card.Title>Notifications</Card.Title>
                <Card.Description>You have 3 unread messages.</Card.Description>
              </Card.Header>
              <Card.Content className="space-y-0">
                {[
                  { from: "Alice", msg: "Can you review PR #42?" },
                  { from: "Bob", msg: "Deployment succeeded" },
                  { from: "Carol", msg: "Meeting at 3pm today" },
                ].map(({ from, msg }, i, arr) => (
                  <React.Fragment key={from}>
                    <div className="py-3">
                      <p className="text-sm font-medium">{from}</p>
                      <p className="text-sm text-muted-foreground">{msg}</p>
                    </div>
                    {i < arr.length - 1 && <Separator />}
                  </React.Fragment>
                ))}
              </Card.Content>
              <Card.Footer className="justify-end">
                <Button variant="ghost" size="sm">
                  Mark all read
                </Button>
              </Card.Footer>
            </Card>
          ),
          code: `<Card>
  <Card.Header action={<Badge variant="secondary">3 new</Badge>}>
    <Card.Title>Notifications</Card.Title>
    <Card.Description>You have 3 unread messages.</Card.Description>
  </Card.Header>
  <Card.Content>…</Card.Content>
  <Card.Footer className="justify-end">
    <Button variant="ghost" size="sm">Mark all read</Button>
  </Card.Footer>
</Card>`,
          centered: false,
        },
        {
          title: "Stats grid",
          description: "Compact metric cards for dashboards.",
          preview: (
            <div className="grid w-full max-w-md grid-cols-2 gap-3">
              {[
                {
                  label: "Total revenue",
                  value: "$45,231",
                  change: "+20.1%",
                  Icon: CreditCard,
                },
                {
                  label: "Active users",
                  value: "2,350",
                  change: "+12.5%",
                  Icon: User,
                },
                {
                  label: "New signups",
                  value: "189",
                  change: "+4.3%",
                  Icon: Bell,
                },
                {
                  label: "Churn rate",
                  value: "1.2%",
                  change: "−0.4%",
                  Icon: TrendingUp,
                },
              ].map(({ label, value, change, Icon }) => (
                <Card key={label}>
                  <Card.Header
                    className="pb-1"
                    action={
                      <Icon
                        className="h-4 w-4 text-muted-foreground"
                        aria-hidden="true"
                      />
                    }
                  >
                    <Card.Description className="text-xs">
                      {label}
                    </Card.Description>
                    <Card.Title className="text-xl">{value}</Card.Title>
                  </Card.Header>
                  <Card.Content>
                    <p className="text-xs text-muted-foreground">
                      {change} from last month
                    </p>
                  </Card.Content>
                </Card>
              ))}
            </div>
          ),
          code: `<div className="grid grid-cols-2 gap-3">
  <Card>
    <Card.Header className="pb-1" action={<CreditCard className="h-4 w-4" />}>
      <Card.Description className="text-xs">Total revenue</Card.Description>
      <Card.Title className="text-xl">$45,231</Card.Title>
    </Card.Header>
    <Card.Content>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </Card.Content>
  </Card>
</div>`,
          centered: false,
        },
        /* ── Card.Layers ─────────────────────────────────────────── */
        {
          title: "Layered settings",
          description:
            "Card.Layers creates stacked sections divided by borders — ideal for settings panels.",
          preview: (
            <Card.Layers className="w-full max-w-xs">
              <Card.LayerHeader
                action={<Settings className="h-4 w-4" aria-hidden="true" />}
              >
                Notifications
              </Card.LayerHeader>
              <Card.LayerRow
                action={
                  <Switch
                    defaultChecked
                    size="sm"
                    aria-label="Enable push notifications"
                  />
                }
              >
                Push notifications
              </Card.LayerRow>
              <Card.LayerRow
                action={<Switch size="sm" aria-label="Enable email digest" />}
              >
                Email digest
              </Card.LayerRow>
              <Card.LayerRow
                action={
                  <Switch
                    defaultChecked
                    size="sm"
                    aria-label="Enable marketing emails"
                  />
                }
              >
                Marketing emails
              </Card.LayerRow>
            </Card.Layers>
          ),
          code: `<Card.Layers>
  <Card.LayerHeader action={<Settings className="h-4 w-4" />}>
    Notifications
  </Card.LayerHeader>
  <Card.LayerRow action={<Switch defaultChecked size="sm" />}>
    Push notifications
  </Card.LayerRow>
  <Card.LayerRow action={<Switch size="sm" />}>
    Email digest
  </Card.LayerRow>
</Card.Layers>`,
          centered: false,
        },
        {
          title: "Clickable rows",
          description:
            "Add onClick to rows for interactive navigation with hover feedback.",
          preview: (
            <Card.Layers className="w-full max-w-xs">
              <Card.LayerHeader>Resources</Card.LayerHeader>
              {[
                {
                  label: "Documentation",
                  icon: <Zap className="h-4 w-4 text-muted-foreground" />,
                },
                {
                  label: "Changelog",
                  icon: <Zap className="h-4 w-4 text-muted-foreground" />,
                },
                {
                  label: "Roadmap",
                  icon: <Zap className="h-4 w-4 text-muted-foreground" />,
                },
              ].map(({ label, icon }) => (
                <Card.LayerRow
                  key={label}
                  action={<ArrowRight className="h-4 w-4" />}
                  onClick={() => {}}
                >
                  <span className="flex items-center gap-2">
                    {icon}
                    {label}
                  </span>
                </Card.LayerRow>
              ))}
            </Card.Layers>
          ),
          code: `<Card.Layers>
  <Card.LayerHeader>Resources</Card.LayerHeader>
  <Card.LayerRow action={<ArrowRight />} onClick={() => {}}>
    <span className="flex items-center gap-2"><Zap />Documentation</span>
  </Card.LayerRow>
</Card.Layers>`,
          centered: false,
        },
        {
          title: "Row badges",
          description: "Actions can be any element — badges, buttons, icons.",
          preview: (
            <Card.Layers className="w-full max-w-xs">
              <Card.LayerHeader>Status</Card.LayerHeader>
              <Card.LayerRow action={<Badge variant="success">Stable</Badge>}>
                Core components
              </Card.LayerRow>
              <Card.LayerRow action={<Badge variant="warning">Beta</Badge>}>
                Table
              </Card.LayerRow>
              <Card.LayerRow
                action={<Badge variant="secondary">Planned</Badge>}
              >
                Charts
              </Card.LayerRow>
            </Card.Layers>
          ),
          code: `<Card.Layers>
  <Card.LayerHeader>Status</Card.LayerHeader>
  <Card.LayerRow action={<Badge variant="success">Stable</Badge>}>Core components</Card.LayerRow>
  <Card.LayerRow action={<Badge variant="warning">Beta</Badge>}>Table</Card.LayerRow>
  <Card.LayerRow action={<Badge variant="secondary">Planned</Badge>}>Charts</Card.LayerRow>
</Card.Layers>`,
          centered: false,
        },
        /* ── Group ───────────────────────────────────────────────── */
        {
          title: "Navigation list",
          description: "Group rows with children text and an action element.",
          preview: (
            <Card.Group className="w-full max-w-sm">
              <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>
                Get started
              </Card.GroupRow>
              <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>
                Documentation
              </Card.GroupRow>
              <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>
                Components
              </Card.GroupRow>
            </Card.Group>
          ),
          code: `<Card.Group>
  <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>Get started</Card.GroupRow>
  <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>Documentation</Card.GroupRow>
  <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>Components</Card.GroupRow>
</Card.Group>`,
        },
        {
          title: "Settings toggles",
          description:
            "Label and description on the left, control on the right.",
          preview: <SettingsGroup />,
          code: `<Card.Group label="Notifications">
  <Card.GroupRow
    label="Email alerts"
    description="Receive summaries and digests."
    action={<Switch defaultChecked />}
  />
  <Card.GroupRow
    label="Push notifications"
    description="Browser and mobile alerts."
    action={<Switch />}
  />
</Card.Group>`,
          centered: false,
        },
        {
          title: "Form fields",
          description:
            "Label on the left, input control on the right via children.",
          preview: (
            <Card.Group label="Account" className="w-full max-w-sm">
              <Card.GroupRow label="Display name" htmlFor="g-name">
                <Input
                  id="g-name"
                  defaultValue="Alice Johnson"
                  className="w-40"
                />
              </Card.GroupRow>
              <Card.GroupRow label="Email" htmlFor="g-email">
                <Input
                  id="g-email"
                  type="email"
                  defaultValue="alice@example.com"
                  className="w-40"
                />
              </Card.GroupRow>
            </Card.Group>
          ),
          code: `<Card.Group label="Account">
  <Card.GroupRow label="Display name" htmlFor="name">
    <Input id="name" defaultValue="Alice Johnson" className="w-40" />
  </Card.GroupRow>
  <Card.GroupRow label="Email" htmlFor="email">
    <Input id="email" type="email" className="w-40" />
  </Card.GroupRow>
</Card.Group>`,
          centered: false,
        },
        {
          title: "Group with hint",
          description:
            "label= adds a header above, hint= adds a footer note below.",
          preview: (
            <Card.Group
              label="Privacy"
              hint="These settings apply to your public profile."
              className="w-full max-w-sm"
            >
              <Card.GroupRow
                label="Public profile"
                description="Anyone can view your profile."
                action={<Switch defaultChecked />}
              />
              <Card.GroupRow label="Show email address" action={<Switch />} />
            </Card.Group>
          ),
          code: `<Card.Group label="Privacy" hint="These settings apply to your public profile.">
  <Card.GroupRow label="Public profile" description="Anyone can view." action={<Switch defaultChecked />} />
  <Card.GroupRow label="Show email address" action={<Switch />} />
</Card.Group>`,
          centered: false,
        },
        {
          title: "Mixed content",
          description: "Combining icons, badges, and clickable rows.",
          preview: (
            <Card.Group className="w-full max-w-sm">
              <Card.GroupRow action={<Badge variant="success">Active</Badge>}>
                <span className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  Security
                </span>
              </Card.GroupRow>
              <Card.GroupRow action={<Badge variant="destructive">2</Badge>}>
                <span className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  Alerts
                </span>
              </Card.GroupRow>
              <Card.GroupRow action={<ArrowRight className="h-4 w-4" />}>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Profile
                </span>
              </Card.GroupRow>
            </Card.Group>
          ),
          code: `<Card.Group>
  <Card.GroupRow action={<Badge variant="success">Active</Badge>}>
    <span className="flex items-center gap-2"><Shield />Security</span>
  </Card.GroupRow>
  <Card.GroupRow action={<Badge variant="destructive">2</Badge>}>
    <span className="flex items-center gap-2"><Bell />Alerts</span>
  </Card.GroupRow>
</Card.Group>`,
        },
      ]}
      props={[
        /* Card */
        {
          name: "Card.Header › action",
          type: "ReactNode",
          description: "Right-side slot — icon, badge, button, etc.",
        },
        {
          name: "Card.Title",
          type: "HTMLAttributes<HTMLHeadingElement>",
          description: "Rendered as <h3> with semibold weight.",
        },
        {
          name: "Card.Description",
          type: "HTMLAttributes<HTMLParagraphElement>",
          description: "Muted supporting text.",
        },
        {
          name: "Card.Content",
          type: "HTMLAttributes<HTMLDivElement>",
          description: "Main body with horizontal padding.",
        },
        {
          name: "Card.Footer",
          type: "HTMLAttributes<HTMLDivElement>",
          description: "Border-top footer section for action buttons.",
        },
        /* Card.Layers */
        {
          name: "Card.Layers",
          type: "HTMLAttributes<HTMLDivElement>",
          description:
            "Layered card root. Sections divided by borders (divide-y).",
        },
        {
          name: "Card.LayerHeader › action",
          type: "ReactNode",
          description: "Right-side element in the layer header.",
        },
        {
          name: "Card.LayerRow › action",
          type: "ReactNode",
          description: "Right-side element in the row.",
        },
        {
          name: "Card.LayerRow › onClick",
          type: "() => void",
          description: "Makes the row clickable with hover feedback.",
        },
        /* Group */
        {
          name: "Card.Group › label",
          type: "string",
          description: "Small-caps section title rendered above the group.",
        },
        {
          name: "Card.Group › hint",
          type: "string",
          description: "Helper text rendered below the group.",
        },
        {
          name: "Card.GroupRow › label",
          type: "string",
          description: "Primary label on the left side of the row.",
        },
        {
          name: "Card.GroupRow › description",
          type: "string",
          description: "Secondary text under the label.",
        },
        {
          name: "Card.GroupRow › htmlFor",
          type: "string",
          description: "Connects the label to a form control by id.",
        },
        {
          name: "Card.GroupRow › required",
          type: "boolean",
          description: "Adds a red asterisk to the label.",
        },
        {
          name: "Card.GroupRow › action",
          type: "ReactNode",
          description: "Right-side element: Switch, Badge, arrow icon, etc.",
        },
        {
          name: "Card.GroupRow › onClick",
          type: "() => void",
          description: "Makes the row clickable with hover feedback.",
        },
      ]}
    />
  );
}

function SettingsGroup() {
  const [email, setEmail] = React.useState(true);
  const [push, setPush] = React.useState(false);
  const [marketing, setMarketing] = React.useState(false);
  return (
    <Card.Group label="Notifications" className="w-full max-w-sm">
      <Card.GroupRow
        label="Email alerts"
        description="Receive summaries and digests."
        action={<Switch checked={email} onCheckedChange={setEmail} />}
      />
      <Card.GroupRow
        label="Push notifications"
        description="Browser and mobile alerts."
        action={<Switch checked={push} onCheckedChange={setPush} />}
      />
      <Card.GroupRow
        label="Marketing emails"
        description="Product updates and offers."
        action={<Switch checked={marketing} onCheckedChange={setMarketing} />}
      />
    </Card.Group>
  );
}
