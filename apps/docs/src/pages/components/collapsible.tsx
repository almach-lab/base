import * as React from "react";
import { Collapsible, Separator } from "@almach/ui";
import { ComponentDoc } from "../../components/component-doc";

export function CollapsiblePage() {
	return (
		<ComponentDoc
			name="Collapsible"
			description="Expandable / collapsible section built on Radix Collapsible. The trigger rotates a chevron to indicate state. Supports controlled and uncontrolled usage."
			pkg="@almach/ui"
			examples={[
				{
					title: "Basic",
					description: "Click the trigger to expand and collapse the content.",
					preview: (
						<Collapsible className="w-full max-w-sm rounded-xl border px-4">
							<Collapsible.Trigger>What is Based Code?</Collapsible.Trigger>
							<Collapsible.Content>
								<p className="pb-4 text-sm text-muted-foreground leading-relaxed">
									Based Code is a component library built on Radix UI primitives
									and styled with Tailwind CSS v4. It provides accessible,
									composable components with a clean API.
								</p>
							</Collapsible.Content>
						</Collapsible>
					),
					code: `<Collapsible className="rounded-xl border px-4">
  <Collapsible.Trigger>What is Based Code?</Collapsible.Trigger>
  <Collapsible.Content>
    <p className="pb-4 text-sm text-muted-foreground">
      Based Code is a component library built on Radix UI primitives…
    </p>
  </Collapsible.Content>
</Collapsible>`,
				},
				{
					title: "FAQ list",
					description: "Stack multiple collapsibles for an accordion-style FAQ.",
					preview: (
						<div className="w-full max-w-sm divide-y rounded-xl border">
							{[
								{
									q: "Is it accessible?",
									a: "Yes. All components follow WAI-ARIA patterns and are built on Radix UI primitives.",
								},
								{
									q: "Does it support dark mode?",
									a: "Yes. Toggle the .dark class on <html> to switch themes. All tokens are CSS custom properties.",
								},
								{
									q: "Which React versions are supported?",
									a: "React 18 and 19 are both supported.",
								},
							].map(({ q, a }) => (
								<Collapsible key={q} className="px-4">
									<Collapsible.Trigger>{q}</Collapsible.Trigger>
									<Collapsible.Content>
										<p className="pb-4 text-sm text-muted-foreground leading-relaxed">
											{a}
										</p>
									</Collapsible.Content>
								</Collapsible>
							))}
						</div>
					),
					code: `<div className="divide-y rounded-xl border">
  {faqs.map(({ q, a }) => (
    <Collapsible key={q} className="px-4">
      <Collapsible.Trigger>{q}</Collapsible.Trigger>
      <Collapsible.Content>
        <p className="pb-4 text-sm text-muted-foreground">{a}</p>
      </Collapsible.Content>
    </Collapsible>
  ))}
</div>`,
				},
				{
					title: "Controlled",
					description: "Manage open state with open and onOpenChange.",
					preview: <ControlledCollapsible />,
					code: `const [open, setOpen] = React.useState(false);

<Collapsible open={open} onOpenChange={setOpen} className="rounded-xl border px-4">
  <Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
  <Collapsible.Content>
    <p className="pb-4 text-sm text-muted-foreground">Advanced settings go here.</p>
  </Collapsible.Content>
</Collapsible>`,
				},
			]}
			props={[
				{
					name: "open",
					type: "boolean",
					description: "Controlled open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					description: "Called when open state changes.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					description: "Initial open state (uncontrolled).",
				},
				{
					name: "disabled",
					type: "boolean",
					description: "Prevents toggling.",
				},
			]}
		/>
	);
}

function ControlledCollapsible() {
	const [open, setOpen] = React.useState(false);
	return (
		<div className="flex w-full max-w-sm flex-col gap-2">
			<Collapsible
				open={open}
				onOpenChange={setOpen}
				className="rounded-xl border px-4"
			>
				<Collapsible.Trigger>Advanced settings</Collapsible.Trigger>
				<Collapsible.Content>
					<p className="pb-4 text-sm text-muted-foreground leading-relaxed">
						These settings are for power users. Be careful before making changes.
					</p>
				</Collapsible.Content>
			</Collapsible>
			<p className="text-xs text-muted-foreground text-center">
				State: <span className="font-medium text-foreground">{open ? "open" : "closed"}</span>
			</p>
		</div>
	);
}
