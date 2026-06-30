/** Shared Tailwind layout tokens for the docs shell. */
export const docsLayout = {
  pageRoot: "flex min-h-dvh flex-col lg:h-dvh lg:min-h-0 lg:overflow-hidden",
  pageHeader:
    "sticky top-0 z-40 shrink-0 border-b border-border/40 bg-background/90 backdrop-blur-md",
  shell: "flex min-h-0 flex-1 w-full lg:overflow-hidden [&>*]:min-h-0",
  sidebar:
    "hidden w-68 min-h-0 shrink-0 flex-col border-r border-border/35 lg:flex",
  main: "min-w-0 flex-1 scroll-smooth scroll-fade no-scrollbar overflow-y-auto px-5 py-8 lg:px-10 lg:py-9",
  content: "mx-auto w-full max-w-3xl",
  toc: "hidden w-56 min-h-0 shrink-0 scroll-fade no-scrollbar overflow-y-auto py-8 pl-4 pr-6 lg:block",
  header:
    "grid h-14 w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 lg:grid-cols-[17rem_minmax(0,1fr)_auto] lg:gap-0 lg:px-0",
  headerBrand: "flex min-w-0 items-center gap-2 lg:px-4",
  headerMeta: "hidden min-w-0 items-center lg:flex lg:px-6",
  headerActions: "flex items-center justify-end gap-1 sm:gap-1.5 lg:pr-4",
  article: "flex flex-col gap-10",
  section: "flex flex-col gap-8",
  scrollAnchor: "scroll-mt-6",
  preview: "bg-background",
  mainFooter:
    "mx-auto mt-14 hidden max-w-3xl flex-col items-center justify-between gap-4 border-t border-border/35 pt-6 text-xs text-muted-foreground sm:flex-row lg:flex",
  globalFooter: "mt-auto border-t border-border/40 lg:hidden",
} as const;
