import * as React from "react";
import { ArrowRight, Search } from "lucide-react";
import { Badge, Input } from "@almach/ui";

// ── Component registry ──────────────────────────────────────────────────────
const GROUPS = [
	{
		name: "Inputs",
		items: [
			{ name: "Button", href: "/components/button", description: "Triggers an action or event." },
			{ name: "Checkbox", href: "/components/checkbox", description: "Boolean selection control." },
{ name: "Date Input", href: "/components/date-input", description: "Segmented MM/DD/YYYY field." },
			{ name: "Input", href: "/components/input", description: "Text field with icon slots." },
			{ name: "Label", href: "/components/label", description: "Accessible form label." },
			{ name: "Radio", href: "/components/radio", description: "Single-selection radio group." },
			{ name: "Select", href: "/components/select", description: "Dropdown + searchable select." },
			{ name: "Switch", href: "/components/switch", description: "Toggle control with three sizes." },
			{ name: "Tag Input", href: "/components/tag-input", description: "Multi-value tag input field." },
			{ name: "Textarea", href: "/components/textarea", description: "Multi-line text input." },
		],
	},
	{
		name: "Display",
		items: [
			{ name: "Alert", href: "/components/alert", description: "Inline feedback messages." },
			{ name: "Avatar", href: "/components/avatar", description: "User image with fallback initials." },
			{ name: "Badge", href: "/components/badge", description: "Status labels and tags." },
			{ name: "Progress", href: "/components/progress", description: "Linear progress indicator." },
			{ name: "Skeleton", href: "/components/skeleton", description: "Shimmer loading placeholder." },
			{ name: "Toast", href: "/components/toast", description: "Transient notifications." },
			{ name: "Tooltip", href: "/components/tooltip", description: "Contextual hover hints." },
		],
	},
	{
		name: "Layout",
		items: [
			{ name: "Card", href: "/components/card", description: "Surface container with sections." },
			{ name: "Carousel", href: "/components/carousel", description: "Touch-friendly slide carousel." },
{ name: "Separator", href: "/components/separator", description: "Horizontal or vertical divider." },
		],
	},
	{
		name: "Overlay",
		items: [
			{ name: "Collapsible", href: "/components/collapsible", description: "Expand / collapse content." },
			{ name: "Command", href: "/components/command", description: "⌘K command palette with search." },
			{ name: "Dialog", href: "/components/dialog", description: "Modal overlay with focus trapping." },
			{ name: "Drawer", href: "/components/drawer", description: "Bottom sheet with drag-to-dismiss." },
			{ name: "Dropdown Menu", href: "/components/dropdown-menu", description: "Contextual floating menu." },
			{ name: "Modal", href: "/components/modal", description: "Dialog on desktop, Drawer on mobile." },
			{ name: "Popover", href: "/components/popover", description: "Floating panel anchored to a trigger." },
			{ name: "Tabs", href: "/components/tabs", description: "Pill and underline tab variants." },
		],
	},
	{
		name: "Data",
		items: [
			{ name: "Chart", href: "/components/chart", description: "Line, Bar, Area, Pie, and Radar charts." },
			{ name: "Calendar", href: "/components/calendar", description: "Date and date range picker." },
			{ name: "Table", href: "/components/table", description: "TanStack-powered data table." },
		],
	},
];

const ALL_ITEMS = GROUPS.flatMap((g) => g.items);
const TOTAL = ALL_ITEMS.length;

// ── Page ────────────────────────────────────────────────────────────────────
export function ComponentsIndexPage() {
	const [query, setQuery] = React.useState("");

	const filtered = React.useMemo(() => {
		if (!query.trim()) return null; // null = show groups
		const q = query.toLowerCase();
		return ALL_ITEMS.filter(
			(c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
		);
	}, [query]);

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
			{/* Header */}
			<div className="mb-8 border-b pb-8">
				<Badge variant="outline" className="mb-2 font-mono">
					@almach/ui
				</Badge>
				<h1 className="mt-2 text-3xl font-bold tracking-tight">Components</h1>
				<p className="mt-2 text-base text-muted-foreground leading-relaxed max-w-xl">
					{TOTAL} accessible, composable components built on Radix UI primitives with Tailwind CSS v4.
				</p>
			</div>

			{/* Search */}
			<div className="mb-8">
				<Input
					type="search"
					placeholder="Search components…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					aria-label="Search components"
					className="h-10"
					leftElement={<Search className="h-4 w-4" aria-hidden="true" />}
				/>
			</div>

			{/* Flat search results */}
			{filtered !== null ? (
				filtered.length === 0 ? (
					<div className="py-12 text-center text-muted-foreground">
						<p className="text-sm">
							No components match "<strong>{query}</strong>"
						</p>
					</div>
				) : (
					<>
						<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{filtered.map((c) => (
								<ComponentCard key={c.name} {...c} />
							))}
						</div>
						<p className="mt-4 text-xs text-muted-foreground">
							{filtered.length} of {TOTAL} components
						</p>
					</>
				)
			) : (
				/* Grouped view */
				<div className="space-y-10">
					{GROUPS.map((group) => (
						<section key={group.name}>
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70">
								{group.name}
							</h2>
							<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{group.items.map((c) => (
									<ComponentCard key={c.name} {...c} />
								))}
							</div>
						</section>
					))}
				</div>
			)}
		</div>
	);
}

function ComponentCard({ name, href, description }: { name: string; href: string; description: string }) {
	return (
		<a
			href={href}
			aria-label={`${name} — ${description}`}
			className="group flex items-center justify-between rounded-xl border px-4 py-3.5 transition-colors hover:bg-accent/50 hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			<div className="min-w-0">
				<p className="text-sm font-medium">{name}</p>
				<p className="truncate text-xs text-muted-foreground">{description}</p>
			</div>
			<ArrowRight className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
		</a>
	);
}
