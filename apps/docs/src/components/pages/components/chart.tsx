import {
  Area,
  Bar,
  Cell,
  CHART_COLORS,
  Chart,
  Line,
  Pie,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
  Scatter,
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

const stackedData = [
  { month: "Jan", design: 1200, engineering: 2400, marketing: 600 },
  { month: "Feb", design: 1400, engineering: 2800, marketing: 900 },
  { month: "Mar", design: 1100, engineering: 2200, marketing: 1400 },
  { month: "Apr", design: 1600, engineering: 3100, marketing: 1600 },
  { month: "May", design: 1900, engineering: 3600, marketing: 1700 },
  { month: "Jun", design: 1700, engineering: 3300, marketing: 1800 },
];

const weeklyVisitors = [
  { day: "Mon", sessions: 820, bounceRate: 42 },
  { day: "Tue", sessions: 932, bounceRate: 38 },
  { day: "Wed", sessions: 1140, bounceRate: 35 },
  { day: "Thu", sessions: 987, bounceRate: 40 },
  { day: "Fri", sessions: 1350, bounceRate: 33 },
  { day: "Sat", sessions: 670, bounceRate: 55 },
  { day: "Sun", sessions: 590, bounceRate: 60 },
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

const scatterData = [
  { x: 10, y: 30, z: 200 },
  { x: 30, y: 20, z: 150 },
  { x: 45, y: 70, z: 300 },
  { x: 60, y: 40, z: 100 },
  { x: 75, y: 55, z: 250 },
  { x: 90, y: 80, z: 180 },
  { x: 20, y: 60, z: 220 },
  { x: 50, y: 90, z: 130 },
];

// ── Chart doc page ──────────────────────────────────────────────────────────
export function ChartPage() {
  return (
    <ComponentDoc
      name="Chart"
      description="Composable chart primitives including Line, Bar, Area, Pie, Radar, and Scatter charts with full theme integration via CSS variables."
      pkg="@almach/ui"
      examples={[
        {
          title: "Line Chart",
          description:
            "Multi-series line chart with a grid, axes, and tooltip.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Line data={monthly}>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Chart.Legend />
                <Line
                  dataKey="revenue"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="expenses"
                  stroke={CHART_COLORS[3]}
                  strokeWidth={2}
                  dot={false}
                />
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
    <Chart.Legend />
    <Line dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
    <Line dataKey="expenses" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
  </Chart.Line>
</Chart.Container>`,
        },
        {
          title: "Step Line Chart",
          description:
            "Line chart using step interpolation — great for showing discrete state changes over time.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Line data={monthly}>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Line
                  dataKey="revenue"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                  type="stepAfter"
                />
                <Line
                  dataKey="expenses"
                  stroke={CHART_COLORS[2]}
                  strokeWidth={2}
                  dot={false}
                  type="stepAfter"
                  strokeDasharray="4 4"
                />
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
    <Line dataKey="revenue" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} type="stepAfter" />
    <Line dataKey="expenses" stroke={CHART_COLORS[2]} strokeWidth={2} dot={false} type="stepAfter" strokeDasharray="4 4" />
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
                <Chart.Legend />
                <Bar
                  dataKey="revenue"
                  fill={CHART_COLORS[0]}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="expenses"
                  fill={CHART_COLORS[3]}
                  radius={[4, 4, 0, 0]}
                />
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
    <Chart.Legend />
    <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
    <Bar dataKey="expenses" fill={CHART_COLORS[3]} radius={[4, 4, 0, 0]} />
  </Chart.Bar>
</Chart.Container>`,
        },
        {
          title: "Stacked Bar Chart",
          description:
            "Bar chart with stacked series to show part-to-whole relationships.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Bar data={stackedData}>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Chart.Legend />
                <Bar
                  dataKey="engineering"
                  stackId="a"
                  fill={CHART_COLORS[0]}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="design"
                  stackId="a"
                  fill={CHART_COLORS[1]}
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="marketing"
                  stackId="a"
                  fill={CHART_COLORS[2]}
                  radius={[4, 4, 0, 0]}
                />
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
    <Chart.Legend />
    <Bar dataKey="engineering" stackId="a" fill={CHART_COLORS[0]} />
    <Bar dataKey="design" stackId="a" fill={CHART_COLORS[1]} />
    <Bar dataKey="marketing" stackId="a" fill={CHART_COLORS[2]} radius={[4, 4, 0, 0]} />
  </Chart.Bar>
</Chart.Container>`,
        },
        {
          title: "Horizontal Bar Chart",
          description:
            "Bar chart laid out horizontally — useful for ranking or comparing named categories.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Bar data={stackedData} layout="vertical">
                <Chart.Grid horizontal={false} />
                <Chart.XAxis type="number" />
                <Chart.YAxis type="category" dataKey="month" width={36} />
                <Chart.Tooltip />
                <Bar
                  dataKey="engineering"
                  fill={CHART_COLORS[0]}
                  radius={[0, 4, 4, 0]}
                />
              </Chart.Bar>
            </Chart.Container>
          ),
          code: `import { Chart, CHART_COLORS, Bar } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Bar data={data} layout="vertical">
    <Chart.Grid horizontal={false} />
    <Chart.XAxis type="number" />
    <Chart.YAxis type="category" dataKey="month" width={36} />
    <Chart.Tooltip />
    <Bar dataKey="engineering" fill={CHART_COLORS[0]} radius={[0, 4, 4, 0]} />
  </Chart.Bar>
</Chart.Container>`,
        },
        {
          title: "Composed Chart",
          description:
            "Combines bars and a line in one chart — ideal for showing volume alongside a trend.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Bar data={weeklyVisitors}>
                <Chart.Grid />
                <Chart.XAxis dataKey="day" />
                <Chart.YAxis yAxisId="left" />
                <Chart.YAxis yAxisId="right" orientation="right" />
                <Chart.Tooltip />
                <Chart.Legend />
                <Bar
                  yAxisId="left"
                  dataKey="sessions"
                  fill={CHART_COLORS[0]}
                  radius={[4, 4, 0, 0]}
                  fillOpacity={0.8}
                />
                <Line
                  yAxisId="right"
                  dataKey="bounceRate"
                  stroke={CHART_COLORS[3]}
                  strokeWidth={2}
                  dot={false}
                  type="monotone"
                />
                <ReferenceLine
                  yAxisId="right"
                  y={45}
                  stroke={CHART_COLORS[4]}
                  strokeDasharray="4 4"
                  label={{
                    value: "Target",
                    fill: CHART_COLORS[4],
                    fontSize: 11,
                  }}
                />
              </Chart.Bar>
            </Chart.Container>
          ),
          code: `import { Chart, CHART_COLORS, Bar, Line, ReferenceLine } from "@almach/ui";

<Chart.Container height={240}>
  <Chart.Bar data={data}>
    <Chart.Grid />
    <Chart.XAxis dataKey="day" />
    <Chart.YAxis yAxisId="left" />
    <Chart.YAxis yAxisId="right" orientation="right" />
    <Chart.Tooltip />
    <Chart.Legend />
    <Bar yAxisId="left" dataKey="sessions" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} fillOpacity={0.8} />
    <Line yAxisId="right" dataKey="bounceRate" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
    <ReferenceLine yAxisId="right" y={45} stroke={CHART_COLORS[4]} strokeDasharray="4 4"
      label={{ value: "Target", fill: CHART_COLORS[4], fontSize: 11 }} />
  </Chart.Bar>
</Chart.Container>`,
        },
        {
          title: "Area Chart",
          description: "Single-series area chart with gradient fill.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Area data={monthly}>
                <defs>
                  <linearGradient id="fillRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0}
                    />
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
          title: "Multi-series Area Chart",
          description:
            "Two overlapping area series with individual gradient fills.",
          centered: false,
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Area data={monthly}>
                <defs>
                  <linearGradient id="fillRev2" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS[0]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillExp2" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={CHART_COLORS[3]}
                      stopOpacity={0.25}
                    />
                    <stop
                      offset="95%"
                      stopColor={CHART_COLORS[3]}
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Chart.Grid />
                <Chart.XAxis dataKey="month" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Chart.Legend />
                <Area
                  dataKey="revenue"
                  stroke={CHART_COLORS[0]}
                  fill="url(#fillRev2)"
                  strokeWidth={2}
                />
                <Area
                  dataKey="expenses"
                  stroke={CHART_COLORS[3]}
                  fill="url(#fillExp2)"
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
        <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.25} />
        <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
      </linearGradient>
      <linearGradient id="fillExpenses" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor={CHART_COLORS[3]} stopOpacity={0.25} />
        <stop offset="95%" stopColor={CHART_COLORS[3]} stopOpacity={0} />
      </linearGradient>
    </defs>
    <Chart.Grid />
    <Chart.XAxis dataKey="month" />
    <Chart.YAxis />
    <Chart.Tooltip />
    <Chart.Legend />
    <Area dataKey="revenue" stroke={CHART_COLORS[0]} fill="url(#fillRevenue)" strokeWidth={2} />
    <Area dataKey="expenses" stroke={CHART_COLORS[3]} fill="url(#fillExpenses)" strokeWidth={2} />
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
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
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
                    <Cell
                      key={i}
                      fill={CHART_COLORS[i % CHART_COLORS.length]}
                    />
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
          description:
            "Radar chart for comparing multiple entities across dimensions.",
          preview: (
            <Chart.Container height={260} className="w-full">
              <Chart.Radar data={radarData}>
                <Chart.PolarGrid />
                <Chart.PolarAxis dataKey="subject" />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={false}
                  axisLine={false}
                />
                <Radar
                  dataKey="A"
                  stroke={CHART_COLORS[0]}
                  fill={CHART_COLORS[0]}
                  fillOpacity={0.25}
                />
                <Radar
                  dataKey="B"
                  stroke={CHART_COLORS[1]}
                  fill={CHART_COLORS[1]}
                  fillOpacity={0.25}
                />
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
        {
          title: "Scatter Chart",
          description:
            "Scatter plot for visualizing correlations between two numeric variables.",
          preview: (
            <Chart.Container height={240} className="w-full">
              <Chart.Scatter>
                <Chart.Grid />
                <Chart.XAxis dataKey="x" type="number" name="Effort" unit="h" />
                <Chart.YAxis dataKey="y" type="number" name="Impact" unit="%" />
                <Chart.Tooltip cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={scatterData}
                  fill={CHART_COLORS[0]}
                  fillOpacity={0.8}
                />
              </Chart.Scatter>
            </Chart.Container>
          ),
          code: `import { Chart, CHART_COLORS, Scatter } from "@almach/ui";

const data = [
  { x: 10, y: 30 }, { x: 30, y: 20 }, { x: 45, y: 70 },
  { x: 60, y: 40 }, { x: 75, y: 55 }, { x: 90, y: 80 },
];

<Chart.Container height={240}>
  <Chart.Scatter>
    <Chart.Grid />
    <Chart.XAxis dataKey="x" type="number" name="Effort" unit="h" />
    <Chart.YAxis dataKey="y" type="number" name="Impact" unit="%" />
    <Chart.Tooltip cursor={{ strokeDasharray: "3 3" }} />
    <Scatter data={data} fill={CHART_COLORS[0]} fillOpacity={0.8} />
  </Chart.Scatter>
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
          description:
            "5 theme-aware palette tokens mapped to --chart-1…5 CSS variables.",
        },
        {
          name: "Chart.Grid",
          type: "CartesianGridProps",
          description:
            "Pre-styled CartesianGrid. Accepts all recharts CartesianGrid props.",
        },
        {
          name: "Chart.XAxis / YAxis",
          type: "XAxisProps / YAxisProps",
          description:
            "Pre-styled axes using muted-foreground colors. Accepts all recharts props.",
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
