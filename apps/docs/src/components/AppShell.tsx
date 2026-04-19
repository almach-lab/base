import { BasedQueryProvider } from "@almach/query";
import { Toaster } from "@almach/ui";
import React, { lazy, Suspense } from "react";
import { BlocksPage } from "./pages/blocks";
import { ComponentsIndexPage } from "./pages/components-index";
import { FormsPage } from "./pages/forms";
import { GettingStartedPage } from "./pages/getting-started";
import { HomePage } from "./pages/home";
import { QueryPage } from "./pages/query";
import {
  ComponentDocSkeleton,
  GenericPageSkeleton,
  HomeSkeleton,
} from "./PageSkeleton";

type PageComponent = React.ComponentType;

// Component doc pages (lazy loaded)
const componentPages: Record<
  string,
  React.LazyExoticComponent<() => React.JSX.Element>
> = {
  alert: lazy(() =>
    import("./pages/components/alert").then((m) => ({ default: m.AlertPage })),
  ),
  avatar: lazy(() =>
    import("./pages/components/avatar").then((m) => ({
      default: m.AvatarPage,
    })),
  ),
  badge: lazy(() =>
    import("./pages/components/badge").then((m) => ({ default: m.BadgePage })),
  ),
  button: lazy(() =>
    import("./pages/components/button").then((m) => ({
      default: m.ButtonPage,
    })),
  ),
  calendar: lazy(() =>
    import("./pages/components/calendar").then((m) => ({
      default: m.CalendarPage,
    })),
  ),
  card: lazy(() =>
    import("./pages/components/card").then((m) => ({ default: m.CardPage })),
  ),
  carousel: lazy(() =>
    import("./pages/components/carousel").then((m) => ({
      default: m.CarouselPage,
    })),
  ),
  checkbox: lazy(() =>
    import("./pages/components/checkbox").then((m) => ({
      default: m.CheckboxPage,
    })),
  ),
  collapsible: lazy(() =>
    import("./pages/components/collapsible").then((m) => ({
      default: m.CollapsiblePage,
    })),
  ),
  command: lazy(() =>
    import("./pages/components/command").then((m) => ({
      default: m.CommandPage,
    })),
  ),
  dialog: lazy(() =>
    import("./pages/components/dialog").then((m) => ({
      default: m.DialogPage,
    })),
  ),
  drawer: lazy(() =>
    import("./pages/components/drawer").then((m) => ({
      default: m.DrawerPage,
    })),
  ),
  "dropdown-menu": lazy(() =>
    import("./pages/components/dropdown-menu").then((m) => ({
      default: m.DropdownMenuPage,
    })),
  ),
  input: lazy(() =>
    import("./pages/components/input").then((m) => ({ default: m.InputPage })),
  ),
  label: lazy(() =>
    import("./pages/components/label").then((m) => ({ default: m.LabelPage })),
  ),
  modal: lazy(() =>
    import("./pages/components/modal").then((m) => ({ default: m.ModalPage })),
  ),
  popover: lazy(() =>
    import("./pages/components/popover").then((m) => ({
      default: m.PopoverPage,
    })),
  ),
  progress: lazy(() =>
    import("./pages/components/progress").then((m) => ({
      default: m.ProgressPage,
    })),
  ),
  radio: lazy(() =>
    import("./pages/components/radio").then((m) => ({ default: m.RadioPage })),
  ),
  select: lazy(() =>
    import("./pages/components/select").then((m) => ({
      default: m.SelectPage,
    })),
  ),
  separator: lazy(() =>
    import("./pages/components/separator").then((m) => ({
      default: m.SeparatorPage,
    })),
  ),
  skeleton: lazy(() =>
    import("./pages/components/skeleton").then((m) => ({
      default: m.SkeletonPage,
    })),
  ),
  switch: lazy(() =>
    import("./pages/components/switch").then((m) => ({
      default: m.SwitchPage,
    })),
  ),
  table: lazy(() =>
    import("./pages/components/table").then((m) => ({ default: m.TablePage })),
  ),
  tabs: lazy(() =>
    import("./pages/components/tabs").then((m) => ({ default: m.TabsPage })),
  ),
  "tag-input": lazy(() =>
    import("./pages/components/tag-input").then((m) => ({
      default: m.TagInputPage,
    })),
  ),
  textarea: lazy(() =>
    import("./pages/components/textarea").then((m) => ({
      default: m.TextareaPage,
    })),
  ),
  toast: lazy(() =>
    import("./pages/components/toast").then((m) => ({ default: m.ToastPage })),
  ),
  "swipe-actions": lazy(() =>
    import("./pages/components/swipe-actions").then((m) => ({
      default: m.SwipeActionsPage,
    })),
  ),
  "swipe-button": lazy(() =>
    import("./pages/components/swipe-button").then((m) => ({
      default: m.SwipeButtonPage,
    })),
  ),
  "scroll-area": lazy(() =>
    import("./pages/components/scroll-area").then((m) => ({
      default: m.ScrollAreaPage,
    })),
  ),
  sidebar: lazy(() =>
    import("./pages/components/sidebar.tsx").then((m) => ({
      default: m.SidebarPage,
    })),
  ),
  tooltip: lazy(() =>
    import("./pages/components/tooltip").then((m) => ({
      default: m.TooltipPage,
    })),
  ),
  chart: lazy(() =>
    import("./pages/components/chart").then((m) => ({ default: m.ChartPage })),
  ),
  "currency-input": lazy(() =>
    import("./pages/components/currency-input").then((m) => ({
      default: m.CurrencyInputPage,
    })),
  ),
};

interface AppShellProps {
  page:
    | "home"
    | "getting-started"
    | "forms"
    | "query"
    | "components"
    | "component"
    | "blocks";
  componentSlug?: string;
}

type StaticPage = Exclude<AppShellProps["page"], "component">;

const staticPages: Record<StaticPage, PageComponent> = {
  home: HomePage,
  "getting-started": GettingStartedPage,
  forms: FormsPage,
  query: QueryPage,
  components: ComponentsIndexPage,
  blocks: BlocksPage,
};

class AppShellErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  override componentDidCatch(error: Error) {
    console.error("AppShell page render failed", error);
  }

  override render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-4xl px-4 py-10 md:px-8">
          <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-muted-foreground">
            Failed to render this page. Please refresh, and if the issue
            persists, check the browser console for details.
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function PageContent({ page, componentSlug }: AppShellProps) {
  if (page === "component" && componentSlug) {
    const Comp = componentPages[componentSlug];
    if (!Comp)
      return (
        <div className="p-8 text-muted-foreground">
          Component not found: {componentSlug}
        </div>
      );
    return <Comp />;
  }

  if (page !== "component") {
    const Page = staticPages[page];
    return <Page />;
  }

  return null;
}

function pageSkeleton(page: AppShellProps["page"]) {
  if (page === "home") return <HomeSkeleton />;
  if (page === "component") return <ComponentDocSkeleton />;
  return <GenericPageSkeleton />;
}

export function AppShell({ page, componentSlug }: AppShellProps) {
  const boundaryKey =
    page === "component" ? `component:${componentSlug ?? ""}` : page;

  return (
    <BasedQueryProvider>
      <AppShellErrorBoundary key={boundaryKey}>
        <Suspense fallback={pageSkeleton(page)}>
          <PageContent
            page={page}
            {...(componentSlug ? { componentSlug } : {})}
          />
        </Suspense>
      </AppShellErrorBoundary>
      <Toaster />
    </BasedQueryProvider>
  );
}
