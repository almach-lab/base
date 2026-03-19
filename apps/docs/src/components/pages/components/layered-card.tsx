import * as React from "react";
import { ArrowRight, BookOpen, FileText, Rocket, Zap } from "lucide-react";
import { Badge, Card } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function LayeredCardPage() {
	return (
		<ComponentDoc
			name="Card.Layers"
			description="Bordered grouped card with a distinct header section and content rows. Previously known as LayeredCard — now part of Card as Card.Layers, Card.LayerHeader, Card.LayerBody, and Card.LayerRow."
			pkg="@almach/ui"
			examples={[
				{
					title: "Navigation card",
					description: "Header with a title and rows with arrow actions.",
					preview: (
						<Card.Layers className="w-full max-w-sm">
							<Card.LayerHeader>Next Steps</Card.LayerHeader>
							<Card.LayerRow>Get started with the library</Card.LayerRow>
							<Card.LayerRow>Read the component docs</Card.LayerRow>
							<Card.LayerRow>Explore examples</Card.LayerRow>
						</Card.Layers>
					),
					code: `<Card.Layers>
  <Card.LayerHeader>Next Steps</Card.LayerHeader>
  <Card.LayerRow>Get started with the library</Card.LayerRow>
  <Card.LayerRow>Read the component docs</Card.LayerRow>
  <Card.LayerRow>Explore examples</Card.LayerRow>
</Card.Layers>`,
				},
				{
					title: "Clickable rows",
					description: "Add onClick to make rows interactive with hover feedback.",
					preview: (
						<Card.Layers className="w-full max-w-sm">
							<Card.LayerHeader>Resources</Card.LayerHeader>
							<Card.LayerRow
								action={<ArrowRight className="h-4 w-4" />}
								onClick={() => { }}
							>
								<span className="flex items-center gap-2">
									<BookOpen className="h-4 w-4 text-muted-foreground" />
									Documentation
								</span>
							</Card.LayerRow>
							<Card.LayerRow
								action={<ArrowRight className="h-4 w-4" />}
								onClick={() => { }}
							>
								<span className="flex items-center gap-2">
									<FileText className="h-4 w-4 text-muted-foreground" />
									Changelog
								</span>
							</Card.LayerRow>
							<Card.LayerRow
								action={<ArrowRight className="h-4 w-4" />}
								onClick={() => { }}
							>
								<span className="flex items-center gap-2">
									<Rocket className="h-4 w-4 text-muted-foreground" />
									Roadmap
								</span>
							</Card.LayerRow>
						</Card.Layers>
					),
					code: `<Card.Layers>
  <Card.LayerHeader>Resources</Card.LayerHeader>
  <Card.LayerRow action={<ArrowRight />} onClick={() => {}}>
    <span className="flex items-center gap-2"><BookOpen />Documentation</span>
  </Card.LayerRow>
</Card.Layers>`,
				},
				{
					title: "With badges",
					description: "Actions can be badges, buttons, or any element.",
					preview: (
						<Card.Layers className="w-full max-w-sm">
							<Card.LayerHeader>Status</Card.LayerHeader>
							<Card.LayerRow action={<Badge variant="success">Stable</Badge>}>
								<span className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-muted-foreground" />
									Core components
								</span>
							</Card.LayerRow>
							<Card.LayerRow action={<Badge variant="warning">Beta</Badge>}>
								<span className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-muted-foreground" />
									Table
								</span>
							</Card.LayerRow>
							<Card.LayerRow action={<Badge variant="secondary">Planned</Badge>}>
								<span className="flex items-center gap-2">
									<Zap className="h-4 w-4 text-muted-foreground" />
									Charts
								</span>
							</Card.LayerRow>
						</Card.Layers>
					),
					code: `<Card.Layers>
  <Card.LayerHeader>Status</Card.LayerHeader>
  <Card.LayerRow action={<Badge variant="success">Stable</Badge>}>Core components</Card.LayerRow>
  <Card.LayerRow action={<Badge variant="warning">Beta</Badge>}>Table</Card.LayerRow>
</Card.Layers>`,
				},
				{
					title: "No header",
					description: "Omit Card.LayerHeader for a plain grouped list.",
					preview: (
						<Card.Layers className="w-full max-w-sm">
							<Card.LayerRow action={<ArrowRight className="h-4 w-4" />}>
								Privacy Policy
							</Card.LayerRow>
							<Card.LayerRow action={<ArrowRight className="h-4 w-4" />}>
								Terms of Service
							</Card.LayerRow>
							<Card.LayerRow action={<ArrowRight className="h-4 w-4" />}>
								Cookie Settings
							</Card.LayerRow>
						</Card.Layers>
					),
					code: `<Card.Layers>
  <Card.LayerRow action={<ArrowRight />}>Privacy Policy</Card.LayerRow>
  <Card.LayerRow action={<ArrowRight />}>Terms of Service</Card.LayerRow>
</Card.Layers>`,
				},
			]}
			props={[
				{
					name: "Card.LayerHeader › action",
					type: "ReactNode",
					description: "Right-side element in the header (icon, button, badge).",
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
			]}
		/>
	);
}
