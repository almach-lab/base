import { Badge, Button, Sidebar } from "@almach/ui";
import {
  Bell,
  BookOpen,
  Briefcase,
  Compass,
  CreditCard,
  FileText,
  FolderKanban,
  HelpCircle,
  Inbox,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  Users,
} from "lucide-react";
import type * as React from "react";
import { ComponentDoc } from "../../component-doc";

const previewSidebarClassName =
  "h-[24rem] w-[17rem] rounded-2xl border border-sidebar-border/70 bg-sidebar shadow-sm";

const shellPreviewClassName =
  "flex h-[28rem] w-full overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm";

type NavItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
};

const productItems: NavItem[] = [
  { label: "Overview", icon: LayoutDashboard, active: true },
  { label: "Inbox", icon: Inbox },
  { label: "Projects", icon: FolderKanban },
  { label: "Messages", icon: MessageSquare },
];

const workspaceItems: NavItem[] = [
  { label: "Team", icon: Users, active: true },
  { label: "Billing", icon: CreditCard },
  { label: "Docs", icon: BookOpen },
  { label: "Settings", icon: Settings },
];

export function SidebarPage() {
  return (
    <ComponentDoc
      name="Sidebar"
      description="A clean navigation sidebar for product apps, docs shells, and account settings layouts. The component supports compact collapse, mobile overlays, nested navigation, and contained app-shell layouts without awkward motion."
      pkg="@almach/ui"
      examples={[
        {
          title: "Product navigation",
          description:
            "A clean product sidebar with grouped destinations and strong visual hierarchy.",
          centered: false,
          preview: <ProductSidebarPreview />,
          code: `import { Sidebar } from "@almach/ui";
import { FolderKanban, Inbox, LayoutDashboard, MessageSquare } from "lucide-react";

export function ProductSidebar() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className="h-96 w-68 rounded-2xl border border-sidebar-border/70 bg-sidebar shadow-sm">
        <Sidebar.Header className="border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Almach Studio</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                Product workspace
              </p>
            </div>
          </div>
        </Sidebar.Header>
        <Sidebar.Content className="space-y-6 px-3 py-4">
          <div className="space-y-1">
            <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
              Core
            </p>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <LayoutDashboard className="size-4" />
                <span>Overview</span>
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
                <FolderKanban className="size-4" />
                <span>Projects</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <MessageSquare className="size-4" />
                <span>Messages</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </div>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "Nested workspace menu",
          description:
            "A parent section with a calm, readable nested structure for teams and workspace tools.",
          centered: false,
          preview: <NestedSidebarPreview />,
          code: `import { Sidebar } from "@almach/ui";
import { Briefcase, CreditCard, Settings, Users } from "lucide-react";

export function WorkspaceSidebar() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className="h-96 w-68 rounded-2xl border border-sidebar-border/70 bg-sidebar shadow-sm">
        <Sidebar.Header className="border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sidebar-foreground">
              <Briefcase className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Operations</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                Internal workspace
              </p>
            </div>
          </div>
        </Sidebar.Header>
        <Sidebar.Content className="px-3 py-4">
          <Sidebar.MenuItem defaultOpen>
            <Sidebar.MenuButton isActive>
              <Users className="size-4" />
              <span>Team</span>
            </Sidebar.MenuButton>
            <Sidebar.MenuSub isOpen>
              <a href="#" className="rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Members
              </a>
              <a href="#" className="rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Roles
              </a>
              <a href="#" className="rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                Permissions
              </a>
            </Sidebar.MenuSub>
          </Sidebar.MenuItem>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton>
              <CreditCard className="size-4" />
              <span>Billing</span>
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
          title: "Inset app shell",
          description:
            "A realistic application shell with a collapsible inset sidebar and a clean content canvas.",
          centered: false,
          preview: <InsetShellPreview />,
          code: `import { Badge, Sidebar } from "@almach/ui";
import { Compass, FileText, LayoutDashboard, Sparkles } from "lucide-react";

export function InsetSidebarShell() {
  return (
    <Sidebar.Provider contained defaultOpen>
      <div className="flex h-[28rem] overflow-hidden rounded-2xl border border-border/70 bg-background shadow-sm">
        <Sidebar variant="inset" className="m-3">
          <Sidebar.Header className="gap-3 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Atlas</p>
                <p className="truncate text-xs text-sidebar-foreground/65">
                  Product docs
                </p>
              </div>
              <Sidebar.Trigger />
            </div>
            <Badge variant="outline" className="w-fit text-[10px]">
              Live
            </Badge>
          </Sidebar.Header>
          <Sidebar.Content className="px-2 pb-3">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <LayoutDashboard className="size-4" />
                <span>Overview</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Compass className="size-4" />
                <span>Explore</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <FileText className="size-4" />
                <span>Documents</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Content>
        </Sidebar>
        <main className="flex-1 p-5">
          <div className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Overview</h2>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Build calm app shells with a contained sidebar and a content region that stays visually balanced.
            </p>
          </div>
        </main>
      </div>
    </Sidebar.Provider>
  );
}`,
        },
        {
          title: "Workspace and account",
          description:
            "A fuller layout with account controls, utility links, and a stable footer section.",
          centered: false,
          preview: <WorkspaceSidebarPreview />,
          code: `import { Button, Sidebar } from "@almach/ui";
import { Bell, BookOpen, HelpCircle, Settings, Users } from "lucide-react";

export function WorkspaceAccountSidebar() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className="h-96 w-68 rounded-2xl border border-sidebar-border/70 bg-sidebar shadow-sm">
        <Sidebar.Header className="gap-3 border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-primary">
              AJ
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Alice Johnson</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                alice@example.com
              </p>
            </div>
          </div>
        </Sidebar.Header>
        <Sidebar.Content className="space-y-6 px-3 py-4">
          <div className="space-y-1">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <Users className="size-4" />
                <span>Team</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Bell className="size-4" />
                <span>Notifications</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <BookOpen className="size-4" />
                <span>Guides</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </div>
        </Sidebar.Content>
        <Sidebar.Footer className="space-y-2 border-t border-sidebar-border/60 px-3 py-3">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="size-4" />
            Preferences
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="size-4" />
            Help center
          </Button>
        </Sidebar.Footer>
      </Sidebar>
    </Sidebar.Provider>
  );
}`,
        },
      ]}
      props={[
        {
          name: "Sidebar.Provider › defaultOpen",
          type: "boolean",
          default: "true",
          description: "Initial desktop open state for uncontrolled usage.",
        },
        {
          name: "Sidebar.Provider › open",
          type: "boolean",
          description: "Controlled desktop open state.",
        },
        {
          name: "Sidebar.Provider › openMobile",
          type: "boolean",
          description: "Controlled mobile overlay state.",
        },
        {
          name: "Sidebar › variant",
          type: '"sidebar" | "floating" | "inset"',
          default: '"sidebar"',
          description:
            "Chooses a standard rail, floating panel, or inset shell.",
        },
        {
          name: "Sidebar.MenuButton › isActive",
          type: "boolean",
          default: "false",
          description: "Highlights the current destination.",
        },
        {
          name: "Sidebar.MenuItem › defaultOpen",
          type: "boolean",
          default: "false",
          description: "Starts a nested section expanded.",
        },
      ]}
    />
  );
}

