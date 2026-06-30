import { Avatar, Badge, Button, Card, Input, Switch } from "@almach/ui";
import { Bell, Search, Settings } from "lucide-react";

const SIDEBAR_ITEMS = [
  { label: "Overview", active: true },
  { label: "Components", active: false },
  { label: "Forms", active: false },
  { label: "Query", active: false },
] as const;

export function HeroPreview() {
  return (
    <div
      className="landing-preview-shell mx-auto w-full max-w-5xl"
      aria-hidden="true"
    >
      <div className="landing-preview-glow pointer-events-none absolute inset-0" />

      <div className="relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-2xl shadow-foreground/5">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/30 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-border" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-muted-foreground">
            workspace / settings-panel.tsx
          </span>
        </div>

        <div className="flex min-h-[320px] sm:min-h-[360px]">
          <aside className="hidden w-44 shrink-0 border-r border-border/60 bg-muted/20 p-3 sm:block">
            <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Navigation
            </p>
            <nav className="space-y-0.5">
              {SIDEBAR_ITEMS.map((item) => (
                <div
                  key={item.label}
                  className={
                    item.active
                      ? "rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-foreground"
                      : "rounded-md px-2.5 py-1.5 text-xs text-muted-foreground"
                  }
                >
                  {item.label}
                </div>
              ))}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="relative min-w-0 flex-1 max-w-xs">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                  aria-hidden="true"
                />
                <Input
                  placeholder="Search components…"
                  className="h-8 pl-8 text-xs"
                  readOnly
                  tabIndex={-1}
                />
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="ghost" size="icon-sm" tabIndex={-1}>
                  <Bell className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Button variant="ghost" size="icon-sm" tabIndex={-1}>
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Avatar className="h-7 w-7">
                  <Avatar.Fallback className="text-[10px]">AK</Avatar.Fallback>
                </Avatar>
              </div>
            </div>

            <Card className="flex-1">
              <Card.Header
                action={
                  <Badge variant="success" size="sm">
                    Live
                  </Badge>
                }
              >
                <Card.Title className="text-sm">
                  Notification preferences
                </Card.Title>
                <Card.Description className="text-xs">
                  Compose accessible UI with typed forms and query utilities.
                </Card.Description>
              </Card.Header>
              <Card.Content className="space-y-4 pb-5">
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium">Product updates</p>
                    <p className="text-[11px] text-muted-foreground">
                      Release notes and changelog
                    </p>
                  </div>
                  <Switch defaultSelected tabIndex={-1} />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-3 py-2.5">
                  <div>
                    <p className="text-xs font-medium">Security alerts</p>
                    <p className="text-[11px] text-muted-foreground">
                      Critical dependency advisories
                    </p>
                  </div>
                  <Switch defaultSelected tabIndex={-1} />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Button size="sm" tabIndex={-1}>
                    Save changes
                  </Button>
                  <Button variant="outline" size="sm" tabIndex={-1}>
                    Reset
                  </Button>
                </div>
              </Card.Content>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
