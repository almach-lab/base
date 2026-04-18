import {
  Area,
  Badge,
  Bar,
  Card,
  Cell,
  CHART_COLORS,
  Chart,
  Line,
  Pie,
  Progress,
  Radar,
  ReferenceLine,
} from "@almach/ui";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  CircleDollarSign,
  CreditCard,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import * as React from "react";

// ── Shared data ─────────────────────────────────────────────────────────────

const revenueData = [
  { month: "Jan", revenue: 4200, target: 4000 },
  { month: "Feb", revenue: 5100, target: 4500 },
  { month: "Mar", revenue: 4700, target: 5000 },
  { month: "Apr", revenue: 6300, target: 5500 },
  { month: "May", revenue: 7200, target: 6000 },
  { month: "Jun", revenue: 6800, target: 6500 },
];

const visitorData = [
  { day: "Mon", sessions: 820, conversions: 41 },
  { day: "Tue", sessions: 932, conversions: 56 },
  { day: "Wed", sessions: 1140, conversions: 80 },
  { day: "Thu", sessions: 987, conversions: 62 },
  { day: "Fri", sessions: 1350, conversions: 95 },
  { day: "Sat", sessions: 670, conversions: 33 },
  { day: "Sun", sessions: 590, conversions: 29 },
];

const categoryData = [
  { name: "Design", value: 32 },
  { name: "Engineering", value: 45 },
  { name: "Marketing", value: 15 },
  { name: "Operations", value: 8 },
];

const salesData = [
  { month: "Jan", b2b: 2400, b2c: 1800 },
  { month: "Feb", b2b: 3200, b2c: 1900 },
  { month: "Mar", b2b: 2800, b2c: 1900 },
  { month: "Apr", b2b: 3800, b2c: 2500 },
  { month: "May", b2b: 4200, b2c: 3000 },
  { month: "Jun", b2b: 3900, b2c: 2900 },
];

const radarData = [
  { subject: "Speed", current: 90, previous: 70 },
  { subject: "Quality", current: 75, previous: 85 },
  { subject: "Cost", current: 60, previous: 55 },
  { subject: "Support", current: 85, previous: 65 },
  { subject: "Scale", current: 70, previous: 60 },
];

const transactions = [
  {
    id: "TXN-001",
    name: "Acme Corp",
    amount: "+$4,200",
    status: "completed",
    time: "2m ago",
  },
  {
    id: "TXN-002",
    name: "Globex Inc",
    amount: "+$1,800",
    status: "completed",
    time: "18m ago",
  },
  {
    id: "TXN-003",
    name: "Initech",
    amount: "-$350",
    status: "refunded",
    time: "1h ago",
  },
  {
    id: "TXN-004",
    name: "Umbrella Ltd",
    amount: "+$9,100",
    status: "pending",
    time: "3h ago",
  },
  {
    id: "TXN-005",
    name: "Soylent Corp",
    amount: "+$670",
    status: "completed",
    time: "5h ago",
  },
];

const teamMetrics = [
  { name: "Velocity", value: 84, color: CHART_COLORS[0] },
  { name: "Code quality", value: 91, color: CHART_COLORS[1] },
  { name: "Test coverage", value: 67, color: CHART_COLORS[2] },
  { name: "Review speed", value: 72, color: CHART_COLORS[3] },
];

