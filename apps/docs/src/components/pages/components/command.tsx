import * as React from "react";
import {
	Button,
	Command,
} from "@almach/ui";
import {
	Calculator,
	Calendar,
	CreditCard,
	FileText,
	LayoutDashboard,
	Search,
	Settings,
	Smile,
	User,
} from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function CommandPage() {
	return (
		<ComponentDoc
			name="Command"
			description="Accessible command palette built on cmdk. Supports keyboard navigation, grouped results, shortcuts, and a Dialog wrapper for ⌘K style menus."
			pkg="@almach/ui"
			examples={[
				{
					title: "Inline",
					description:
						"Embed Command directly on the page with grouped results and keyboard navigation.",
					preview: (
						<Command className="w-full max-w-md rounded-2xl border shadow-md">
							<Command.Input placeholder="Search..." />
							<Command.List>
								<Command.Empty>No results found.</Command.Empty>
								<Command.Group heading="Navigation">
									<Command.Item>
										<LayoutDashboard />
										Dashboard
									</Command.Item>
									<Command.Item>
										<FileText />
										Documents
									</Command.Item>
									<Command.Item>
										<Calendar />
										Calendar
									</Command.Item>
								</Command.Group>
								<Command.Separator />
								<Command.Group heading="Settings">
									<Command.Item>
										<User />
										Profile
										<Command.Shortcut>⌘P</Command.Shortcut>
									</Command.Item>
									<Command.Item>
										<CreditCard />
										Billing
										<Command.Shortcut>⌘B</Command.Shortcut>
									</Command.Item>
									<Command.Item>
										<Settings />
										Settings
										<Command.Shortcut>⌘,</Command.Shortcut>
									</Command.Item>
								</Command.Group>
							</Command.List>
						</Command>
					),
					code: `<Command className="rounded-2xl border shadow-md">
  <Command.Input placeholder="Search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>

    <Command.Group heading="Navigation">
      <Command.Item><LayoutDashboard />Dashboard</Command.Item>
      <Command.Item><FileText />Documents</Command.Item>
    </Command.Group>

    <Command.Separator />

    <Command.Group heading="Settings">
      <Command.Item>
        <Settings />Settings
        <Command.Shortcut>⌘,</Command.Shortcut>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command>`,
				},
				{
					title: "Dialog (⌘K)",
					description:
						"Open as a full command palette via Command.Dialog. Press the button or ⌘K.",
					preview: <CommandPaletteDemo />,
					code: `const [open, setOpen] = React.useState(false);

// Open on ⌘K
React.useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };
  document.addEventListener("keydown", handler);
  return () => document.removeEventListener("keydown", handler);
}, []);

<Button variant="outline" onClick={() => setOpen(true)}>
  <Search className="mr-2 h-4 w-4" />
  Search...
  <Command.Shortcut>⌘K</Command.Shortcut>
</Button>

<Command.Dialog open={open} onOpenChange={setOpen}>
  <Command.Input placeholder="Type a command or search..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Suggestions">
      <Command.Item onSelect={() => setOpen(false)}>
        <Calculator />Calculator
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>`,
				},
			]}
			props={[
				{
					name: "Command.Input › placeholder",
					type: "string",
					description: "Placeholder text shown when the input is empty.",
				},
				{
					name: "Command.Group › heading",
					type: "string",
					description: "Section label shown above the group's items.",
				},
				{
					name: "Command.Item › onSelect",
					type: "() => void",
					description: "Called when the item is selected via click or Enter.",
				},
				{
					name: "Command.Item › disabled",
					type: "boolean",
					description: "Prevents selection and dims the item.",
				},
				{
					name: "Command.Shortcut",
					type: "ReactNode",
					description:
						"Right-aligned keyboard hint. Visual only — wire real shortcuts yourself.",
				},
				{
					name: "Command.Dialog › open",
					type: "boolean",
					description: "Controlled open state.",
				},
				{
					name: "Command.Dialog › onOpenChange",
					type: "(open: boolean) => void",
					description: "Called when the dialog opens or closes.",
				},
			]}
		/>
	);
}

function CommandPaletteDemo() {
	const [open, setOpen] = React.useState(false);

	React.useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", handler);
		return () => document.removeEventListener("keydown", handler);
	}, []);

	return (
		<>
			<Button variant="outline" className="gap-2" onClick={() => setOpen(true)}>
				<Search className="h-4 w-4" />
				<span className="text-muted-foreground">Search...</span>
				<Command.Shortcut className="ml-4">⌘K</Command.Shortcut>
			</Button>

			<Command.Dialog open={open} onOpenChange={setOpen}>
				<Command.Input placeholder="Type a command or search..." />
				<Command.List>
					<Command.Empty>No results found.</Command.Empty>
					<Command.Group heading="Suggestions">
						<Command.Item onSelect={() => setOpen(false)}>
							<Calculator />
							Calculator
						</Command.Item>
						<Command.Item onSelect={() => setOpen(false)}>
							<Calendar />
							Calendar
						</Command.Item>
						<Command.Item onSelect={() => setOpen(false)}>
							<Smile />
							Search emoji
						</Command.Item>
					</Command.Group>
					<Command.Separator />
					<Command.Group heading="Settings">
						<Command.Item onSelect={() => setOpen(false)}>
							<User />
							Profile
							<Command.Shortcut>⌘P</Command.Shortcut>
						</Command.Item>
						<Command.Item onSelect={() => setOpen(false)}>
							<Settings />
							Settings
							<Command.Shortcut>⌘,</Command.Shortcut>
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Dialog>
		</>
	);
}
