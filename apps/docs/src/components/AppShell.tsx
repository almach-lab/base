import { BasedQueryProvider } from "@almach/query";
import { Toaster } from "@almach/ui";
import React, { lazy, Suspense } from "react";
import {
  ComponentDocSkeleton,
  GenericPageSkeleton,
  HomeSkeleton,
} from "./PageSkeleton";

type PageComponent = React.ComponentType;

const HomePage = lazy(() =>
  import("./pages/home").then((m) => ({ default: m.HomePage })),
);
const GettingStartedPage = lazy(() =>
  import("./pages/getting-started").then((m) => ({
    default: m.GettingStartedPage,
  })),
);
const FormsPage = lazy(() =>
  import("./pages/forms").then((m) => ({ default: m.FormsPage })),
);
const QueryPage = lazy(() =>
  import("./pages/query").then((m) => ({ default: m.QueryPage })),
);
const ThemePage = lazy(() =>
  import("./pages/theme").then((m) => ({ default: m.ThemePage })),
);
const ComponentsIndexPage = lazy(() =>
  import("./pages/components-index").then((m) => ({
    default: m.ComponentsIndexPage,
  })),
);
const BlocksPage = lazy(() =>
  import("./pages/blocks").then((m) => ({ default: m.BlocksPage })),
);

/**
 * Component doc pages, resolved from the filesystem instead of a hand-written
 * map — the two used to drift apart. Each page module exports exactly one
 * component whose name ends in `Page`.
 */
const componentPageModules = import.meta.glob<Record<string, PageComponent>>(
  "./pages/components/*.tsx",
);

const componentPages: Record<
  string,
  React.LazyExoticComponent<PageComponent>
> = Object.fromEntries(
  Object.entries(componentPageModules).map(([path, load]) => {
    const slug = path.replace("./pages/components/", "").replace(/\.tsx$/, "");
    return [
      slug,
      lazy(async () => {
        const mod = await load();
        const entry = Object.entries(mod).find(([name]) =>
          name.endsWith("Page"),
        );
        if (!entry) {
          throw new Error(`${path} does not export a *Page component`);
        }
        return { default: entry[1] };
      }),
    ];
  }),
);

interface AppShellProps {
  page:
    | "home"
    | "getting-started"
    | "forms"
    | "query"
    | "theme"
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
  theme: ThemePage,
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
