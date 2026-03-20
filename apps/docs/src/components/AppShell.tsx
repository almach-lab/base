import React, { lazy, Suspense } from "react";
import { BasedQueryProvider } from "@almach/query";
import { Toaster } from "@almach/ui";
import { ComponentDocSkeleton, GenericPageSkeleton, HomeSkeleton } from "./PageSkeleton";

// Page-level components (lazy loaded for code splitting)
const HomePage = lazy(() => import("./pages/home").then((m) => ({ default: m.HomePage })));
const GettingStartedPage = lazy(() =>
  import("./pages/getting-started").then((m) => ({ default: m.GettingStartedPage }))
);
const FormsPage = lazy(() => import("./pages/forms").then((m) => ({ default: m.FormsPage })));
const QueryPage = lazy(() => import("./pages/query").then((m) => ({ default: m.QueryPage })));
const ComponentsIndexPage = lazy(() =>
  import("./pages/components-index").then((m) => ({ default: m.ComponentsIndexPage }))
);

// Component doc pages (lazy loaded)
const componentPages: Record<string, React.LazyExoticComponent<() => React.JSX.Element>> = {
  alert: lazy(() => import("./pages/components/alert").then((m) => ({ default: m.AlertPage }))),
  avatar: lazy(() => import("./pages/components/avatar").then((m) => ({ default: m.AvatarPage }))),
  badge: lazy(() => import("./pages/components/badge").then((m) => ({ default: m.BadgePage }))),
  button: lazy(() => import("./pages/components/button").then((m) => ({ default: m.ButtonPage }))),
  calendar: lazy(() => import("./pages/components/calendar").then((m) => ({ default: m.CalendarPage }))),
  card: lazy(() => import("./pages/components/card").then((m) => ({ default: m.CardPage }))),
  carousel: lazy(() => import("./pages/components/carousel").then((m) => ({ default: m.CarouselPage }))),
  checkbox: lazy(() => import("./pages/components/checkbox").then((m) => ({ default: m.CheckboxPage }))),
  collapsible: lazy(() => import("./pages/components/collapsible").then((m) => ({ default: m.CollapsiblePage }))),
  command: lazy(() => import("./pages/components/command").then((m) => ({ default: m.CommandPage }))),
  combobox: lazy(() => import("./pages/components/combobox").then((m) => ({ default: m.ComboboxPage }))),
  "date-input": lazy(() => import("./pages/components/date-input").then((m) => ({ default: m.DateInputPage }))),
  dialog: lazy(() => import("./pages/components/dialog").then((m) => ({ default: m.DialogPage }))),
  drawer: lazy(() => import("./pages/components/drawer").then((m) => ({ default: m.DrawerPage }))),
  "dropdown-menu": lazy(() =>
    import("./pages/components/dropdown-menu").then((m) => ({ default: m.DropdownMenuPage }))
  ),
  group: lazy(() => import("./pages/components/group").then((m) => ({ default: m.GroupPage }))),
  input: lazy(() => import("./pages/components/input").then((m) => ({ default: m.InputPage }))),
  label: lazy(() => import("./pages/components/label").then((m) => ({ default: m.LabelPage }))),
  "layered-card": lazy(() =>
    import("./pages/components/layered-card").then((m) => ({ default: m.LayeredCardPage }))
  ),
  modal: lazy(() => import("./pages/components/modal").then((m) => ({ default: m.ModalPage }))),
  progress: lazy(() => import("./pages/components/progress").then((m) => ({ default: m.ProgressPage }))),
  radio: lazy(() => import("./pages/components/radio").then((m) => ({ default: m.RadioPage }))),
  select: lazy(() => import("./pages/components/select").then((m) => ({ default: m.SelectPage }))),
  separator: lazy(() => import("./pages/components/separator").then((m) => ({ default: m.SeparatorPage }))),
  skeleton: lazy(() => import("./pages/components/skeleton").then((m) => ({ default: m.SkeletonPage }))),
  switch: lazy(() => import("./pages/components/switch").then((m) => ({ default: m.SwitchPage }))),
  table: lazy(() => import("./pages/components/table").then((m) => ({ default: m.TablePage }))),
  tabs: lazy(() => import("./pages/components/tabs").then((m) => ({ default: m.TabsPage }))),
  "tag-input": lazy(() => import("./pages/components/tag-input").then((m) => ({ default: m.TagInputPage }))),
  textarea: lazy(() => import("./pages/components/textarea").then((m) => ({ default: m.TextareaPage }))),
  toast: lazy(() => import("./pages/components/toast").then((m) => ({ default: m.ToastPage }))),
  tooltip: lazy(() => import("./pages/components/tooltip").then((m) => ({ default: m.TooltipPage }))),
  chart: lazy(() => import("./pages/components/chart").then((m) => ({ default: m.ChartPage }))),
};

interface AppShellProps {
  page: "home" | "getting-started" | "forms" | "query" | "components" | "component";
  componentSlug?: string;
}

function PageContent({ page, componentSlug }: AppShellProps) {
  if (page === "home") return <HomePage />;
  if (page === "getting-started") return <GettingStartedPage />;
  if (page === "forms") return <FormsPage />;
  if (page === "query") return <QueryPage />;
  if (page === "components") return <ComponentsIndexPage />;
  if (page === "component" && componentSlug) {
    const Comp = componentPages[componentSlug];
    if (!Comp) return <div className="p-8 text-muted-foreground">Component not found: {componentSlug}</div>;
    return <Comp />;
  }
  return null;
}

function pageSkeleton(page: AppShellProps["page"]) {
  if (page === "home") return <HomeSkeleton />;
  if (page === "component") return <ComponentDocSkeleton />;
  return <GenericPageSkeleton />;
}

export function AppShell({ page, componentSlug }: AppShellProps) {
  return (
    <BasedQueryProvider>
      <Suspense fallback={pageSkeleton(page)}>
        <PageContent page={page} componentSlug={componentSlug} />
      </Suspense>
      <Toaster />
    </BasedQueryProvider>
  );
}
