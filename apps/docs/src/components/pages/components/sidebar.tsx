import { Button, Sidebar } from "@almach/ui";
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
      description="A compound navigation sidebar with collapsible groups, nested sub-menus, badges, and action slots. Built on top of a context-driven Provider that handles open/closed state and a Ctrl/Cmd+B keyboard shortcut."
      pkg="@almach/ui"
      examples={[
        {
          title: "Basic navigation",
          description: "Groups, labels, and menu buttons with active state.",
          centered: false,
          preview: <BasicNav />,
          code: `import { Sidebar } from "@almach/ui";
import { BookOpen, Inbox, LayoutDashboard, Settings } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Inbox",     icon: Inbox,           badge: "4" },
  { label: "Docs",      icon: BookOpen },
  { label: "Settings",  icon: Settings },
];

<Sidebar.Provider>
  <Sidebar collapsible="none" className="w-56 rounded-lg border">
    <Sidebar.Header className="px-4 pb-1 pt-3">
      <span className="text-xs font-semibold text-muted-foreground">My App</span>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            {items.map(({ label, icon: Icon, active, badge }) => (
              <Sidebar.MenuItem key={label}>
                <Sidebar.MenuButton asChild isActive={active}>
                  <a href="#">
                    <Icon />
                    <span>{label}</span>
                  </a>
                </Sidebar.MenuButton>
                {badge && <Sidebar.MenuBadge>{badge}</Sidebar.MenuBadge>}
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar>
</Sidebar.Provider>`,
        },
        {
          title: "With sub-menu",
          description: "Nested items under a collapsible parent.",
          centered: false,
          preview: <SubMenuNav />,
          code: `import { Sidebar } from "@almach/ui";
import { ChevronRight, LayoutDashboard, Settings, Users } from "lucide-react";

<Sidebar.Provider>
  <Sidebar collapsible="none" className="w-56 rounded-lg border">
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Main</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton asChild isActive>
                <a href="#"><LayoutDashboard /><span>Dashboard</span></a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton asChild>
                <a href="#">
                  <Users /><span>Team</span>
                  <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
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
                <a href="#"><Settings /><span>Settings</span></a>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar>
</Sidebar.Provider>`,
        },
        {
          title: "Icon-collapse mode",
          description:
            "Click the rail or press Ctrl/Cmd+B to collapse to icon-only width. Tooltips reveal labels when collapsed.",
          centered: false,
          preview: <IconCollapseDemo />,
          code: `import { Sidebar } from "@almach/ui";
import { BookOpen, Inbox, LayoutDashboard, Settings, Users } from "lucide-react";

const items = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Inbox",     icon: Inbox },
  { label: "Team",      icon: Users },
  { label: "Docs",      icon: BookOpen },
  { label: "Settings",  icon: Settings },
];

<Sidebar.Provider>
  <div className="flex h-72 overflow-hidden rounded-lg border">
    <Sidebar collapsible="icon">
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>App</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <Sidebar.Menu>
              {items.map(({ label, icon: Icon }, i) => (
                <Sidebar.MenuItem key={label}>
                  <Sidebar.MenuButton asChild isActive={i === 0} tooltip={label}>
                    <a href="#"><Icon /><span>{label}</span></a>
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
    </Sidebar.Inset>
  </div>
</Sidebar.Provider>`,
        },
        {
          title: "With header and footer",
          description:
            "Header slot for branding, Footer slot for user profile or settings.",
          centered: false,
          preview: <HeaderFooterNav />,
          code: `import { Button, Sidebar } from "@almach/ui";
import { LayoutDashboard, Settings, Users } from "lucide-react";

<Sidebar.Provider>
  <Sidebar collapsible="none" className="w-56 rounded-lg border">
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
            {[
              { label: "Dashboard", icon: LayoutDashboard, active: true },
              { label: "Team",      icon: Users },
              { label: "Settings",  icon: Settings },
            ].map(({ label, icon: Icon, active }) => (
              <Sidebar.MenuItem key={label}>
                <Sidebar.MenuButton asChild isActive={active}>
                  <a href="#"><Icon /><span>{label}</span></a>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
    <Sidebar.Footer className="border-t px-3 py-2.5">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
          AJ
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium">Alice Johnson</p>
          <p className="truncate text-[10px] text-muted-foreground">alice@example.com</p>
        </div>
        <Button variant="ghost" size="icon-sm">
          <Settings className="h-3.5 w-3.5" />
        </Button>
      </div>
    </Sidebar.Footer>
  </Sidebar>
</Sidebar.Provider>`,
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
          name: "Sidebar.Provider › mobileBreakpoint",
          type: "number",
          default: "768",
          description:
            "Max-width in px below which the sidebar switches to mobile overlay mode.",
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
        <Sidebar.Header className="px-4 pb-1 pt-3">
          <span className="text-xs font-semibold text-muted-foreground">
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
                    {badge && <Sidebar.MenuBadge>{badge}</Sidebar.MenuBadge>}
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
                      <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-50" />
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
    <Sidebar.Provider contained>
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
            Click the rail or press{" "}
            <kbd className="rounded border px-1 font-mono text-xs">⌘B</kbd> to
            collapse.
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