// ── Stat card component ─────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change,
  positive,
  icon: Icon,
}: {
  label: string;
  value: string;
  change: string;
  positive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card>
      <Card.Header
        className="pb-1"
        action={<Icon className="h-4 w-4 text-muted-foreground" />}
      >
        <Card.Description className="text-xs">{label}</Card.Description>
        <Card.Title className="text-xl">{value}</Card.Title>
      </Card.Header>
      <Card.Content>
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          {positive ? (
            <ArrowUpRight className="h-3 w-3 text-green-500" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <span
            className={
              positive
                ? "text-green-600 dark:text-green-400"
                : "text-red-600 dark:text-red-400"
            }
          >
            {change}
          </span>{" "}
          from last month
        </p>
      </Card.Content>
    </Card>
  );
}

// ── Blocks ──────────────────────────────────────────────────────────────────

function DashboardOverviewBlock() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total revenue"
          value="$45,231"
          change="+20.1%"
          positive
          icon={CircleDollarSign}
        />
        <StatCard
          label="Active users"
          value="2,350"
          change="+12.5%"
          positive
          icon={Users}
        />
        <StatCard
          label="New orders"
          value="189"
          change="+4.3%"
          positive
          icon={ShoppingCart}
        />
        <StatCard
          label="Churn rate"
          value="1.2%"
          change="-0.4%"
          positive={false}
          icon={TrendingUp}
        />
      </div>
      <Card>
        <Card.Header
          action={<BarChart3 className="h-4 w-4 text-muted-foreground" />}
        >
          <Card.Title className="text-sm">Revenue vs Target</Card.Title>
          <Card.Description className="text-xs">
            Monthly performance for H1 2025
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Chart.Container height={200} className="w-full">
            <Chart.Bar data={revenueData}>
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
              <ReferenceLine
                y={6000}
                stroke={CHART_COLORS[3]}
                strokeDasharray="4 4"
                label={{
                  value: "Target",
                  fill: CHART_COLORS[3],
                  fontSize: 11,
                  position: "insideTopRight",
                }}
              />
            </Chart.Bar>
          </Chart.Container>
        </Card.Content>
      </Card>
    </div>
  );
}

function AnalyticsPanelBlock() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <Card.Header>
          <Card.Title className="text-sm">Weekly Sessions</Card.Title>
          <Card.Description className="text-xs">
            Sessions and conversions by day
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Chart.Container height={200} className="w-full">
            <Chart.Area data={visitorData}>
              <defs>
                <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
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
              <Chart.XAxis dataKey="day" />
              <Chart.YAxis />
              <Chart.Tooltip />
              <Area
                dataKey="sessions"
                stroke={CHART_COLORS[0]}
                fill="url(#fillSessions)"
                strokeWidth={2}
              />
            </Chart.Area>
          </Chart.Container>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header>
          <Card.Title className="text-sm">Budget breakdown</Card.Title>
          <Card.Description className="text-xs">
            Allocation by department
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex items-center justify-center">
          <Chart.Container height={200} className="w-full">
            <Chart.Pie>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Chart.Tooltip />
              <Chart.Legend />
            </Chart.Pie>
          </Chart.Container>
        </Card.Content>
      </Card>
    </div>
  );
}

function RevenueTrackerBlock() {
  const total = revenueData.reduce((s, d) => s + d.revenue, 0);
  const prev = 28400;
  const pct = (((total - prev) / prev) * 100).toFixed(1);

  return (
    <Card>
      <Card.Header
        action={
          <Badge
            variant="outline"
            className="text-xs text-green-600 border-green-300 dark:text-green-400"
          >
            +{pct}%
          </Badge>
        }
      >
        <Card.Title className="text-sm">Revenue tracker</Card.Title>
        <Card.Description className="text-xs">
          H1 total:{" "}
          <span className="font-semibold text-foreground">
            ${total.toLocaleString()}
          </span>
        </Card.Description>
      </Card.Header>
      <Card.Content>
        <Chart.Container height={220} className="w-full">
          <Chart.Bar data={salesData}>
            <Chart.Grid />
            <Chart.XAxis dataKey="month" />
            <Chart.YAxis />
            <Chart.Tooltip />
            <Chart.Legend />
            <Bar dataKey="b2b" stackId="a" fill={CHART_COLORS[0]} />
            <Bar
              dataKey="b2c"
              stackId="a"
              fill={CHART_COLORS[1]}
              radius={[4, 4, 0, 0]}
            />
            <Line
              dataKey="b2b"
              stroke={CHART_COLORS[3]}
              strokeWidth={2}
              dot={false}
              type="monotone"
            />
          </Chart.Bar>
        </Chart.Container>
      </Card.Content>
    </Card>
  );
}

