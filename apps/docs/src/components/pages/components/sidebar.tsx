import { Button, Sidebar } from "@almach/ui";
import {
  BookOpen,
  Inbox,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

const sidebarDemoClassName =
  "h-72 w-56 rounded-xl border border-sidebar-border/70 bg-sidebar/35 shadow-sm";

const sidebarLayoutDemoClassName =
  "flex h-80 w-full overflow-hidden rounded-xl border border-sidebar-border/70 bg-sidebar/25 shadow-sm";

export function SidebarPage() {
  return (
    <ComponentDoc
      name="Sidebar"
      description="A compact navigation sidebar with grouped items, nested submenus, and simple layout slots. Built on a context-driven provider with Ctrl/Cmd+B support and mobile overlay behavior for docs-style navigation."
      pkg="@almach/ui"
      examples={[
        {
          title: "Basic navigation",
          description: "Grouped links with active state and a compact sidebar shell.",
          centered: false,
          preview: <BasicNav />,
          code: `import { Sidebar } from "@almach/ui";
import { BookOpen, Inbox, LayoutDashboard, Settings } from "lucide-react";

export function AppSidebar() {
  return (
    <Sidebar.Provider>
      <Sidebar className="w-56 rounded-lg border">
        <Sidebar.Header className="border-b px-3 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground">
            My App
          </span>
        </Sidebar.Header>
        <Sidebar.Content className="p-2">
          <Sidebar.MenuItem>
            <Sidebar.MenuButton isActive>
              <LayoutDashboard className="size-4" />
              <span>Dashboard</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <Inbox className="size-4" />
              <span>Inbox</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <BookOpen className="size-4" />
              <span>Docs</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <Settings className="size-4" />
              <span>Settings</span>
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "With sub-menu",
          description: "Nested links inside a parent menu item.",
          centered: false,
          preview: <SubMenuNav />,
          code: `import { Sidebar } from "@almach/ui";
import { LayoutDashboard, Settings, Users } from "lucide-react";

export function TeamSidebar() {
  return (
    <Sidebar.MenuItem defaultOpen>
      <Sidebar.MenuButton isActive>
        <LayoutDashboard className="size-4" />
        <span>Dashboard</span>
      </Sidebar.MenuButton>
      <Sidebar.MenuSub isOpen>
        <a href="#">Members</a>
        <a href="#">Invites</a>
        <a href="#">Roles</a>
      </Sidebar.MenuSub>
    </Sidebar.MenuItem>
  );
}`,
        },
        {
          title: "Shell layout",
          description: "Use the sidebar inside a two-column app shell.",
          centered: false,
          preview: <ShellLayoutDemo />,
          code: `import { Sidebar } from "@almach/ui";
import { LayoutDashboard, Users, Settings } from "lucide-react";

export function ShellLayout() {
  return (
    <Sidebar.Provider contained defaultOpen>
      <div className="flex h-80 overflow-hidden rounded-xl border">
        <Sidebar className="w-56">
          <Sidebar.Header className="border-b px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Sidebar.Trigger />
              <span>Docs</span>
            </div>
          </Sidebar.Header>
          <Sidebar.Content className="p-2">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <LayoutDashboard className="size-4" />
                <span>Dashboard</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Users className="size-4" />
                <span>Team</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Settings className="size-4" />
                <span>Settings</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Content>
        </Sidebar>
        <main className="flex-1 p-4">Main content</main>
      </div>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "Header and footer",
          description: "Branding at the top and account actions at the bottom.",
          centered: false,
          preview: <HeaderFooterNav />,
          code: `import { Button, Sidebar } from "@almach/ui";
import { LayoutDashboard, Settings, Users } from "lucide-react";

export function AccountSidebar() {
  return (
    <Sidebar className="w-56 rounded-lg border">
      <Sidebar.Header className="border-b px-3 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-primary" />
          <span className="text-sm font-semibold">Acme Inc</span>
        </div>
      </Sidebar.Header>
      <Sidebar.Content className="p-2">
        <Sidebar.MenuItem>
          <Sidebar.MenuButton isActive>
            <LayoutDashboard className="size-4" />
            <span>Dashboard</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Users className="size-4" />
            <span>Team</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Settings className="size-4" />
            <span>Settings</span>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
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
    </Sidebar>
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
          name: "Sidebar › variant",
          type: '"sidebar" | "floating" | "inset"',
          default: '"sidebar"',
          description: "Visual style for the root sidebar container.",
        },
        {
          name: "Sidebar.MenuButton › isActive",
          type: "boolean",
          default: "false",
          description: "Highlights the button as the current page.",
        },
        {
          name: "Sidebar.MenuItem › defaultOpen",
          type: "boolean",
          default: "false",
          description: "Starts the menu item with its submenu open.",
        },
      ]}
    />
  );
}

function BasicNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className={sidebarDemoClassName}>
        <Sidebar.Header className="border-b px-3 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground">
            My App
          </span>
        </Sidebar.Header>
        <Sidebar.Content className="p-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard, active: true },
            { label: "Inbox", icon: Inbox },
            { label: "Docs", icon: BookOpen },
            { label: "Settings", icon: Settings },
          ].map(({ label, icon: Icon, active }) => (
            <Sidebar.MenuItem key={label}>
              <Sidebar.MenuButton isActive={active}>
                <Icon className="size-4" />
                <span>{label}</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          ))}
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function SubMenuNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className={sidebarDemoClassName}>
        <Sidebar.Header className="border-b px-3 py-2.5">
          <span className="text-xs font-semibold text-muted-foreground">
            Team
          </span>
        </Sidebar.Header>
        <Sidebar.Content className="p-2">
          <Sidebar.MenuItem defaultOpen>
            <Sidebar.MenuButton isActive>
              <Users className="size-4" />
              <span>Team</span>
            </Sidebar.MenuButton>
            <Sidebar.MenuSub isOpen>
              <a href="#">Members</a>
              <a href="#">Invites</a>
              <a href="#">Roles</a>
            </Sidebar.MenuSub>
          </Sidebar.MenuItem>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function ShellLayoutDemo() {
  return (
    <Sidebar.Provider contained defaultOpen>
      <div className={sidebarLayoutDemoClassName}>
        <Sidebar className="w-56">
          <Sidebar.Header className="border-b px-3 py-2.5">
            <div className="flex items-center gap-2">
              <Sidebar.Trigger />
              <span className="text-sm font-semibold">Docs</span>
            </div>
          </Sidebar.Header>
          <Sidebar.Content className="p-2">
            {[
              { label: "Dashboard", icon: LayoutDashboard, active: true },
              { label: "Team", icon: Users },
              { label: "Settings", icon: Settings },
            ].map(({ label, icon: Icon, active }) => (
              <Sidebar.MenuItem key={label}>
                <Sidebar.MenuButton isActive={active}>
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Content>
        </Sidebar>
        <main className="flex-1 p-4 text-sm text-muted-foreground">
          Main content
        </main>
      </div>
    </Sidebar.Provider>
  );
}

function HeaderFooterNav() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className="h-80 w-56 rounded-xl border border-sidebar-border/70 bg-sidebar/35 shadow-sm">
        <Sidebar.Header className="border-b border-sidebar-border/70 px-3 py-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-primary" />
            <span className="text-sm font-semibold">Acme Inc</span>
          </div>
        </Sidebar.Header>
        <Sidebar.Content className="p-2">
          {[
            { label: "Dashboard", icon: LayoutDashboard, active: true },
            { label: "Team", icon: Users },
            { label: "Settings", icon: Settings },
          ].map(({ label, icon: Icon, active }) => (
            <Sidebar.MenuItem key={label}>
              <Sidebar.MenuButton isActive={active}>
                <Icon className="size-4" />
                <span>{label}</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          ))}
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