function ProductSidebarPreview() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className={previewSidebarClassName}>
        <Sidebar.Header className="border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
              A
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Almach Studio</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                Product workspace
              </p>
            </div>
          </div>
        </Sidebar.Header>

        <Sidebar.Content className="space-y-6 px-3 py-4">
          <SidebarSection title="Core">
            {productItems.map(({ label, icon: Icon, active }) => (
              <Sidebar.MenuItem key={label}>
                <Sidebar.MenuButton isActive={active}>
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </SidebarSection>

          <SidebarSection title="Utility">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Bell className="size-4" />
                <span>Notifications</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <HelpCircle className="size-4" />
                <span>Support</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </SidebarSection>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function NestedSidebarPreview() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className={previewSidebarClassName}>
        <Sidebar.Header className="border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted text-sidebar-foreground">
              <Briefcase className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Operations</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                Internal workspace
              </p>
            </div>
          </div>
        </Sidebar.Header>

        <Sidebar.Content className="space-y-6 px-3 py-4">
          <SidebarSection title="Workspace">
            <Sidebar.MenuItem defaultOpen>
              <Sidebar.MenuButton isActive>
                <Users className="size-4" />
                <span>Team</span>
              </Sidebar.MenuButton>
              <Sidebar.MenuSub isOpen>
                <SidebarSubLink href="#">Members</SidebarSubLink>
                <SidebarSubLink href="#">Roles</SidebarSubLink>
                <SidebarSubLink href="#">Permissions</SidebarSubLink>
              </Sidebar.MenuSub>
            </Sidebar.MenuItem>
            {workspaceItems.slice(1).map(({ label, icon: Icon }) => (
              <Sidebar.MenuItem key={label}>
                <Sidebar.MenuButton>
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Sidebar.MenuButton>
              </Sidebar.MenuItem>
            ))}
          </SidebarSection>
        </Sidebar.Content>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function InsetShellPreview() {
  return (
    <Sidebar.Provider contained defaultOpen>
      <div className={shellPreviewClassName}>
        <Sidebar variant="inset" className="m-3">
          <Sidebar.Header className="gap-3 px-3 py-3">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Atlas</p>
                <p className="truncate text-xs text-sidebar-foreground/65">
                  Product docs
                </p>
              </div>
              <Sidebar.Trigger />
            </div>
            <Badge variant="outline" className="w-fit text-[10px]">
              Live
            </Badge>
          </Sidebar.Header>

          <Sidebar.Content className="px-2 pb-3">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <LayoutDashboard className="size-4" />
                <span>Overview</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Compass className="size-4" />
                <span>Explore</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <FileText className="size-4" />
                <span>Documents</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Content>

          <Sidebar.Footer className="px-2 py-2">
            <Button variant="ghost" className="w-full justify-start">
              <Sparkles className="size-4" />
              Quick actions
            </Button>
          </Sidebar.Footer>
        </Sidebar>

        <main className="flex-1 p-5">
          <div className="h-full rounded-2xl border border-border/70 bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h2 className="text-base font-semibold">Overview</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              This example shows a contained app shell with an inset sidebar
              that feels lighter than a full-height rail and collapses without
              jumpy layout shifts.
            </p>
          </div>
        </main>
      </div>
    </Sidebar.Provider>
  );
}

function WorkspaceSidebarPreview() {
  return (
    <Sidebar.Provider contained>
      <Sidebar className={previewSidebarClassName}>
        <Sidebar.Header className="gap-3 border-b border-sidebar-border/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12 text-sm font-semibold text-primary">
              AJ
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">Alice Johnson</p>
              <p className="truncate text-xs text-sidebar-foreground/65">
                alice@example.com
              </p>
            </div>
          </div>
        </Sidebar.Header>

        <Sidebar.Content className="space-y-6 px-3 py-4">
          <SidebarSection title="Workspace">
            <Sidebar.MenuItem>
              <Sidebar.MenuButton isActive>
                <Users className="size-4" />
                <span>Team</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Bell className="size-4" />
                <span>Notifications</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <BookOpen className="size-4" />
                <span>Guides</span>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </SidebarSection>
        </Sidebar.Content>

        <Sidebar.Footer className="space-y-2 border-t border-sidebar-border/60 px-3 py-3">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="size-4" />
            Preferences
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="size-4" />
            Help center
          </Button>
        </Sidebar.Footer>
      </Sidebar>
    </Sidebar.Provider>
  );
}

function SidebarSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/45">
        {title}
      </p>
      {children}
    </div>
  );
}

function SidebarSubLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="rounded-md px-2 py-1.5 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
    >
      {children}
    </a>
  );
}
