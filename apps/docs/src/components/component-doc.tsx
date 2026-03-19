import * as React from "react";
import { cn } from "@almach/utils";
import { Card } from "@almach/ui";
import { CodeBlock } from "./code-block";

/* ── Example card (gallery tile) ────────────────────────────────────────── */
export interface ExampleProps {
	title: string;
	description?: string;
	preview: React.ReactNode;
	code: string;
	lang?: string;
	centered?: boolean;
}

/* ── Variant gallery tile ────────────────────────────────────────────────── */
function VariantTile({
	example,
	selected,
	onClick,
}: {
	example: ExampleProps;
	selected: boolean;
	onClick: () => void;
}) {
	return (
		<button
			onClick={onClick}
			className="group text-left outline-none rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all block w-full"
		>
			<Card
				className={cn(
					"overflow-hidden transition-all hover:border-foreground/30",
					selected ? "border-foreground shadow-sm bg-accent/10" : "bg-background"
				)}
			>
				{/* Full-size preview with aspect-video for clean responsive fitting */}
				{/* Compact preview viewport */}
				<div
					className={cn(
						"relative flex h-[200px] w-full overflow-hidden",
						"bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] bg-[size:16px_16px] bg-center rounded-t-xl"
					)}
				>
					<div className="absolute inset-4 flex items-center justify-center [&>*]:max-w-full [&>*]:max-h-full">
						{example.preview}
					</div>
				</div>
				{/* Title on the bottom */}
				<Card.Footer className="p-3 border-t bg-muted/30">
					<p
						className={cn(
							"text-xs font-medium truncate w-full text-center",
							selected ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
						)}
					>
						{example.title}
					</p>
				</Card.Footer>
			</Card>
		</button>
	);
}

/* ── Main example viewer ─────────────────────────────────────────────────── */
function ExampleViewer({ example }: { example: ExampleProps }) {
	const [tab, setTab] = React.useState<"preview" | "code">("preview");

	// Reset to preview when example changes
	React.useEffect(() => { setTab("preview"); }, [example.title]);

	return (
		<div className="rounded-xl border overflow-hidden">
			{/* Tab bar */}
			<div className="flex items-center gap-1 border-b bg-muted/20 px-3">
				{(["preview", "code"] as const).map((t) => (
					<button
						key={t}
						onClick={() => setTab(t)}
						className={cn(
							"relative px-3 py-2.5 text-xs font-medium capitalize transition-colors",
							tab === t
								? "text-foreground after:absolute after:inset-x-3 after:bottom-0 after:h-px after:bg-foreground"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{t === "preview" ? "Preview" : "Code"}
					</button>
				))}

			</div>

			{tab === "preview" ? (
				<div
					className={cn(
						"min-h-40 bg-[radial-gradient(hsl(var(--border))_1px,transparent_1px)] bg-[size:20px_20px] bg-background p-8",
						example.centered !== false && "flex items-center justify-center",
					)}
				>
					{example.preview}
				</div>
			) : (
				<CodeBlock
					code={example.code}
					lang={example.lang ?? "tsx"}
					className="rounded-none border-0"
				/>
			)}
		</div>
	);
}

/* ── Props table ─────────────────────────────────────────────────────────── */
export interface PropRow {
	name: string;
	type: string;
	default?: string;
	required?: boolean;
	description: string;
}

function PropsTable({ props }: { props: PropRow[] }) {
	return (
		<div className="space-y-3">
			<h2 className="text-base font-semibold">Props</h2>
			<div className="overflow-x-auto rounded-xl border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b bg-muted/30">
							{["Prop", "Type", "Default", "Description"].map((h) => (
								<th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground">
									{h}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="divide-y">
						{props.map((p) => (
							<tr key={p.name} className="transition-colors hover:bg-muted/20">
								<td className="px-4 py-3 align-top">
									<code className="font-mono text-[12px] text-foreground">{p.name}</code>
									{p.required && <span className="ml-1 text-destructive text-xs">*</span>}
								</td>
								<td className="px-4 py-3 align-top">
									<code className="font-mono text-[12px] text-primary/80">{p.type}</code>
								</td>
								<td className="px-4 py-3 align-top">
									<code className="font-mono text-[12px] text-muted-foreground">{p.default ?? "—"}</code>
								</td>
								<td className="px-4 py-3 align-top text-sm text-muted-foreground leading-relaxed">
									{p.description}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}

/* ── ComponentDoc ────────────────────────────────────────────────────────── */
export interface ComponentDocProps {
	name: string;
	description: string;
	pkg?: string;
	examples: ExampleProps[];
	props?: PropRow[];
	children?: React.ReactNode;
}

export function ComponentDoc({
	name,
	description,
	pkg = "@almach/ui",
	examples,
	props,
	children,
}: ComponentDocProps) {
	const [selected, setSelected] = React.useState(0);
	const activeExample = (examples[selected] ?? examples[0])!;

	return (
		<div className="mx-auto max-w-4xl px-4 py-10 md:px-8 space-y-10">
			{/* Header */}
			<div className="border-b pb-8 space-y-2">
				<span className="inline-flex items-center rounded-md border bg-muted/50 px-2 py-0.5 font-mono text-xs text-muted-foreground">
					{pkg}
				</span>
				<h1 className="text-3xl font-bold tracking-tight">{name}</h1>
				<p className="text-base text-muted-foreground leading-relaxed max-w-xl">
					{description}
				</p>
			</div>

			{children}

			{/* Main viewer */}
			<div className="space-y-4">
				<div className="flex items-center justify-between gap-3">
					<h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						{activeExample.title}
					</h2>
					{activeExample.description && (
						<p className="text-sm text-muted-foreground hidden md:block">{activeExample.description}</p>
					)}
				</div>
				<ExampleViewer example={activeExample} />
			</div>

			{/* Variant gallery — only show when there are multiple examples */}
			{examples.length > 1 && (
				<div className="space-y-3">
					<h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
						All variants
					</h2>
					<div className="grid md:grid-cols-2 gap-4">
						{examples.map((ex, i) => (
							<VariantTile
								key={i}
								example={ex}
								selected={i === selected}
								onClick={() => setSelected(i)}
							/>
						))}
					</div>
				</div>
			)}

			{/* Props */}
			{props && props.length > 0 && <PropsTable props={props} />}
		</div>
	);
}