function ActivityFeedBlock() {
  return (
    <div className="grid gap-4 sm:grid-cols-5">
      <div className="sm:col-span-3">
        <Card className="h-full">
          <Card.Header
            action={<Activity className="h-4 w-4 text-muted-foreground" />}
          >
            <Card.Title className="text-sm">Session activity</Card.Title>
            <Card.Description className="text-xs">
              Sessions vs conversions this week
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <Chart.Container height={200} className="w-full">
              <Chart.Line data={visitorData}>
                <Chart.Grid />
                <Chart.XAxis dataKey="day" />
                <Chart.YAxis />
                <Chart.Tooltip />
                <Chart.Legend />
                <Line
                  dataKey="sessions"
                  stroke={CHART_COLORS[0]}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="conversions"
                  stroke={CHART_COLORS[1]}
                  strokeWidth={2}
                  dot={false}
                />
              </Chart.Line>
            </Chart.Container>
          </Card.Content>
        </Card>
      </div>

      <div className="sm:col-span-2">
        <Card className="h-full">
          <Card.Header
            action={<Bell className="h-4 w-4 text-muted-foreground" />}
          >
            <Card.Title className="text-sm">Recent transactions</Card.Title>
          </Card.Header>
          <Card.Content className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{tx.name}</p>
                  <p className="text-muted-foreground">{tx.time}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      tx.status === "completed"
                        ? "default"
                        : tx.status === "pending"
                          ? "outline"
                          : "destructive"
                    }
                    className="text-[10px] px-1.5 py-0"
                  >
                    {tx.status}
                  </Badge>
                  <span
                    className={
                      tx.amount.startsWith("+")
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}

function TeamPerformanceBlock() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <Card.Header>
          <Card.Title className="text-sm">Team radar</Card.Title>
          <Card.Description className="text-xs">
            Current vs previous quarter
          </Card.Description>
        </Card.Header>
        <Card.Content>
          <Chart.Container height={220} className="w-full">
            <Chart.Radar data={radarData}>
              <Chart.PolarGrid />
              <Chart.PolarAxis dataKey="subject" />
              <Radar
                dataKey="current"
                stroke={CHART_COLORS[0]}
                fill={CHART_COLORS[0]}
                fillOpacity={0.3}
              />
              <Radar
                dataKey="previous"
                stroke={CHART_COLORS[3]}
                fill={CHART_COLORS[3]}
                fillOpacity={0.2}
              />
              <Chart.Legend />
            </Chart.Radar>
          </Chart.Container>
        </Card.Content>
      </Card>

      <Card>
        <Card.Header
          action={<CreditCard className="h-4 w-4 text-muted-foreground" />}
        >
          <Card.Title className="text-sm">Engineering metrics</Card.Title>
          <Card.Description className="text-xs">
            Current sprint health
          </Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          {teamMetrics.map(({ name, value, color }) => (
            <div key={name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{name}</span>
                <span className="font-medium tabular-nums">{value}%</span>
              </div>
              <Progress
                value={value}
                className="h-1.5"
                style={{ "--progress-color": color } as React.CSSProperties}
              />
            </div>
          ))}
        </Card.Content>
      </Card>
    </div>
  );
}

// ── Block registry ──────────────────────────────────────────────────────────

interface Block {
  id: string;
  title: string;
  description: string;
  tags: string[];
  component: React.ComponentType;
  code: string;
}

