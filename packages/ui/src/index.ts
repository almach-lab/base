/* ─── Components ──────────────────────────────────────────────────────────── */

export type { AlertVariant } from "./components/alert.js";
export { Alert } from "./components/alert.js";
export type { AvatarProps } from "./components/avatar.js";
export { Avatar, avatarVariants } from "./components/avatar.js";
export type { BadgeProps } from "./components/badge.js";
export { Badge, badgeVariants } from "./components/badge.js";
export type { ButtonProps } from "./components/button.js";
export { Button, buttonVariants } from "./components/button.js";
export type { CalendarProps } from "./components/calendar.js";
export { Calendar } from "./components/calendar.js";

export { Card, Group } from "./components/card.js";
export { Carousel } from "./components/carousel.js";
export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  // Helpers
  Cell,
  CHART_COLORS,
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
  // Series
  Line,
  // Chart roots
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
} from "./components/chart.js";

export { Checkbox } from "./components/checkbox.js";

export { Collapsible } from "./components/collapsible.js";

export { Command } from "./components/command.js";
export type {
  CurrencyDef,
  CurrencySelectorMode,
  CurrencyValue,
  InputCurrencyProps,
} from "./components/currency-input.js";
export {
  CURRENCIES,
  CurrencyFlagBadge,
  InputCurrency,
} from "./components/currency-input.js";
export { Dialog } from "./components/dialog.js";
export { Drawer } from "./components/drawer.js";
export { DropdownMenu } from "./components/dropdown-menu.js";
export type {
  DateInputProps,
  InputDateProps,
  InputProps,
} from "./components/input.js";
export { DateInput, Input } from "./components/input.js";

export { Label } from "./components/label.js";
export type { ViewComponent, ViewsRegistry } from "./components/modal.js";
export { Modal, useModal } from "./components/modal.js";

export { Popover } from "./components/popover.js";

export { Progress } from "./components/progress.js";

export { Radio } from "./components/radio.js";

export { ScrollArea, ScrollBar } from "./components/scroll-area.js";
export type {
  SelectSearchableOption,
  SelectSearchableProps,
} from "./components/select.js";
export { Select } from "./components/select.js";

export { Separator } from "./components/separator.js";
export { Sidebar, useSidebar } from "./components/sidebar.js";

export { Skeleton } from "./components/skeleton.js";
export type {
  SwipeActionProps,
  SwipeActionsProps,
  SwipeActionVariant,
  SwipeSide,
} from "./components/swipe-actions.js";
export { SwipeActions, useSwipeActions } from "./components/swipe-actions.js";
export type {
  SwipeButtonRootProps,
  SwipeButtonThumbProps,
} from "./components/swipe-button.js";
export { SwipeButton } from "./components/swipe-button.js";
export type { SwitchProps } from "./components/switch.js";
export { Switch } from "./components/switch.js";
export type { ColumnDef } from "./components/table.js";
export { Table } from "./components/table.js";

export {
  Tabs,
  tabsListVariants,
  tabsTriggerVariants,
} from "./components/tabs.js";
export type { TagInputProps } from "./components/tag-input.js";
export { TagInput } from "./components/tag-input.js";
export type { TextareaProps } from "./components/textarea.js";
export { Textarea } from "./components/textarea.js";
export type { ToastConfirmOptions, ToastOptions } from "./components/toast.js";
export { toast } from "./components/toast.js";
export { Toaster } from "./components/toaster.js";

export { Tooltip } from "./components/tooltip.js";
export { useCopyToClipboard } from "./hooks/use-copy-to-clipboard.js";
export { useIsMobile, useMediaQuery } from "./hooks/use-media-query.js";
/* ─── Hooks ───────────────────────────────────────────────────────────────── */
export { useToast } from "./hooks/use-toast.js";
