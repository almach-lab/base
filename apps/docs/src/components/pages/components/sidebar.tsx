import { Badge, Button, Sidebar } from "@almach/ui";
import {
  BookOpen,
  ChevronRight,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function SidebarPage() {
  return (
    <ComponentDoc
      name="Sidebar"
      description="A composable navigation sidebar with collapsible groups, nested sub-menus, badges, and action slots. Built on a context-driven Provider with Ctrl/Cmd+B keyboard shortcut. On mobile, the sidebar renders as a react-aria Modal overlay — giving you focus trap, Escape dismiss, and body scroll lock automatically."
      pkg="@almach/ui"
      examples={[
        {
          title: "Basic navigation",
          description: "Groups, labels, and menu buttons with active state.",
          centered: false,
          preview: <BasicNav />,
          code: `import { Sidebar } from "@almach/ui";
import { LayoutDashboard, Inbox, BookOpen, Settings } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar.Provider>
      <Sidebar collapsible="none" className="w-56 rounded-lg border">
        <Sidebar.Header className="px-2 pt-3 pb-1">
          <span className="px-2 text-xs font-semibold text-muted-foreground">
            My App
          </span>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild isActive>
                    <a href="/dashboard">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild>
                    <a href="/inbox">
                      <Inbox />
                      <span>Inbox</span>
                    </a>
                  </Sidebar.MenuButton>
                  <Sidebar.MenuBadge>4</Sidebar.MenuBadge>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild>
                    <a href="/docs">
                      <BookOpen />
                      <span>Docs</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild>
                    <a href="/settings">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "With sub-menu",
          description: "Nested items under a collapsible parent.",
          centered: false,
          preview: <SubMenuNav />,
          code: `<Sidebar.Menu>
  <Sidebar.MenuItem>
    <Sidebar.MenuButton asChild>
      <a href="#">
        <Users />
        <span>Team</span>
        <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </a>
    </Sidebar.MenuButton>
    <Sidebar.MenuSub>
      {["Members", "Invites", "Roles"].map((item) => (
        <Sidebar.MenuSubItem key={item}>
          <Sidebar.MenuSubButton asChild>
            <a href="#">{item}</a>
          </Sidebar.MenuSubButton>
        </Sidebar.MenuSubItem>
      ))}
    </Sidebar.MenuSub>
  </Sidebar.MenuItem>
</Sidebar.Menu>`,
        },
        {
          title: "Icon-collapse mode",
          description:
            "Ctrl/Cmd+B or the trigger collapses to icons. Tooltips reveal labels. The rail provides a drag handle.",
          centered: false,
          preview: <IconCollapseDemo />,
          code: `import { Sidebar } from "@almach/ui";
import { LayoutDashboard, Inbox, Users, BookOpen, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Inbox", icon: Inbox, href: "/inbox" },
  { label: "Team", icon: Users, href: "/team" },
  { label: "Docs", icon: BookOpen, href: "/docs" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function AppLayout({ children }) {
  return (
    <Sidebar.Provider>
      <Sidebar collapsible="icon">
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {items.map(({ label, icon: Icon, href }, i) => (
                  <Sidebar.MenuItem key={label}>
                    <Sidebar.MenuButton
                      asChild
                      isActive={i === 0}
                      tooltip={label}
                    >
                      <a href={href}>
                        <Icon />
                        <span>{label}</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Inset>
        <header className="flex h-12 items-center gap-2 border-b px-4">
          <Sidebar.Trigger />
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <main className="p-4">{children}</main>
      </Sidebar.Inset>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "With header and footer",
          description:
            "Header slot for branding, Footer slot for user profile or settings.",
          centered: false,
          preview: <HeaderFooterNav />,
          code: `<Sidebar collapsible="none" className="w-56 rounded-lg border">
  <Sidebar.Header className="border-b px-3 py-2.5">
    <div className="flex items-center gap-2">
      <div className="h-6 w-6 rounded bg-primary" />
      <span className="text-sm font-semibold">Acme Inc</span>
    </div>
  </Sidebar.Header>
  <Sidebar.Content>
    <Sidebar.Group>
      <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
      <Sidebar.GroupContent>
        <Sidebar.Menu>
          {/* menu items */}
        </Sidebar.Menu>
      </Sidebar.GroupContent>
    </Sidebar.Group>
  </Sidebar.Content>
  <Sidebar.Footer className="border-t px-3 py-2.5">
    <div className="flex items-center gap-2">
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-xs font-medium">
        AJ
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium">Alice Johnson</p>
        <p className="truncate text-[10px] text-muted-foreground">
          alice@example.com
        </p>
      </div>
      <Button variant="ghost" size="icon-sm">
        <Settings className="h-3.5 w-3.5" />
      </Button>
    </div>
  </Sidebar.Footer>
</Sidebar>`,
        },
        {
          title: "Astro layout integration",
          description:
            "How to wire the sidebar into an Astro docs-style layout with a mobile toggle in the header.",
          centered: false,
          preview: <AstroLayoutDemo />,
          code: `// layouts/Layout.astro
---
import { DocSidebar } from "../components/DocSidebar";
---
<header class="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
  <div class="flex h-14 items-center gap-2 px-4">
    <!-- Mobile toggle — dispatches a custom event the React island listens to -->
    <button
      id="sidebar-toggle"
      class="lg:hidden ..."
      aria-label="Open navigation"
      aria-expanded="false"
      aria-controls="doc-sidebar-mobile"
      onclick="window.dispatchEvent(new CustomEvent('almach-sidebar-toggle'))"
    >
      <!-- hamburger icon -->
    </button>
    <a href="/">My Site</a>
  </div>
</header>

<div class="flex flex-1">
  <!-- React island — handles mobile overlay + desktop sticky sidebar -->
  <DocSidebar currentPath={Astro.url.pathname} client:only="react" />

  <main class="min-w-0 flex-1">
    <slot />
  </main>
</div>

// components/DocSidebar.tsx
import { Sidebar } from "@almach/ui";
import { ModalOverlay, Modal, Dialog } from "react-aria-components";

export function DocSidebar({ currentPath }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Listen for the Astro header button
  React.useEffect(() => {
    const toggle = () => setMobileOpen((v) => !v);
    window.addEventListener("almach-sidebar-toggle", toggle);
    return () => window.removeEventListener("almach-sidebar-toggle", toggle);
  }, []);

  return (
    <>
      {/* Mobile — react-aria handles focus trap, Escape, scroll lock */}
      <ModalOverlay
        isOpen={mobileOpen}
        onOpenChange={setMobileOpen}
        className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm lg:hidden"
      >
        <Modal className="absolute inset-y-0 left-0 w-64 bg-sidebar shadow-xl">
          <Dialog aria-label="Navigation" className="flex h-full flex-col outline-none">
            <header className="flex items-center justify-between border-b px-4 py-3">
              <span className="font-semibold">My Site</span>
              <Sidebar.Close onClick={() => setMobileOpen(false)} />
            </header>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              {/* navigation items */}
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>

      {/* Desktop — sticky sidebar */}
      <aside class="hidden w-56 border-r bg-sidebar lg:flex lg:flex-col">
        <div class="sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto px-2 py-3">
          {/* navigation items */}
        </div>
      </aside>
    </>
  );
}`,
        },
      ]}
      props={[
        {
          name: "Sidebar.Provider › defaultOpen",
          type: "boolean",
          default: "true",
          description: "Initial open state for uncontrolled usage.",
        },
        {
          name: "Sidebar.Provider › open",
          type: "boolean",
          description: "Controlled open state.",
        },
        {
          name: "Sidebar.Provider › onOpenChange",
          type: "(open: boolean) => void",
          description: "Called when the sidebar opens or closes.",
        },
        {
          name: "Sidebar.Provider › sidebarWidth",
          type: "string",
          default: '"16rem"',
          description:
            "Custom sidebar width — sets the --sidebar-width CSS variable.",
        },
        {
          name: "Sidebar.Provider › sidebarWidthIcon",
          type: "string",
          default: '"3rem"',
          description:
            "Width when collapsed to icons — sets the --sidebar-width-icon CSS variable.",
        },
        {
          name: "Sidebar › side",
          type: '"left" | "right"',
          default: '"left"',
          description: "Which side the sidebar appears on.",
        },
        {
          name: "Sidebar › variant",
          type: '"sidebar" | "floating" | "inset"',
          default: '"sidebar"',
          description:
            "Visual style — sidebar sits flush, floating has a border + shadow, inset has a rounded inset look.",
        },
        {
          name: "Sidebar › collapsible",
          type: '"offcanvas" | "icon" | "none"',
          default: '"offcanvas"',
          description:
            "How the sidebar collapses — off-screen, to icon-only width, or not at all.",
        },
        {
          name: "Sidebar.MenuButton › isActive",
          type: "boolean",
          default: "false",
          description: "Highlights the button as the current page.",
        },
        {
          name: "Sidebar.MenuButton › variant",
          type: '"default" | "outline"',
          default: '"default"',
          description: "Visual style of the menu button.",
        },
        {
          name: "Sidebar.MenuButton › size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Height of the menu button.",
        },
        {
          name: "Sidebar.MenuButton › tooltip",
          type: "string | TooltipContentProps",
          description:
            "Tooltip shown when the sidebar is in icon-collapsed state.",
        },
        {
          name: "Sidebar.MenuAction › showOnHover",
          type: "boolean",
          default: "false",
          description: "Only shows the action button when the row is hovered.",
        },
        {
          name: "Sidebar.MenuSkeleton › showIcon",
          type: "boolean",
          default: "false",
          description: "Whether to include an icon-sized skeleton block.",
        },
      ]}
    />
  );
}

// ── Demos ──────────────────────────────────────────────────────────────────

function BasicNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar
        collapsible="none"
        className="h-72 w-56 rounded-lg border border-sidebar-border/70"
      >
        <Sidebar.Header className="px-2 pb-1 pt-3">
          <span className="px-2 text-xs font-semibold text-muted-foreground">
            My App
          </span>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {[
                  { label: "Dashboard", icon: LayoutDashboard, active: true },
                  { label: "Inbox", icon: Inbox, badge: "4" },
                  { label: "Docs", icon: BookOpen },
                  { label: "Settings", icon: Settings },
                ].map(({ label, icon: Icon, active, badge }) => (
                  <Sidebar.MenuItem key={label}>
                    <Sidebar.MenuButton asChild isActive={active}>
                      <a href="#">
                        <Icon />
                        <span>{label}</span>
                      </a>
                    </Sidebar.MenuButton>
                    {badge && (
                      <Sidebar.MenuBadge>
                        <Badge variant="secondary" className="h-4 text-[10px]">
                          {badge}
                        </Badge>
                      </Sidebar.MenuBadge>
                    )}
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function SubMenuNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar
        collapsible="none"
        className="h-72 w-56 rounded-lg border border-sidebar-border/70"
      >
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild isActive>
                    <a href="#">
                      <LayoutDashboard />
                      <span>Dashboard</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild>
                    <a href="#">
                      <Users />
                      <span>Team</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                    </a>
                  </Sidebar.MenuButton>
                  <Sidebar.MenuSub>
                    {["Members", "Invites", "Roles"].map((item) => (
                      <Sidebar.MenuSubItem key={item}>
                        <Sidebar.MenuSubButton asChild>
                          <a href="#">{item}</a>
                        </Sidebar.MenuSubButton>
                      </Sidebar.MenuSubItem>
                    ))}
                  </Sidebar.MenuSub>
                </Sidebar.MenuItem>
                <Sidebar.MenuItem>
                  <Sidebar.MenuButton asChild>
                    <a href="#">
                      <Settings />
                      <span>Settings</span>
                    </a>
                  </Sidebar.MenuButton>
                </Sidebar.MenuItem>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function IconCollapseDemo() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Inbox", icon: Inbox },
    { label: "Team", icon: Users },
    { label: "Docs", icon: BookOpen },
    { label: "Settings", icon: Settings },
  ];

  return (
    <Sidebar.Provider defaultOpen={false} contained>
      <div className="flex h-72 w-full overflow-hidden rounded-lg border border-sidebar-border/70">
        <Sidebar collapsible="icon">
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>App</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {navItems.map(({ label, icon: Icon }, i) => (
                    <Sidebar.MenuItem key={label}>
                      <Sidebar.MenuButton
                        asChild
                        isActive={i === 0}
                        tooltip={label}
                      >
                        <a href="#">
                          <Icon />
                          <span>{label}</span>
                        </a>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
          <Sidebar.Rail />
        </Sidebar>
        <Sidebar.Inset>
          <header className="flex h-10 items-center gap-2 border-b px-3">
            <Sidebar.Trigger />
            <span className="text-sm font-medium">Dashboard</span>
          </header>
          <div className="p-4 text-sm text-muted-foreground">
            Toggle with the rail or{" "}
            <kbd className="rounded border px-1 font-mono text-xs">⌘B</kbd>
          </div>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  );
}

function HeaderFooterNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar
        collapsible="none"
        className="h-80 w-56 rounded-lg border border-sidebar-border/70"
      >
        <Sidebar.Header className="border-b border-sidebar-border/70 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="text-sm font-semibold">Acme Inc</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content>
          <Sidebar.Group>
            <Sidebar.GroupLabel>Workspace</Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                {[
                  { label: "Dashboard", icon: LayoutDashboard, active: true },
                  { label: "Team", icon: Users },
                  { label: "Settings", icon: Settings },
                ].map(({ label, icon: Icon, active }) => (
                  <Sidebar.MenuItem key={label}>
                    <Sidebar.MenuButton asChild isActive={active}>
                      <a href="#">
                        <Icon />
                        <span>{label}</span>
                      </a>
                    </Sidebar.MenuButton>
                  </Sidebar.MenuItem>
                ))}
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Sidebar.Content>
        <Sidebar.Footer className="border-t border-sidebar-border/70 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
              AJ
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">Alice Johnson</p>
              <p className="truncate text-[10px] text-muted-foreground">
                alice@example.com
              </p>
            </div>
            <Button variant="ghost" size="icon-sm">
              <Settings className="h-3.5 w-3.5" />
            </Button>
          </div>
        </Sidebar.Footer>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function AstroLayoutDemo() {
  const [open, setOpen] = React.useState(true);

  const navItems = [
    { label: "Getting Started", href: "#", active: true },
    { label: "Components", href: "#" },
    { label: "Theming", href: "#" },
    { label: "API Reference", href: "#" },
  ];

  return (
    <Sidebar.Provider open={open} onOpenChange={setOpen} contained>
      <div className="flex h-80 w-full overflow-hidden rounded-lg border border-sidebar-border/70">
        <Sidebar collapsible="offcanvas">
          <Sidebar.Header className="flex-row items-center justify-between border-b border-sidebar-border/70 px-4 py-0 h-10">
            <span className="text-sm font-bold text-sidebar-foreground">
              Docs
            </span>
            <Sidebar.Close className="-mr-1" />
          </Sidebar.Header>
          <Sidebar.Content>
            <Sidebar.Group>
              <Sidebar.GroupLabel>Introduction</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  {navItems.map(({ label, href, active }) => (
                    <Sidebar.MenuItem key={label}>
                      <Sidebar.MenuButton asChild isActive={active} size="sm">
                        <a href={href}>
                          <span>{label}</span>
                        </a>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                  ))}
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar>
        <Sidebar.Inset className="min-h-0">
          <header className="flex h-10 items-center gap-2 border-b px-3">
            <Sidebar.Trigger />
            <span className="text-xs font-medium text-muted-foreground">
              Getting Started
            </span>
          </header>
          <div className="p-4 text-sm text-muted-foreground">
            Click the trigger to collapse / close the sidebar.
          </div>
        </Sidebar.Inset>
      </div>
    </Sidebar.Provider>
  );
}
