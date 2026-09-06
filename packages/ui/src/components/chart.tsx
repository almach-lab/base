import { cn } from "@almach/utils";
import * as React from "react";
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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cardVariants } from "./_styles.js";

/**
 * Charts.
 *
 * The wrappers carry the mark specs so callers do not restate them: 2px lines
 * with dots hidden and an 8px active marker, bars with a 4px rounded data-end
 * anchored to the baseline, a 2px surface gap between adjacent fills, and
 * recessive grid and axes. Pass any recharts prop to override.
 *
 * Series colours come from `CHART_COLORS`, assigned in fixed order and never
 * cycled — colour follows the entity, not its rank, so filtering a series out
 * must not repaint the others. Past five series, fold the tail into "Other" or
 * use small multiples rather than inventing a sixth hue.
 *
 * Never plot two different scales on one chart with two y-axes; use two charts
 * or index both to a common base.
 */

// ── Colour tokens ───────────────────────────────────────────────────────────
// Defined in globals.css as --chart-1 … --chart-5, stepped so every hue clears
// 3:1 against the surface and adjacent pairs stay apart under colour-vision
// deficiency. Dark mode has its own steps rather than lightened light ones.
export const CHART_COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
] as const;

/** The chart surface, used for the gaps and rings that separate marks. */
const SURFACE = "var(--color-background)";
const GRID = "var(--color-border)";
const INK_MUTED = "var(--color-muted-foreground)";

/** 8px marker with a 2px surface ring, so overlapping points stay readable. */
const ACTIVE_DOT = { r: 4, strokeWidth: 2, stroke: SURFACE } as const;

/** Rounded data-end, anchored to the baseline. */
const BAR_RADIUS: [number, number, number, number] = [4, 4, 0, 0];

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

// ── Tooltip ─────────────────────────────────────────────────────────────────
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
  /** Show a total row under the series. Useful for stacked charts. */
  showTotal?: boolean;
}

const ChartTooltipContent = ({
  active,
  payload,
  label,
  formatter,
  hideLabel,
  showTotal = false,
}: ChartTooltipContentProps) => {
  if (!active || !payload?.length) return null;

  const total = payload.reduce(
    (sum, entry) => sum + (typeof entry.value === "number" ? entry.value : 0),
    0,
  );

  return (
    <div
      className={cn(
        cardVariants(),
        "min-w-36 bg-popover px-3 py-2 text-sm text-popover-foreground shadow-md",
      )}
    >
      {!hideLabel && label != null && (
        <p className="mb-1.5 font-medium">{String(label)}</p>
      )}

      <div className="flex flex-col gap-1">
        {payload.map((entry, index) => {
          const raw = entry.value ?? 0;
          const [value, name] = formatter
            ? formatter(raw, entry.name ?? "")
            : [String(raw), entry.name ?? ""];

          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: payload order is the series order
              key={index}
              className="flex items-center gap-2"
            >
              {/* The swatch carries identity; the text stays in ink tokens. */}
              <span
                aria-hidden="true"
                className="size-2.5 shrink-0 rounded-sm"
                style={{ background: entry.color }}
              />
              <span className="text-muted-foreground">{name}</span>
              <span className="ml-auto font-medium tabular-nums">{value}</span>
            </div>
          );
        })}

        {showTotal && payload.length > 1 && (
          <div className="mt-1 flex items-center gap-2 border-t border-border pt-1">
            <span className="text-muted-foreground">Total</span>
            <span className="ml-auto font-medium tabular-nums">{total}</span>
          </div>
        )}
      </div>
    </div>
  );
};
ChartTooltipContent.displayName = "Chart.TooltipContent";

type TooltipProps = React.ComponentProps<typeof Tooltip>;

export interface ChartTooltipProps extends Omit<TooltipProps, "cursor"> {
  /**
   * Hover affordance. `line` is the crosshair for line and area charts,
   * `band` the highlight band for bar charts, `none` for pie and scatter.
   */
  cursor?: "line" | "band" | "none";
}

const CURSORS = {
  line: { stroke: GRID, strokeWidth: 1 },
  band: { fill: "var(--color-muted)", fillOpacity: 0.5, radius: 4 },
  none: false,
} as const;

const ChartTooltip = ({ cursor = "line", ...props }: ChartTooltipProps) => (
  <Tooltip
    content={<ChartTooltipContent />}
    cursor={CURSORS[cursor]}
    {...props}
  />
);
ChartTooltip.displayName = "Chart.Tooltip";

// ── Grid and axes ───────────────────────────────────────────────────────────

/** Horizontal hairlines only: vertical rules add noise without adding reading. */
const ChartGrid = (props: React.ComponentProps<typeof CartesianGrid>) => (
  <CartesianGrid
    vertical={false}
    stroke={GRID}
    strokeOpacity={0.6}
    {...props}
  />
);
ChartGrid.displayName = "Chart.Grid";

