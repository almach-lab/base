import * as React from "react";
import { Tabs } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function TabsPage() {
	return (
		<ComponentDoc
			name="Tabs"
			description="Tab navigation with three visual variants: pill, underline, and minimal."
			examples={[
				{
					title: "Pill",
					description:
						"Rounded pill tabs on a muted background — the default style, ideal for in-page navigation.",
					preview: (
						<div className="w-full max-w-md">
							<Tabs defaultValue="overview">
								<Tabs.List variant="pill">
									<Tabs.Trigger value="overview">Overview</Tabs.Trigger>
									<Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
									<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="overview">
									<div className="rounded-lg border p-4 text-sm text-muted-foreground">
										Project overview and summary metrics.
									</div>
								</Tabs.Content>
								<Tabs.Content value="analytics">
									<div className="rounded-lg border p-4 text-sm text-muted-foreground">
										Detailed analytics and usage reports.
									</div>
								</Tabs.Content>
								<Tabs.Content value="settings">
									<div className="rounded-lg border p-4 text-sm text-muted-foreground">
										Project configuration and preferences.
									</div>
								</Tabs.Content>
							</Tabs>
						</div>
					),
					code: `<Tabs defaultValue="overview">
  <Tabs.List variant="pill">
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="analytics">Analytics</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">Overview content</Tabs.Content>
  <Tabs.Content value="analytics">Analytics content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs>`,
					centered: false,
				},
				{
					title: "Underline",
					description:
						"Flat underline indicator — suits page-level or horizontal navigation.",
					preview: (
						<div className="w-full max-w-md">
							<Tabs defaultValue="docs">
								<Tabs.List variant="underline">
									<Tabs.Trigger value="docs">Documentation</Tabs.Trigger>
									<Tabs.Trigger value="api">API Reference</Tabs.Trigger>
									<Tabs.Trigger value="examples">Examples</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="docs">
									<div className="py-3 text-sm text-muted-foreground">
										Getting started guides and tutorials.
									</div>
								</Tabs.Content>
								<Tabs.Content value="api">
									<div className="py-3 text-sm text-muted-foreground">
										Complete API reference documentation.
									</div>
								</Tabs.Content>
								<Tabs.Content value="examples">
									<div className="py-3 text-sm text-muted-foreground">
										Example implementations and code recipes.
									</div>
								</Tabs.Content>
							</Tabs>
						</div>
					),
					code: `<Tabs defaultValue="docs">
  <Tabs.List variant="underline">
    <Tabs.Trigger value="docs">Documentation</Tabs.Trigger>
    <Tabs.Trigger value="api">API Reference</Tabs.Trigger>
    <Tabs.Trigger value="examples">Examples</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="docs">Documentation content</Tabs.Content>
  <Tabs.Content value="api">API content</Tabs.Content>
  <Tabs.Content value="examples">Examples content</Tabs.Content>
</Tabs>`,
					centered: false,
				},
				{
					title: "Minimal",
					description:
						"No background or border — for subtle contextual switching.",
					preview: (
						<div className="w-full max-w-md">
							<Tabs defaultValue="all">
								<Tabs.List variant="minimal">
									<Tabs.Trigger value="all">All</Tabs.Trigger>
									<Tabs.Trigger value="active">Active</Tabs.Trigger>
									<Tabs.Trigger value="archived">Archived</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="all">
									<div className="py-3 text-sm text-muted-foreground">
										Showing all 24 items.
									</div>
								</Tabs.Content>
								<Tabs.Content value="active">
									<div className="py-3 text-sm text-muted-foreground">
										Showing 18 active items.
									</div>
								</Tabs.Content>
								<Tabs.Content value="archived">
									<div className="py-3 text-sm text-muted-foreground">
										Showing 6 archived items.
									</div>
								</Tabs.Content>
							</Tabs>
						</div>
					),
					code: `<Tabs defaultValue="all">
  <Tabs.List variant="minimal">
    <Tabs.Trigger value="all">All</Tabs.Trigger>
    <Tabs.Trigger value="active">Active</Tabs.Trigger>
    <Tabs.Trigger value="archived">Archived</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="all">Showing all 24 items.</Tabs.Content>
  <Tabs.Content value="active">Showing 18 active items.</Tabs.Content>
  <Tabs.Content value="archived">Showing 6 archived items.</Tabs.Content>
</Tabs>`,
					centered: false,
				},
				{
					title: "Disabled tab",
					description: "Individual triggers can be disabled.",
					preview: (
						<div className="w-full max-w-md">
							<Tabs defaultValue="active">
								<Tabs.List variant="pill">
									<Tabs.Trigger value="active">Active</Tabs.Trigger>
									<Tabs.Trigger value="billing">Billing</Tabs.Trigger>
									<Tabs.Trigger value="enterprise" disabled>
										Enterprise
									</Tabs.Trigger>
								</Tabs.List>
								<Tabs.Content value="active">
									<div className="rounded-lg border p-4 text-sm text-muted-foreground">
										Active plan content.
									</div>
								</Tabs.Content>
								<Tabs.Content value="billing">
									<div className="rounded-lg border p-4 text-sm text-muted-foreground">
										Billing information.
									</div>
								</Tabs.Content>
							</Tabs>
						</div>
					),
					code: `<Tabs.List variant="pill">
  <Tabs.Trigger value="active">Active</Tabs.Trigger>
  <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
  <Tabs.Trigger value="enterprise" disabled>Enterprise</Tabs.Trigger>
</Tabs.List>`,
					centered: false,
				},
			]}
			props={[
				{
					name: "defaultValue",
					type: "string",
					description: "The tab active by default (uncontrolled).",
				},
				{
					name: "value",
					type: "string",
					description: "Controlled active tab value.",
				},
				{
					name: "onValueChange",
					type: "(value: string) => void",
					description: "Callback fired when the active tab changes.",
				},
				{
					name: "Tabs.List variant",
					type: '"pill" | "underline" | "minimal"',
					default: '"pill"',
					description: "Visual style of the tab list.",
				},
				{
					name: "Tabs.Trigger value",
					type: "string",
					required: true,
					description: "Unique identifier matching its Tabs.Content counterpart.",
				},
				{
					name: "Tabs.Trigger disabled",
					type: "boolean",
					default: "false",
					description: "Prevents selecting this tab. Renders at 50% opacity.",
				},
			]}
		/>
	);
}
