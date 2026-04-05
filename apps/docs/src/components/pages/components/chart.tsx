import * as React from "react";
import {
	Chart,
	CHART_COLORS,
	Line,
	Bar,
	Area,
	Pie,
	Radar,
	Cell,
	PolarRadiusAxis,
} from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

// ── Shared sample data ──────────────────────────────────────────────────────
const monthly = [
	{ month: "Jan", revenue: 4200, expenses: 2800 },
	{ month: "Feb", revenue: 5100, expenses: 3100 },
	{ month: "Mar", revenue: 4700, expenses: 2600 },
	{ month: "Apr", revenue: 6300, expenses: 3400 },
	{ month: "May", revenue: 7200, expenses: 3900 },
	{ month: "Jun", revenue: 6800, expenses: 3600 },
];

const categories = [
	{ name: "Design", value: 32 },
	{ name: "Engineering", value: 45 },
	{ name: "Marketing", value: 15 },
	{ name: "Operations", value: 8 },
];

const radarData = [
	{ subject: "Speed", A: 90, B: 70 },
	{ subject: "Quality", A: 75, B: 85 },
	{ subject: "Cost", A: 60, B: 80 },
	{ subject: "Support", A: 85, B: 65 },
	{ subject: "Scale", A: 70, B: 90 },
];

