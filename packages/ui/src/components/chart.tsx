import { cn } from "@almach/utils";
import type * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// ── Chart color tokens ──────────────────────────────────────────────────────
// Defined in globals.css as --chart-1 … --chart-5
export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
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

const ChartTooltip = (props: React.ComponentProps<typeof Tooltip>) => (
  <Tooltip
    content={<ChartTooltipContent />}
    cursor={{ stroke: "var(--color-border)", strokeWidth: 1 }}
    {...props}
  />
);
ChartTooltip.displayName = "Chart.Tooltip";

const ChartGrid = (props: React.ComponentProps<typeof CartesianGrid>) => (
  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" {...props} />
);
ChartGrid.displayName = "Chart.Grid";

const ChartXAxis = (props: React.ComponentProps<typeof XAxis>) => (
  <XAxis
    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
    tickLine={false}
    axisLine={{ stroke: "var(--color-border)" }}
    {...props}
  />
);
ChartXAxis.displayName = "Chart.XAxis";

const ChartYAxis = (props: React.ComponentProps<typeof YAxis>) => (
  <YAxis
    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
    tickLine={false}
    axisLine={false}
    {...props}
  />
);
ChartYAxis.displayName = "Chart.YAxis";

const ChartLegend = (props: React.ComponentProps<typeof Legend>) => (
  <Legend
    wrapperStyle={{ fontSize: 12, color: "var(--color-muted-foreground)" }}
    {...props}
  />
);
ChartLegend.displayName = "Chart.Legend";

const ChartPolarGrid = (props: React.ComponentProps<typeof PolarGrid>) => (
  <PolarGrid stroke="var(--color-border)" {...props} />
);
ChartPolarGrid.displayName = "Chart.PolarGrid";

const ChartPolarAxis = (props: React.ComponentProps<typeof PolarAngleAxis>) => (
  <PolarAngleAxis
    tick={{ fill: "var(--color-muted-foreground)", fontSize: 12 }}
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
  Area,
  AreaChart,
  Bar,
  BarChart,
  // Re-export recharts helpers
  Cell,
  Chart,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartPolarAxis,
  ChartPolarGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  // Re-export recharts series
  Line,
  // Re-export recharts chart roots
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
};
