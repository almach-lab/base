import * as React from "react";
import {
	ResponsiveContainer,
	LineChart,
	BarChart,
	AreaChart,
	PieChart,
	RadarChart,
	ScatterChart,
	Line,
	Bar,
	Area,
	Pie,
	Radar,
	Scatter,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Cell,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "recharts";
import { cn } from "@almach/utils";

// ── Chart color tokens ──────────────────────────────────────────────────────
// Defined in globals.css as --chart-1 … --chart-5
export const CHART_COLORS = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
] as const;

// ── Container ───────────────────────────────────────────────────────────────
interface ChartContainerProps {
	className?: string;
	children: React.ReactElement;
	height?: number | string;
}

const ChartContainer = ({
	className,
	children,
	height = 300,
}: ChartContainerProps) => (
	<div className={cn("w-full", className)} style={{ height }}>
		<ResponsiveContainer width="100%" height="100%">
			{children}
		</ResponsiveContainer>
	</div>
);
ChartContainer.displayName = "Chart.Container";

// ── Tooltip content ─────────────────────────────────────────────────────────
interface ChartTooltipContentProps {
	active?: boolean;
	payload?: Array<{
		value?: number | string;
		name?: string;
		color?: string;
	}>;
	label?: string | number;
	formatter?: (value: number | string, name: string) => [string, string];
	hideLabel?: boolean;
}

const ChartTooltipContent = ({
	active,
	payload,
	label,
	formatter,
	hideLabel,
}: ChartTooltipContentProps) => {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-lg border bg-popover px-3 py-2 shadow-md text-sm text-popover-foreground">
			{!hideLabel && label != null && (
				<p className="mb-1.5 font-medium">{String(label)}</p>
			)}
			<div className="flex flex-col gap-1">
				{payload.map((entry, i) => {
					const raw = entry.value ?? 0;
					const [val, name] = formatter
						? formatter(raw, entry.name ?? "")
						: [String(raw), entry.name ?? ""];
					return (
						<div key={i} className="flex items-center gap-2">
							<span
								className="size-2.5 shrink-0 rounded-full"
								style={{ background: entry.color }}
							/>
							<span className="text-muted-foreground">{name}</span>
							<span className="ml-auto font-medium tabular-nums">{val}</span>
						</div>
					);
				})}
			</div>
		</div>
	);
};
ChartTooltipContent.displayName = "Chart.TooltipContent";

// ── Pre-styled primitives ───────────────────────────────────────────────────

type AnyProps = Record<string, unknown>;

const ChartTooltip = (props: AnyProps) => (
	<Tooltip
		content={<ChartTooltipContent />}
		cursor={{ stroke: "hsl(var(--border))", strokeWidth: 1 }}
		{...props}
	/>
);
ChartTooltip.displayName = "Chart.Tooltip";

const ChartGrid = (props: AnyProps) => (
	<CartesianGrid
		strokeDasharray="3 3"
		stroke="hsl(var(--border))"
		{...props}
	/>
);
ChartGrid.displayName = "Chart.Grid";

const ChartXAxis = (props: AnyProps) => (
	<XAxis
		tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
		tickLine={false}
		axisLine={{ stroke: "hsl(var(--border))" }}
		{...props}
	/>
);
ChartXAxis.displayName = "Chart.XAxis";

const ChartYAxis = (props: AnyProps) => (
	<YAxis
		tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
		tickLine={false}
		axisLine={false}
		{...props}
	/>
);
ChartYAxis.displayName = "Chart.YAxis";

const ChartLegend = (props: AnyProps) => (
	<Legend
		wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}
		{...props}
	/>
);
ChartLegend.displayName = "Chart.Legend";

const ChartPolarGrid = (props: AnyProps) => (
	<PolarGrid stroke="hsl(var(--border))" {...props} />
);
ChartPolarGrid.displayName = "Chart.PolarGrid";

const ChartPolarAxis = (props: AnyProps) => (
	<PolarAngleAxis
		tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
		{...props}
	/>
);
ChartPolarAxis.displayName = "Chart.PolarAxis";

// ── Compound export ─────────────────────────────────────────────────────────
const Chart = Object.assign(
	{},
	{
		// Layout
		Container: ChartContainer,
		// Axes & grid
		Grid: ChartGrid,
		XAxis: ChartXAxis,
		YAxis: ChartYAxis,
		PolarGrid: ChartPolarGrid,
		PolarAxis: ChartPolarAxis,
		// Tooltip & legend
		Tooltip: ChartTooltip,
		TooltipContent: ChartTooltipContent,
		Legend: ChartLegend,
		// Chart roots
		Line: LineChart,
		Bar: BarChart,
		Area: AreaChart,
		Pie: PieChart,
		Radar: RadarChart,
		Scatter: ScatterChart,
		// Series
		LineSeries: Line,
		BarSeries: Bar,
		AreaSeries: Area,
		PieSeries: Pie,
		RadarSeries: Radar,
		ScatterSeries: Scatter,
		// Helpers
		Cell,
		PolarRadiusAxis,
	},
);

export {
	Chart,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartGrid,
	ChartXAxis,
	ChartYAxis,
	ChartLegend,
	ChartPolarGrid,
	ChartPolarAxis,
	// Re-export recharts chart roots
	LineChart,
	BarChart,
	AreaChart,
	PieChart,
	RadarChart,
	ScatterChart,
	// Re-export recharts series
	Line,
	Bar,
	Area,
	Pie,
	Radar,
	Scatter,
	// Re-export recharts helpers
	Cell,
	ResponsiveContainer,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
};