// ── Chart doc page ──────────────────────────────────────────────────────────
export function ChartPage() {
	return (
		<ComponentDoc
			name="Chart"
			description="Composable chart primitives including Line, Bar, Area, Pie, and Radar charts with full theme integration via CSS variables."
			pkg="@almach/ui"
			examples={[
				{
					title: "Line Chart",
					description: "Multi-series line chart with a grid, axes, and tooltip.",
					centered: false,
					preview: (
						<Chart.Container height={240} className="w-full">
							<Chart.Line data={monthly}>
								<Chart.Grid />
								<Chart.XAxis dataKey="month" />
								<Chart.YAxis />
								<Chart.Tooltip />
								<Line dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
								<Line dataKey="expenses" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
							</Chart.Line>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Line } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Line data={data}>
    <Chart.Grid />
    <Chart.XAxis dataKey="month" />
    <Chart.YAxis />
    <Chart.Tooltip />
    <Line dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
    <Line dataKey="expenses" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
  </Chart.Line>
</Chart.Container>`,
				},
				{
					title: "Bar Chart",
					description: "Grouped bar chart with multiple series.",
					centered: false,
					preview: (
						<Chart.Container height={240} className="w-full">
							<Chart.Bar data={monthly}>
								<Chart.Grid />
								<Chart.XAxis dataKey="month" />
								<Chart.YAxis />
								<Chart.Tooltip />
								<Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
								<Bar dataKey="expenses" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
							</Chart.Bar>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Bar } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Bar data={data}>
    <Chart.Grid />
    <Chart.XAxis dataKey="month" />
    <Chart.YAxis />
    <Chart.Tooltip />
    <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
    <Bar dataKey="expenses" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
  </Chart.Bar>
</Chart.Container>`,
				},
				{
					title: "Area Chart",
					description: "Stacked area chart with gradient fills.",
					centered: false,
					preview: (
						<Chart.Container height={240} className="w-full">
							<Chart.Area data={monthly}>
								<defs>
									<linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
										<stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
									</linearGradient>
								</defs>
								<Chart.Grid />
								<Chart.XAxis dataKey="month" />
								<Chart.YAxis />
								<Chart.Tooltip />
								<Area
									dataKey="revenue"
									stroke={CHART_COLORS[0]}
									fill="url(#fillRevenue)"
									strokeWidth={2}
								/>
							</Chart.Area>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Area } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Area data={data}>
    <defs>
      <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
        <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
      </linearGradient>
    </defs>
    <Chart.Grid />
    <Chart.XAxis dataKey="month" />
    <Chart.YAxis />
    <Chart.Tooltip />
    <Area dataKey="revenue" stroke={CHART_COLORS[0]} fill="url(#fillRevenue)" strokeWidth={2} />
  </Chart.Area>
</Chart.Container>`,
				},
				{
					title: "Pie Chart",
					description: "Pie chart with labeled segments and theme colors.",
					preview: (
						<Chart.Container height={240} className="w-full">
							<Chart.Pie>
								<Pie
									data={categories}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									outerRadius={90}
									label={({ name, percent }) =>
										`${name} ${((percent ?? 0) * 100).toFixed(0)}%`
									}
									labelLine={false}
								>
									{categories.map((_, i) => (
										<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
									))}
								</Pie>
								<Chart.Tooltip />
							</Chart.Pie>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Pie, Cell } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Pie>
    <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}
      label={({ name, percent }) => \`\${name} \${(percent * 100).toFixed(0)}%\`}
      labelLine={false}
    >
      {data.map((_, i) => (
        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
      ))}
    </Pie>
    <Chart.Tooltip />
  </Chart.Pie>
</Chart.Container>`,
				},
				{
					title: "Donut Chart",
					description: "Pie chart with an inner radius for a donut style.",
					preview: (
						<Chart.Container height={240} className="w-full">
							<Chart.Pie>
								<Pie
									data={categories}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									innerRadius={55}
									outerRadius={90}
								>
									{categories.map((_, i) => (
										<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
									))}
								</Pie>
								<Chart.Tooltip />
								<Chart.Legend />
							</Chart.Pie>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Pie, Cell } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Pie>
    <Pie data={data} dataKey="value" nameKey="name"
      cx="50%" cy="50%" innerRadius={55} outerRadius={90}
    >
      {data.map((_, i) => (
        <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
      ))}
    </Pie>
    <Chart.Tooltip />
    <Chart.Legend />
  </Chart.Pie>
</Chart.Container>`,
				},
				{
					title: "Radar Chart",
					description: "Radar chart for comparing multiple entities across dimensions.",
					preview: (
						<Chart.Container height={260} className="w-full">
							<Chart.Radar data={radarData}>
								<Chart.PolarGrid />
								<Chart.PolarAxis dataKey="subject" />
								<PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
								<Radar dataKey="A" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.25} />
								<Radar dataKey="B" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.25} />
								<Chart.Legend />
							</Chart.Radar>
						</Chart.Container>
					),
					code: `import { Chart, CHART_COLORS, Radar, PolarRadiusAxis } from "@almach/ui";

<Chart.Container height={260}>
  <Chart.Radar data={data}>
    <Chart.PolarGrid />
    <Chart.PolarAxis dataKey="subject" />
    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} axisLine={false} />
    <Radar dataKey="A" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.25} />
    <Radar dataKey="B" stroke={CHART_COLORS[1]} fill={CHART_COLORS[1]} fillOpacity={0.25} />
    <Chart.Legend />
  </Chart.Radar>
</Chart.Container>`,
				},
			]}
			props={[
				{
					name: "Chart.Container › height",
					type: "number | string",
					default: "300",
					description: "Height of the chart wrapper (px or CSS value).",
				},
				{
					name: "Chart.Container › className",
					type: "string",
					description: "Extra classes applied to the wrapper div.",
				},
				{
					name: "CHART_COLORS",
					type: "readonly string[]",
					description: "5 theme-aware palette tokens mapped to --chart-1…5 CSS variables.",
				},
				{
					name: "Chart.Grid",
					type: "CartesianGridProps",
					description: "Pre-styled CartesianGrid. Accepts all recharts CartesianGrid props.",
				},
				{
					name: "Chart.XAxis / YAxis",
					type: "XAxisProps / YAxisProps",
					description: "Pre-styled axes using muted-foreground colors. Accepts all recharts props.",
				},
				{
					name: "Chart.Tooltip",
					type: "TooltipProps",
					description: "Themed tooltip with popover background and color dots.",
				},
				{
					name: "Chart.Legend",
					type: "LegendProps",
					description: "Pre-styled legend using muted-foreground text.",
				},
				{
					name: "Chart.PolarGrid / PolarAxis",
					type: "PolarGridProps / PolarAngleAxisProps",
					description: "Pre-styled polar chart primitives for Radar charts.",
				},
			]}
		/>
	);
}
