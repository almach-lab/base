import * as React from "react";
import { Badge, Button, Card, Separator, Switch } from "@almach/ui";
import { Bell, CheckCircle, CreditCard, Settings, TrendingUp, User } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function CardPage() {
	return (
		<ComponentDoc
			name="Card"
			description="A surface container for grouping related content. Includes Header, Content, Footer, and Layers sub-components for structured layouts."
			pkg="@almach/ui"
			examples={[
				{
					title: "Basic card",
					description: "Header, Content, and Footer slots.",
					preview: (
						<Card className="w-full max-w-xs">
							<Card.Header>
								<Card.Title>Pro plan</Card.Title>
								<Card.Description>For individuals and small teams.</Card.Description>
							</Card.Header>
							<Card.Content>
								<p className="text-3xl font-bold">
									$12
									<span className="text-sm font-normal text-muted-foreground">/month</span>
								</p>
								<ul className="mt-4 space-y-2 text-sm text-muted-foreground">
									{["Unlimited projects", "Priority support", "Advanced analytics"].map((f) => (
										<li key={f} className="flex items-center gap-2">
											<CheckCircle className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
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
					title: "Layered card",
					description: "Card.Layers creates stacked sections divided by borders — ideal for settings panels, profiles, and list UIs.",
					preview: (
						<Card.Layers className="w-full max-w-xs">
							<Card.LayerHeader action={<Settings className="h-4 w-4" aria-hidden="true" />}>
								Notifications
							</Card.LayerHeader>
							<Card.LayerRow action={<Switch defaultChecked size="sm" aria-label="Enable push notifications" />}>
								Push notifications
							</Card.LayerRow>
							<Card.LayerRow action={<Switch size="sm" aria-label="Enable email digest" />}>
								Email digest
							</Card.LayerRow>
							<Card.LayerRow action={<Switch defaultChecked size="sm" aria-label="Enable marketing emails" />}>
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
  <Card.LayerRow action={<Switch defaultChecked size="sm" />}>
    Marketing emails
  </Card.LayerRow>
</Card.Layers>`,
					centered: false,
				},
				{
					title: "With header action",
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
								<Button variant="ghost" size="sm">Mark all read</Button>
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
								{ label: "Total revenue", value: "$45,231", change: "+20.1%", Icon: CreditCard },
								{ label: "Active users", value: "2,350", change: "+12.5%", Icon: User },
								{ label: "New signups", value: "189", change: "+4.3%", Icon: Bell },
								{ label: "Churn rate", value: "1.2%", change: "−0.4%", Icon: TrendingUp },
							].map(({ label, value, change, Icon }) => (
								<Card key={label}>
									<Card.Header className="pb-1" action={<Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />}>
										<Card.Description className="text-xs">{label}</Card.Description>
										<Card.Title className="text-xl">{value}</Card.Title>
									</Card.Header>
									<Card.Content>
										<p className="text-xs text-muted-foreground">{change} from last month</p>
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
			]}
			props={[
				{
					name: "Card.Header action",
					type: "React.ReactNode",
					description: "Right-side slot — icon, badge, button, etc.",
				},
				{
					name: "Card.Title",
					type: "React.HTMLAttributes<HTMLHeadingElement>",
					description: "Rendered as <h3> with semibold weight.",
				},
				{
					name: "Card.Description",
					type: "React.HTMLAttributes<HTMLParagraphElement>",
					description: "Muted supporting text.",
				},
				{
					name: "Card.Content",
					type: "React.HTMLAttributes<HTMLDivElement>",
					description: "Main body with horizontal padding.",
				},
				{
					name: "Card.Footer",
					type: "React.HTMLAttributes<HTMLDivElement>",
					description: "Border-top footer section for action buttons.",
				},
				{
					name: "Card.Layers",
					type: "React.HTMLAttributes<HTMLDivElement>",
					description: "Layered card root. Sections are divided by borders (divide-y).",
				},
				{
					name: "Card.LayerHeader action",
					type: "React.ReactNode",
					description: "Right-side slot inside a layer header.",
				},
				{
					name: "Card.LayerRow action",
					type: "React.ReactNode",
					description: "Right-side slot inside a layer row. Pass onClick for hover effect.",
				},
			]}
		/>
	);
}
