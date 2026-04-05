/* ─── Components ──────────────────────────────────────────────────────────── */

export { Alert } from "./components/alert.js";
export type { AlertVariant } from "./components/alert.js";

export { Avatar, avatarVariants } from "./components/avatar.js";
export type { AvatarProps } from "./components/avatar.js";

export { Badge, badgeVariants } from "./components/badge.js";
export type { BadgeProps } from "./components/badge.js";

export { Button, buttonVariants } from "./components/button.js";
export type { ButtonProps } from "./components/button.js";

export { Calendar } from "./components/calendar.js";
export type { CalendarProps } from "./components/calendar.js";

export { Card, Group } from "./components/card.js";

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
	CHART_COLORS,
	// Chart roots
	LineChart,
	BarChart,
	AreaChart,
	PieChart,
	RadarChart,
	ScatterChart,
	// Series
	Line,
	Bar,
	Area,
	Pie,
	Radar,
	Scatter,
	// Helpers
	Cell,
	ResponsiveContainer,
	PolarGrid,
	PolarAngleAxis,
	PolarRadiusAxis,
} from "./components/chart.js";

export { Carousel } from "./components/carousel.js";

export { Checkbox } from "./components/checkbox.js";

export { Collapsible } from "./components/collapsible.js";

export { Command } from "./components/command.js";

export { Dialog } from "./components/dialog.js";

export { Drawer } from "./components/drawer.js";

export { DropdownMenu } from "./components/dropdown-menu.js";

export { Input, DateInput } from "./components/input.js";
export type { InputProps, InputDateProps, DateInputProps } from "./components/input.js";

export { InputCurrency, CURRENCIES, CurrencyFlagBadge } from "./components/currency-input.js";
export type { CurrencyDef, CurrencyValue, InputCurrencyProps, CurrencySelectorMode } from "./components/currency-input.js";

export { Label } from "./components/label.js";

export { Modal, useModal } from "./components/modal.js";
export type { ViewsRegistry, ViewComponent } from "./components/modal.js";

export { Popover } from "./components/popover.js";

export { Progress } from "./components/progress.js";

export { Radio } from "./components/radio.js";

export { ScrollArea, ScrollBar } from "./components/scroll-area.js";

export { Select } from "./components/select.js";
export type { SelectSearchableOption, SelectSearchableProps } from "./components/select.js";

export { Separator } from "./components/separator.js";

export { Skeleton } from "./components/skeleton.js";

export { SwipeActions, useSwipeActions } from "./components/swipe-actions.js";
export type { SwipeActionsProps, SwipeSide, SwipeActionProps, SwipeActionVariant } from "./components/swipe-actions.js";

export { SwipeButton } from "./components/swipe-button.js";
export type { SwipeButtonRootProps, SwipeButtonThumbProps } from "./components/swipe-button.js";

export { Switch } from "./components/switch.js";
export type { SwitchProps } from "./components/switch.js";

export { Table } from "./components/table.js";
export type { ColumnDef } from "./components/table.js";

export { Tabs, tabsListVariants, tabsTriggerVariants } from "./components/tabs.js";

export { TagInput } from "./components/tag-input.js";
export type { TagInputProps } from "./components/tag-input.js";

export { toast } from "./components/toast.js";
export type { ToastOptions, ToastConfirmOptions } from "./components/toast.js";

export { Toaster } from "./components/toaster.js";

export { Textarea } from "./components/textarea.js";
export type { TextareaProps } from "./components/textarea.js";

export { Tooltip } from "./components/tooltip.js";

/* ─── Hooks ───────────────────────────────────────────────────────────────── */
export { useToast } from "./hooks/use-toast.js";
export { useMediaQuery, useIsMobile } from "./hooks/use-media-query.js";
export { useCopyToClipboard } from "./hooks/use-copy-to-clipboard.js";