const ChartXAxis = (props: React.ComponentProps<typeof XAxis>) => (
  <XAxis
    tick={{ fill: INK_MUTED, fontSize: 12 }}
    tickLine={false}
    tickMargin={8}
    minTickGap={16}
    axisLine={{ stroke: GRID }}
    {...props}
  />
);
ChartXAxis.displayName = "Chart.XAxis";

const ChartYAxis = (props: React.ComponentProps<typeof YAxis>) => (
  <YAxis
    tick={{ fill: INK_MUTED, fontSize: 12 }}
    tickLine={false}
    tickMargin={8}
    axisLine={false}
    width={44}
    {...props}
  />
);
ChartYAxis.displayName = "Chart.YAxis";

// ── Legend ──────────────────────────────────────────────────────────────────

interface LegendEntry {
  value?: string;
  color?: string;
}

/**
 * Always render a legend for two or more series, so identity never rests on
 * colour alone. A single series needs none — the title names it.
 */
const ChartLegend = (props: React.ComponentProps<typeof Legend>) => (
  <Legend
    verticalAlign="bottom"
    height={32}
    content={({ payload }) => (
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-2">
        {(payload as LegendEntry[] | undefined)?.map((entry) => (
          <span
            key={entry.value}
            className="flex items-center gap-1.5 text-xs text-muted-foreground"
          >
            <span
              aria-hidden="true"
              className="size-2.5 shrink-0 rounded-sm"
              style={{ background: entry.color }}
            />
            {entry.value}
          </span>
        ))}
      </div>
    )}
    {...props}
  />
);
ChartLegend.displayName = "Chart.Legend";

const ChartPolarGrid = (props: React.ComponentProps<typeof PolarGrid>) => (
  <PolarGrid stroke={GRID} strokeOpacity={0.6} {...props} />
);
ChartPolarGrid.displayName = "Chart.PolarGrid";

const ChartPolarAxis = (props: React.ComponentProps<typeof PolarAngleAxis>) => (
  <PolarAngleAxis tick={{ fill: INK_MUTED, fontSize: 12 }} {...props} />
);
ChartPolarAxis.displayName = "Chart.PolarAxis";

// ── Series ──────────────────────────────────────────────────────────────────
// recharts 3 registers children through its store rather than by inspecting
// child types, so these wrappers compose exactly like the primitives do.

const ChartLineSeries = (props: React.ComponentProps<typeof Line>) => (
  <Line strokeWidth={2} dot={false} activeDot={ACTIVE_DOT} {...props} />
);
ChartLineSeries.displayName = "Chart.LineSeries";

const ChartAreaSeries = (props: React.ComponentProps<typeof Area>) => (
  <Area
    strokeWidth={2}
    fillOpacity={0.15}
    dot={false}
    activeDot={ACTIVE_DOT}
    {...props}
  />
);
ChartAreaSeries.displayName = "Chart.AreaSeries";

export interface ChartBarSeriesProps extends React.ComponentProps<typeof Bar> {
  /**
   * Adds a 2px surface gap between segments. Set for stacked bars; for a
   * horizontal layout pass `radius={[0, 4, 4, 0]}` so the rounded end still
   * lands at the data end.
   */
  stacked?: boolean;
}

const ChartBarSeries = ({ stacked, ...props }: ChartBarSeriesProps) => (
  <Bar
    radius={BAR_RADIUS}
    {...(stacked ? { stroke: SURFACE, strokeWidth: 2 } : {})}
    {...props}
  />
);
ChartBarSeries.displayName = "Chart.BarSeries";

const ChartPieSeries = (props: React.ComponentProps<typeof Pie>) => (
  <Pie stroke={SURFACE} strokeWidth={2} {...props} />
);
ChartPieSeries.displayName = "Chart.PieSeries";

const ChartRadarSeries = (props: React.ComponentProps<typeof Radar>) => (
  <Radar strokeWidth={2} fillOpacity={0.15} {...props} />
);
ChartRadarSeries.displayName = "Chart.RadarSeries";

const ChartScatterSeries = (props: React.ComponentProps<typeof Scatter>) => (
  <Scatter {...props} />
);
ChartScatterSeries.displayName = "Chart.ScatterSeries";

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
    // Series, pre-set to the mark specs
    LineSeries: ChartLineSeries,
    BarSeries: ChartBarSeries,
    AreaSeries: ChartAreaSeries,
    PieSeries: ChartPieSeries,
    RadarSeries: ChartRadarSeries,
    ScatterSeries: ChartScatterSeries,
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
  ChartAreaSeries,
  ChartBarSeries,
  ChartContainer,
  ChartGrid,
  ChartLegend,
  ChartLineSeries,
  ChartPieSeries,
  ChartPolarAxis,
  ChartPolarGrid,
  ChartRadarSeries,
  ChartScatterSeries,
  ChartTooltip,
  ChartTooltipContent,
  ChartXAxis,
  ChartYAxis,
  // Re-export recharts series, unstyled, as the escape hatch
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
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
};
