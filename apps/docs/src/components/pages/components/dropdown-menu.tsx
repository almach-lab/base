import { Button, DropdownMenu } from "@almach/ui";
import {
  Bell,
  ChevronDown,
  CreditCard,
  LogOut,
  Settings,
  Trash2,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function DropdownMenuPage() {
  return (
    <ComponentDoc
      name="Dropdown Menu"
      description="A floating contextual menu with items, labels, groups, separators, and keyboard shortcuts."
      examples={[
        {
          title: "Account menu",
          description:
            "A typical profile/account dropdown with keyboard shortcuts.",
          preview: (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline">
                  <User className="h-4 w-4" />
                  My account
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content align="start" className="w-52">
                <DropdownMenu.Label>My Account</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                  <DropdownMenu.Item>
                    <User className="h-4 w-4" />
                    Profile
                    <DropdownMenu.Shortcut>⌘P</DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <CreditCard className="h-4 w-4" />
                    Billing
                    <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Bell className="h-4 w-4" />
                    Notifications
                  </DropdownMenu.Item>
                  <DropdownMenu.Item>
                    <Settings className="h-4 w-4" />
                    Settings
                    <DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
                  </DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Item destructive>
                  <LogOut className="h-4 w-4" />
                  Sign out
                  <DropdownMenu.Shortcut>⌘Q</DropdownMenu.Shortcut>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ),
          code: `<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline">
      <User className="h-4 w-4" />
      My account
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content align="start" className="w-52">
    <DropdownMenu.Label>My Account</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.Item>
        <User className="h-4 w-4" />
        Profile
        <DropdownMenu.Shortcut>⌘P</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
      <DropdownMenu.Item>
        <Settings className="h-4 w-4" />
        Settings
        <DropdownMenu.Shortcut>⌘,</DropdownMenu.Shortcut>
      </DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Item destructive>
      <LogOut className="h-4 w-4" />
      Sign out
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`,
        },
        {
          title: "Team switcher",
          description:
            "Grouped items for switching between workspaces or contexts.",
          preview: (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm">
                  <Users className="h-4 w-4" />
                  Acme Corp
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-48">
                <DropdownMenu.Label>Workspaces</DropdownMenu.Label>
                <DropdownMenu.Separator />
                {["Acme Corp", "Startup Inc", "Freelance"].map((team) => (
                  <DropdownMenu.Item key={team}>
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-foreground/10 text-[10px] font-bold shrink-0">
                      {team[0]}
                    </span>
                    {team}
                  </DropdownMenu.Item>
                ))}
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <UserPlus className="h-4 w-4" />
                  Create workspace
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ),
          code: `<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline" size="sm">
      <Users className="h-4 w-4" />
      Acme Corp
      <ChevronDown className="h-4 w-4 opacity-50" />
    </Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content className="w-48">
    <DropdownMenu.Label>Workspaces</DropdownMenu.Label>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Acme Corp</DropdownMenu.Item>
    <DropdownMenu.Item>Startup Inc</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <UserPlus className="h-4 w-4" />
      Create workspace
    </DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`,
        },
        {
          title: "With disabled item",
          description:
            "Individual items can be disabled — they render at 50% opacity and are skipped by keyboard navigation.",
          preview: (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm">
                  More options
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-48">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
                <DropdownMenu.Item disabled>
                  Export (unavailable)
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item destructive>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ),
          code: `<DropdownMenu.Item>Edit</DropdownMenu.Item>
<DropdownMenu.Item>Duplicate</DropdownMenu.Item>
<DropdownMenu.Item disabled>Export (unavailable)</DropdownMenu.Item>
<DropdownMenu.Separator />
<DropdownMenu.Item destructive>
  <Trash2 className="h-4 w-4" />
  Delete
</DropdownMenu.Item>`,
        },
        {
          title: "With submenu",
          description:
            "Nested actions using React Aria submenu trigger and nested content.",
          preview: (
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <Button variant="outline" size="sm">
                  Actions
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content className="w-48">
                <DropdownMenu.Item>Open</DropdownMenu.Item>
                <DropdownMenu.Item>Rename...</DropdownMenu.Item>
                <DropdownMenu.SubTrigger>
                  <DropdownMenu.Item>Share</DropdownMenu.Item>
                  <DropdownMenu.Content className="w-44">
                    <DropdownMenu.Item>Email</DropdownMenu.Item>
                    <DropdownMenu.Item>SMS</DropdownMenu.Item>
                    <DropdownMenu.Item>Instagram</DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.SubTrigger>
                <DropdownMenu.Separator />
                <DropdownMenu.Item destructive>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          ),
          code: `<DropdownMenu>
  <DropdownMenu.Trigger asChild>
    <Button variant="outline" size="sm">Actions</Button>
  </DropdownMenu.Trigger>
  <DropdownMenu.Content className="w-48">
    <DropdownMenu.Item>Open</DropdownMenu.Item>
    <DropdownMenu.SubTrigger>
      <DropdownMenu.Item>Share</DropdownMenu.Item>
      <DropdownMenu.Content className="w-44">
        <DropdownMenu.Item>Email</DropdownMenu.Item>
        <DropdownMenu.Item>SMS</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.SubTrigger>
  </DropdownMenu.Content>
</DropdownMenu>`,
        },
      ]}
      props={[
        {
          name: "DropdownMenu.Content align",
          type: '"start" | "center" | "end"',
          default: '"center"',
          description:
            "Horizontal alignment of the menu relative to the trigger.",
        },
        {
          name: "DropdownMenu.Content side",
          type: '"top" | "right" | "bottom" | "left"',
          default: '"bottom"',
          description: "Preferred side for the menu to open.",
        },
        {
          name: "DropdownMenu.Item destructive",
          type: "boolean",
          default: "false",
          description: "Renders the item in destructive (red) color.",
        },
        {
          name: "DropdownMenu.Item disabled",
          type: "boolean",
          default: "false",
          description:
            "Prevents selection. Renders at 50% opacity and is skipped by keyboard navigation.",
        },
        {
          name: "DropdownMenu.Shortcut",
          type: "React.HTMLAttributes<HTMLSpanElement>",
          description:
            "Keyboard shortcut hint aligned to the right of the item.",
        },
      ]}
    />
  );
}
