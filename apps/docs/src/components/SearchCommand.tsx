import * as React from "react";
import { Command } from "@almach/ui";
import {
	BookOpen,
	Bot,
	BarChart2,
	FileText,
	Layers,
	LayoutGrid,
	Zap,
} from "lucide-react";

// ── Navigation groups ───────────────────────────────────────────────────────
const NAV_GROUPS = [
	{
		heading: "Introduction",
		icon: BookOpen,
		items: [
			{ label: "Getting Started", href: "/getting-started" },
			{ label: "For LLMs", href: "/llms" },
		],
	},
	{
		heading: "Inputs",
		icon: Zap,
		items: [
			{ label: "Button", href: "/components/button" },
			{ label: "Checkbox", href: "/components/checkbox" },
{ label: "Date Input", href: "/components/date-input" },
			{ label: "Input", href: "/components/input" },
			{ label: "Label", href: "/components/label" },
			{ label: "Radio", href: "/components/radio" },
			{ label: "Select", href: "/components/select" },
			{ label: "Switch", href: "/components/switch" },
			{ label: "Tag Input", href: "/components/tag-input" },
			{ label: "Textarea", href: "/components/textarea" },
		],
	},
	{
		heading: "Display",
		icon: LayoutGrid,
		items: [
			{ label: "Alert", href: "/components/alert" },
			{ label: "Avatar", href: "/components/avatar" },
			{ label: "Badge", href: "/components/badge" },
			{ label: "Progress", href: "/components/progress" },
			{ label: "Skeleton", href: "/components/skeleton" },
			{ label: "Toast", href: "/components/toast" },
			{ label: "Tooltip", href: "/components/tooltip" },
		],
	},
	{
		heading: "Layout",
		icon: Layers,
		items: [
			{ label: "Card", href: "/components/card" },
			{ label: "Carousel", href: "/components/carousel" },
			{ label: "Group", href: "/components/group" },
			{ label: "Layered Card", href: "/components/layered-card" },
			{ label: "Separator", href: "/components/separator" },
		],
	},
	{
		heading: "Overlay",
		icon: FileText,
		items: [
			{ label: "Collapsible", href: "/components/collapsible" },
			{ label: "Command", href: "/components/command" },
			{ label: "Dialog", href: "/components/dialog" },
			{ label: "Drawer", href: "/components/drawer" },
			{ label: "Dropdown Menu", href: "/components/dropdown-menu" },
			{ label: "Modal", href: "/components/modal" },
			{ label: "Popover", href: "/components/popover" },
			{ label: "Tabs", href: "/components/tabs" },
		],
	},
	{
		heading: "Data",
		icon: BarChart2,
		items: [
			{ label: "Chart", href: "/components/chart" },
			{ label: "Calendar", href: "/components/calendar" },
			{ label: "Table", href: "/components/table" },
		],
	},
	{
		heading: "Packages",
		icon: Bot,
		items: [
			{ label: "Forms", href: "/forms" },
			{ label: "Query", href: "/query" },
		],
	},
];

// ── Component ───────────────────────────────────────────────────────────────
export function SearchCommand() {
	const [open, setOpen] = React.useState(false);

	// ⌘K / Ctrl+K to open
	React.useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	const navigate = (href: string) => {
		setOpen(false);
		window.location.href = href;
	};

	return (
		<>
			{/* Mobile: icon-only button */}
			<button
				onClick={() => setOpen(true)}
				className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 lg:hidden"
				aria-label="Search documentation"
				aria-haspopup="dialog"
			>
				<svg
					className="h-[15px] w-[15px]"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
			</button>

			{/* Desktop: expanded search bar */}
			<button
				onClick={() => setOpen(true)}
				className="hidden h-9 cursor-pointer items-center gap-2.5 rounded-lg border border-input bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 lg:flex"
				aria-label="Search documentation"
				aria-haspopup="dialog"
			>
				<svg
					className="h-3.5 w-3.5 shrink-0"
					fill="none"
					stroke="currentColor"
					strokeWidth={2}
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.35-4.35" />
				</svg>
				<span className="flex-1 text-left">Search docs…</span>
				<kbd className="flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground">
					⌘K
				</kbd>
			</button>

			{/* Command dialog */}
			<Command.Dialog open={open} onOpenChange={setOpen}>
				<Command.Input placeholder="Search docs…" />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>

					{NAV_GROUPS.map((group, gi) => (
						<React.Fragment key={gi}>
							{gi > 0 && <Command.Separator />}
							<Command.Group heading={group.heading}>
								{group.items.map((item) => (
									<Command.Item
										key={item.href}
										onSelect={() => navigate(item.href)}
									>
										<group.icon className="h-4 w-4 text-muted-foreground" />
										{item.label}
									</Command.Item>
								))}
							</Command.Group>
						</React.Fragment>
					))}
				</Command.List>
			</Command.Dialog>
		</>
	);
}