const BLOCKS: Block[] = [
  {
    id: "dashboard-overview",
    title: "Dashboard Overview",
    description:
      "Four stat cards at the top with a revenue-vs-target bar chart below. Good starting point for any admin dashboard.",
    tags: ["Card", "Chart", "Badge"],
    component: DashboardOverviewBlock,
    code: `import { Card, Chart, CHART_COLORS, Bar, ReferenceLine, Badge } from "@almach/ui";
import { CircleDollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

// stat cards
<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
  <Card>
    <Card.Header action={<CircleDollarSign className="h-4 w-4 text-muted-foreground" />}>
      <Card.Description className="text-xs">Total revenue</Card.Description>
      <Card.Title className="text-xl">$45,231</Card.Title>
    </Card.Header>
    <Card.Content>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </Card.Content>
  </Card>
  {/* ...more stat cards */}
</div>

// chart card
<Card>
  <Card.Header>
    <Card.Title className="text-sm">Revenue vs Target</Card.Title>
  </Card.Header>
  <Card.Content>
    <Chart.Container height={200} className="w-full">
      <Chart.Bar data={data}>
        <Chart.Grid />
        <Chart.XAxis dataKey="month" />
        <Chart.YAxis />
        <Chart.Tooltip />
        <Bar dataKey="revenue" fill={CHART_COLORS[0]} radius={[4, 4, 0, 0]} />
        <ReferenceLine y={6000} stroke={CHART_COLORS[3]} strokeDasharray="4 4"
          label={{ value: "Target", fill: CHART_COLORS[3], fontSize: 11 }} />
      </Chart.Bar>
    </Chart.Container>
  </Card.Content>
</Card>`,
  },
  {
    id: "analytics-panel",
    title: "Analytics Panel",
    description:
      "Side-by-side area chart and donut chart for showing web analytics and budget breakdown.",
    tags: ["Card", "Chart", "Area", "Pie"],
    component: AnalyticsPanelBlock,
    code: `import { Card, Chart, CHART_COLORS, Area, Pie, Cell } from "@almach/ui";

<div className="grid gap-4 sm:grid-cols-2">
  {/* Area chart */}
  <Card>
    <Card.Header>
      <Card.Title className="text-sm">Weekly Sessions</Card.Title>
    </Card.Header>
    <Card.Content>
      <Chart.Container height={200} className="w-full">
        <Chart.Area data={data}>
          <defs>
            <linearGradient id="fillSessions" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={CHART_COLORS[0]} stopOpacity={0.3} />
              <stop offset="95%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Chart.Grid />
          <Chart.XAxis dataKey="day" />
          <Chart.YAxis />
          <Chart.Tooltip />
          <Area dataKey="sessions" stroke={CHART_COLORS[0]} fill="url(#fillSessions)" strokeWidth={2} />
        </Chart.Area>
      </Chart.Container>
    </Card.Content>
  </Card>

  {/* Donut chart */}
  <Card>
    <Card.Header>
      <Card.Title className="text-sm">Budget breakdown</Card.Title>
    </Card.Header>
    <Card.Content>
      <Chart.Container height={200} className="w-full">
        <Chart.Pie>
          <Pie data={categories} dataKey="value" nameKey="name"
            cx="50%" cy="50%" innerRadius={50} outerRadius={80}>
            {categories.map((_, i) => (
              <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
            ))}
          </Pie>
          <Chart.Tooltip />
          <Chart.Legend />
        </Chart.Pie>
      </Chart.Container>
    </Card.Content>
  </Card>
</div>`,
  },
  {
    id: "revenue-tracker",
    title: "Revenue Tracker",
    description:
      "Stacked bar chart combined with a trend line, showing B2B vs B2C revenue split per month.",
    tags: ["Card", "Chart", "Bar", "Line", "Badge"],
    component: RevenueTrackerBlock,
    code: `import { Card, Chart, CHART_COLORS, Bar, Line, Badge } from "@almach/ui";

<Card>
  <Card.Header action={<Badge variant="outline">+15.3%</Badge>}>
    <Card.Title className="text-sm">Revenue tracker</Card.Title>
  </Card.Header>
  <Card.Content>
    <Chart.Container height={220} className="w-full">
      <Chart.Bar data={data}>
        <Chart.Grid />
        <Chart.XAxis dataKey="month" />
        <Chart.YAxis />
        <Chart.Tooltip />
        <Chart.Legend />
        <Bar dataKey="b2b" stackId="a" fill={CHART_COLORS[0]} />
        <Bar dataKey="b2c" stackId="a" fill={CHART_COLORS[1]} radius={[4, 4, 0, 0]} />
        <Line dataKey="b2b" stroke={CHART_COLORS[3]} strokeWidth={2} dot={false} />
      </Chart.Bar>
    </Chart.Container>
  </Card.Content>
</Card>`,
  },
  {
    id: "activity-feed",
    title: "Activity Feed",
    description:
      "Multi-series line chart paired with a recent transactions list. Useful for live operational dashboards.",
    tags: ["Card", "Chart", "Line", "Badge"],
    component: ActivityFeedBlock,
    code: `import { Card, Chart, CHART_COLORS, Line, Badge } from "@almach/ui";
import { Activity, Bell } from "lucide-react";

<div className="grid gap-4 sm:grid-cols-5">
  {/* Chart */}
  <div className="sm:col-span-3">
    <Card>
      <Card.Header action={<Activity className="h-4 w-4 text-muted-foreground" />}>
        <Card.Title className="text-sm">Session activity</Card.Title>
      </Card.Header>
      <Card.Content>
        <Chart.Container height={200} className="w-full">
          <Chart.Line data={data}>
            <Chart.Grid />
            <Chart.XAxis dataKey="day" />
            <Chart.YAxis />
            <Chart.Tooltip />
            <Chart.Legend />
            <Line dataKey="sessions" stroke={CHART_COLORS[0]} strokeWidth={2} dot={false} />
            <Line dataKey="conversions" stroke={CHART_COLORS[1]} strokeWidth={2} dot={false} />
          </Chart.Line>
        </Chart.Container>
      </Card.Content>
    </Card>
  </div>

  {/* Transactions */}
  <div className="sm:col-span-2">
    <Card>
      <Card.Header action={<Bell className="h-4 w-4 text-muted-foreground" />}>
        <Card.Title className="text-sm">Recent transactions</Card.Title>
      </Card.Header>
      <Card.Content className="space-y-3">
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0">
              <p className="truncate font-medium">{tx.name}</p>
              <p className="text-muted-foreground">{tx.time}</p>
            </div>
            <Badge variant={tx.status === "completed" ? "default" : "outline"}>
              {tx.status}
            </Badge>
          </div>
        ))}
      </Card.Content>
    </Card>
  </div>
</div>`,
  },
  {
    id: "team-performance",
    title: "Team Performance",
    description:
      "Radar chart for multi-dimensional team comparison, paired with progress bars for sprint metrics.",
    tags: ["Card", "Chart", "Radar", "Progress"],
    component: TeamPerformanceBlock,
    code: `import { Card, Chart, CHART_COLORS, Radar, Progress } from "@almach/ui";

<div className="grid gap-4 sm:grid-cols-2">
  {/* Radar */}
  <Card>
    <Card.Header>
      <Card.Title className="text-sm">Team radar</Card.Title>
    </Card.Header>
    <Card.Content>
      <Chart.Container height={220} className="w-full">
        <Chart.Radar data={radarData}>
          <Chart.PolarGrid />
          <Chart.PolarAxis dataKey="subject" />
          <Radar dataKey="current" stroke={CHART_COLORS[0]} fill={CHART_COLORS[0]} fillOpacity={0.3} />
          <Radar dataKey="previous" stroke={CHART_COLORS[3]} fill={CHART_COLORS[3]} fillOpacity={0.2} />
          <Chart.Legend />
        </Chart.Radar>
      </Chart.Container>
    </Card.Content>
  </Card>

  {/* Progress metrics */}
  <Card>
    <Card.Header>
      <Card.Title className="text-sm">Engineering metrics</Card.Title>
    </Card.Header>
    <Card.Content className="space-y-4">
      {metrics.map(({ name, value }) => (
        <div key={name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{name}</span>
            <span className="font-medium">{value}%</span>
          </div>
          <Progress value={value} className="h-1.5" />
        </div>
      ))}
    </Card.Content>
  </Card>
</div>`,
  },
];

