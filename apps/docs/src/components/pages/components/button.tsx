import * as React from "react";
import { Button } from "@almach/ui";
import { Download, ExternalLink, Mail, Plus, Trash2 } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function ButtonPage() {
	return (
		<ComponentDoc
			name="Button"
			description="Triggers an action or event. Supports multiple variants, sizes, loading state, and icon slots."
			examples={[
				{
					title: "Variants",
					description:
						"Use the variant prop to choose from eight visual styles.",
					preview: (
						<div className="flex flex-wrap items-center gap-2">
							<Button>Default</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="link">Link</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="success">Success</Button>
							<Button variant="warning">Warning</Button>
						</div>
					),
					code: `<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>`,
				},
				{
					title: "Sizes",
					description: "Six sizes including dedicated icon sizes.",
					preview: (
						<div className="flex flex-wrap items-end gap-2">
							<Button size="sm">Small</Button>
							<Button>Default</Button>
							<Button size="lg">Large</Button>
							<Button size="icon" aria-label="Add">
								<Plus />
							</Button>
							<Button size="icon-sm" aria-label="Add">
								<Plus />
							</Button>
							<Button size="icon-lg" aria-label="Add">
								<Plus />
							</Button>
						</div>
					),
					code: `<Button size="sm">Small</Button>
<Button>Default</Button>
<Button size="lg">Large</Button>
<Button size="icon" aria-label="Add"><Plus /></Button>
<Button size="icon-sm" aria-label="Add"><Plus /></Button>
<Button size="icon-lg" aria-label="Add"><Plus /></Button>`,
				},
				{
					title: "With icons",
					description:
						"Use leftIcon or rightIcon slots. Icons are properly sized per the button size.",
					preview: (
						<div className="flex flex-wrap gap-2">
							<Button leftIcon={<Download />}>Download</Button>
							<Button variant="outline" rightIcon={<Mail />}>
								Contact
							</Button>
							<Button variant="outline" rightIcon={<ExternalLink />}>
								Open docs
							</Button>
							<Button variant="destructive" leftIcon={<Trash2 />}>
								Delete
							</Button>
						</div>
					),
					code: `<Button leftIcon={<Download />}>Download</Button>
<Button variant="outline" rightIcon={<Mail />}>Contact</Button>
<Button variant="outline" rightIcon={<ExternalLink />}>Open docs</Button>
<Button variant="destructive" leftIcon={<Trash2 />}>Delete</Button>`,
				},
				{
					title: "Loading",
					description:
						"Shows a spinner and sets aria-busy. Interaction is automatically prevented.",
					preview: (
						<div className="flex flex-wrap gap-2">
							<Button loading>Saving…</Button>
							<Button loading variant="outline">
								Uploading…
							</Button>
							<Button loading variant="secondary">
								Processing
							</Button>
						</div>
					),
					code: `<Button loading>Saving…</Button>
<Button loading variant="outline">Uploading…</Button>
<Button loading variant="secondary">Processing</Button>`,
				},
				{
					title: "Disabled",
					description:
						"Disabled buttons are non-interactive and rendered at 40% opacity.",
					preview: (
						<div className="flex flex-wrap gap-2">
							<Button disabled>Disabled</Button>
							<Button disabled variant="outline">
								Disabled
							</Button>
							<Button disabled variant="secondary">
								Disabled
							</Button>
							<Button disabled variant="destructive">
								Disabled
							</Button>
						</div>
					),
					code: `<Button disabled>Disabled</Button>
<Button disabled variant="outline">Disabled</Button>
<Button disabled variant="secondary">Disabled</Button>`,
				},
			]}
			props={[
				{
					name: "variant",
					type: '"default" | "secondary" | "outline" | "ghost" | "link" | "destructive" | "success" | "warning"',
					default: '"default"',
					description: "Visual style of the button.",
				},
				{
					name: "size",
					type: '"sm" | "default" | "lg" | "icon" | "icon-sm" | "icon-lg"',
					default: '"default"',
					description: "Size of the button.",
				},
				{
					name: "loading",
					type: "boolean",
					default: "false",
					description:
						"Shows a spinner, sets aria-busy, and prevents interaction.",
				},
				{
					name: "leftIcon",
					type: "ReactNode",
					description: "Icon rendered before the label text.",
				},
				{
					name: "rightIcon",
					type: "ReactNode",
					description: "Icon rendered after the label text.",
				},
				{
					name: "asChild",
					type: "boolean",
					default: "false",
					description:
						"Merges props onto the child element via Radix Slot (useful for router links).",
				},
				{
					name: "disabled",
					type: "boolean",
					default: "false",
					description: "Prevents interaction and renders at 40% opacity.",
				},
			]}
		/>
	);
}
