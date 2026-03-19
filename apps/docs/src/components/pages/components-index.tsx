import * as React from "react";

import { ArrowRight, Search } from "lucide-react";
import { cn } from "@almach/utils";

const components = [
	{ name: "Alert", href: "/components/alert", description: "Inline feedback messages." },
	{ name: "Avatar", href: "/components/avatar", description: "User image with fallback initials." },
	{ name: "Badge", href: "/components/badge", description: "Status labels and tags." },
	{ name: "Button", href: "/components/button", description: "Triggers an action or event." },
	{ name: "Calendar", href: "/components/calendar", description: "Date and date range picker." },
	{ name: "Card", href: "/components/card", description: "Surface container with sections and rows." },
	{ name: "Carousel", href: "/components/carousel", description: "Touch-friendly slide carousel." },
	{ name: "Checkbox", href: "/components/checkbox", description: "Boolean selection control." },
	{ name: "Collapsible", href: "/components/collapsible", description: "Expand / collapse content." },
	{ name: "Command", href: "/components/command", description: "⌘K command palette with search." },
	{ name: "Combobox", href: "/components/combobox", description: "Searchable select with custom options." },
	{ name: "Date Input", href: "/components/date-input", description: "Segmented MM/DD/YYYY field. Input.Date" },
	{ name: "Dialog", href: "/components/dialog", description: "Modal overlay with focus trapping." },
	{ name: "Drawer", href: "/components/drawer", description: "Bottom sheet with drag-to-dismiss." },
	{ name: "Dropdown Menu", href: "/components/dropdown-menu", description: "Contextual floating menu." },
	{ name: "Group", href: "/components/group", description: "Grouped form and navigation rows." },
	{ name: "Input", href: "/components/input", description: "Text field with icon slots and date variant." },
	{ name: "Label", href: "/components/label", description: "Accessible form label." },
	{ name: "Layered Card", href: "/components/layered-card", description: "Settings panel with layered rows." },
	{ name: "Modal", href: "/components/modal", description: "Dialog on desktop, Drawer on mobile." },
	{ name: "Progress", href: "/components/progress", description: "Linear progress indicator." },
	{ name: "Radio", href: "/components/radio", description: "Single-selection radio group." },
	{ name: "Select", href: "/components/select", description: "Dropdown + searchable (Select.Searchable)." },
	{ name: "Separator", href: "/components/separator", description: "Horizontal or vertical divider." },
	{ name: "Skeleton", href: "/components/skeleton", description: "Shimmer loading placeholder." },
	{ name: "Switch", href: "/components/switch", description: "iOS-style toggle, 3 sizes." },
	{ name: "Table", href: "/components/table", description: "TanStack-powered data table." },
	{ name: "Tabs", href: "/components/tabs", description: "Pill and underline tab variants." },
	{ name: "Tag Input", href: "/components/tag-input", description: "Multi-value tag input field." },
	{ name: "Textarea", href: "/components/textarea", description: "Multi-line text input." },
	{ name: "Toast", href: "/components/toast", description: "Transient notifications." },
	{ name: "Tooltip", href: "/components/tooltip", description: "Contextual hover hints." },
];

export function ComponentsIndexPage() {
	const [query, setQuery] = React.useState("");

	const filtered = React.useMemo(() => {
		if (!query.trim()) return components;
		const q = query.toLowerCase();
		return components.filter(
			(c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
		);
	}, [query]);

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
			{/* Header */}
			<div className="mb-8 border-b pb-8">
				<span className="mb-2 inline-flex items-center rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
					@almach/ui
				</span>
				<h1 className="mt-2 text-3xl font-bold tracking-tight">Components</h1>
				<p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-xl">
					{components.length} accessible, composable components built on Radix UI primitives
					with Tailwind CSS v4.
				</p>
			</div>

			{/* Search */}
			<div className="relative mb-6">
				<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
				<input
					type="search"
					placeholder="Search components…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					className={cn(
						"flex h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm",
						"placeholder:text-muted-foreground",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
						"transition-all duration-150",
					)}
					aria-label="Search components"
				/>
			</div>

			{/* Results */}
			{filtered.length === 0 ? (
				<div className="py-12 text-center text-muted-foreground">
					<p className="text-sm">No components match "<strong>{query}</strong>"</p>
				</div>
			) : (
				<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((c) => (
						<a
							key={c.name}
							href={c.href}
							className="group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors hover:bg-accent/50 hover:border-foreground/20"
						>
							<div className="min-w-0">
								<p className="text-sm font-medium">{c.name}</p>
								<p className="truncate text-xs text-muted-foreground">{c.description}</p>
							</div>
							<ArrowRight className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
						</a>
					))}
				</div>
			)}

			{query && filtered.length > 0 && (
				<p className="mt-4 text-xs text-muted-foreground">
					{filtered.length} of {components.length} components
				</p>
			)}
		</div>
	);
}