// ── Page ────────────────────────────────────────────────────────────────────

function BlockCard({ block }: { block: Block }) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const uid = React.useId();

  return (
    <section id={block.id} className="scroll-mt-20 space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{block.title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {block.description}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {block.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border/70 bg-card/40">
        <div
          role="tablist"
          aria-label={`${block.title} view`}
          className="flex items-center gap-1 border-b border-border/70 bg-muted/20 px-3 py-2"
        >
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              aria-controls={`${uid}-${t}`}
              id={`${uid}-tab-${t}`}
              onClick={() => setTab(t)}
              className={`cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 ${
                tab === t
                  ? "bg-background text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "preview" ? (
          <div
            id={`${uid}-preview`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-preview`}
            className="overflow-auto p-4 md:p-6"
          >
            <block.component />
          </div>
        ) : (
          <div
            id={`${uid}-code`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-code`}
            className="overflow-auto"
          >
            <pre className="p-4 text-xs leading-relaxed text-muted-foreground md:p-6">
              <code>{block.code}</code>
            </pre>
          </div>
        )}
      </div>
    </section>
  );
}

export function BlocksPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-12 px-4 py-8 md:px-5 md:py-9">
      <div className="space-y-2 border-b border-border/70 pb-6">
        <Badge variant="outline" className="w-fit font-mono text-[11px]">
          @almach/ui
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight md:text-[2.1rem]">
          Blocks
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Pre-built dashboard and layout blocks composing Card, Chart, Badge,
          Progress, and other components together. Copy and adapt them to your
          app.
        </p>
      </div>

      {BLOCKS.map((block) => (
        <BlockCard key={block.id} block={block} />
      ))}
    </div>
  );
}
