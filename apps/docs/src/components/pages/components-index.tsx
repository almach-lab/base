import * as React from "react";
import { ArrowRight, Search } from "lucide-react";
import { Badge, Input } from "@almach/ui";
import { DOC_COMPONENT_GROUPS } from "../../lib/doc-components";

// ── Component registry ──────────────────────────────────────────────────────
const GROUPS = DOC_COMPONENT_GROUPS.map((group) => ({
	name: group.name,
	items: group.items.map((item) => ({
		name: item.name,
		href: `/components/${item.slug}`,
		description: item.description,
	})),
}));

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
