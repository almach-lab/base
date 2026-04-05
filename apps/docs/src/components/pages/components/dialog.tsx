import * as React from "react";
import { Button, Dialog, Input, Label, Select } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function DialogPage() {
	return (
		<ComponentDoc
			name="Dialog"
			description="Modal overlay with focus trapping, scroll lock, and keyboard dismissal (Escape)."
			examples={[
				{
					title: "Basic dialog",
					description:
						"Trigger, header with Title and Description, body content, and footer actions.",
					preview: (
						<Dialog>
							<Dialog.Trigger asChild>
								<Button variant="outline">Edit profile</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Edit profile</Dialog.Title>
									<Dialog.Description>
										Make changes to your profile. Click save when done.
									</Dialog.Description>
								</Dialog.Header>
								<div className="space-y-4 py-2">
									<div className="space-y-1.5">
										<Label htmlFor="dlg-name">Display name</Label>
										<Input id="dlg-name" defaultValue="Alice Johnson" />
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="dlg-email">Email</Label>
										<Input
											id="dlg-email"
											type="email"
											defaultValue="alice@example.com"
										/>
									</div>
									<div className="space-y-1.5">
										<Label>Role</Label>
										<Select defaultValue="admin">
											<Select.Trigger className="w-full">
												<Select.Value />
											</Select.Trigger>
											<Select.Content>
												<Select.Item value="admin">Admin</Select.Item>
												<Select.Item value="member">Member</Select.Item>
												<Select.Item value="viewer">Viewer</Select.Item>
											</Select.Content>
										</Select>
									</div>
								</div>
								<Dialog.Footer>
									<Dialog.Close asChild>
										<Button variant="outline">Cancel</Button>
									</Dialog.Close>
									<Button>Save changes</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog>
					),
					code: `<Dialog>
  <Dialog.Trigger asChild>
    <Button variant="outline">Edit profile</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Edit profile</Dialog.Title>
      <Dialog.Description>
        Make changes to your profile. Click save when done.
      </Dialog.Description>
    </Dialog.Header>
    <div className="space-y-4 py-2">
      <div className="space-y-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input id="name" defaultValue="Alice Johnson" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="alice@example.com" />
      </div>
    </div>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button>Save changes</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
				},
				{
					title: "Destructive action",
					description:
						"Use Dialog.Description and a destructive button to confirm irreversible actions.",
					preview: (
						<Dialog>
							<Dialog.Trigger asChild>
								<Button variant="destructive">Delete account</Button>
							</Dialog.Trigger>
							<Dialog.Content>
								<Dialog.Header>
									<Dialog.Title>Delete account</Dialog.Title>
									<Dialog.Description>
										This action cannot be undone. All your data — including
										projects, settings, and history — will be permanently deleted.
									</Dialog.Description>
								</Dialog.Header>
								<Dialog.Footer>
									<Dialog.Close asChild>
										<Button variant="outline">Cancel</Button>
									</Dialog.Close>
									<Button variant="destructive">Delete account</Button>
								</Dialog.Footer>
							</Dialog.Content>
						</Dialog>
					),
					code: `<Dialog>
  <Dialog.Trigger asChild>
    <Button variant="destructive">Delete account</Button>
  </Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Delete account</Dialog.Title>
      <Dialog.Description>
        This action cannot be undone. All your data will be permanently deleted.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Dialog.Close>
      <Button variant="destructive">Delete account</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
				},
				{
					title: "Controlled state",
					description: "Manage open state externally with open and onOpenChange.",
					preview: <ControlledDialog />,
					code: `const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>

<Dialog open={open} onOpenChange={setOpen}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>Controlled dialog</Dialog.Title>
      <Dialog.Description>
        This dialog is controlled via external state.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Button variant="outline" onClick={() => setOpen(false)}>
        Close
      </Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog>`,
				},
			]}
			props={[
				{
					name: "open",
					type: "boolean",
					description: "Controlled open state.",
				},
				{
					name: "onOpenChange",
					type: "(open: boolean) => void",
					description: "Callback when the dialog opens or closes.",
				},
				{
					name: "Dialog.Trigger",
					type: "DialogTriggerProps",
					description:
						"Element that opens the dialog. Use asChild to forward props to a Button.",
				},
				{
					name: "Dialog.Content",
					type: "DialogContentProps",
					description: "The dialog panel. Includes a close (×) button by default.",
				},
				{
					name: "Dialog.Close",
					type: "DialogCloseProps",
					description: "Closes the dialog on click. Use asChild to wrap a Button.",
				},
			]}
		/>
	);
}

function ControlledDialog() {
	const [open, setOpen] = React.useState(false);
	return (
		<>
			<Button variant="outline" onClick={() => setOpen(true)}>
				Open dialog
			</Button>
			<Dialog open={open} onOpenChange={setOpen}>
				<Dialog.Content>
					<Dialog.Header>
						<Dialog.Title>Controlled dialog</Dialog.Title>
						<Dialog.Description>
							This dialog is driven by external state via open and onOpenChange.
						</Dialog.Description>
					</Dialog.Header>
					<Dialog.Footer>
						<Button onClick={() => setOpen(false)}>Close</Button>
					</Dialog.Footer>
				</Dialog.Content>
			</Dialog>
		</>
	);
}
