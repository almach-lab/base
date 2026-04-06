import { Button, Input, Label, Modal, Textarea } from "@almach/ui";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function ModalPage() {
  return (
    <ComponentDoc
      name="Modal"
      description="Responsive overlay that renders as a centered Dialog on desktop and a bottom Drawer on mobile — same API, zero media query boilerplate."
      pkg="@almach/ui"
      examples={[
        {
          title: "Basic modal",
          description:
            "Resize the window below 768 px to see it switch to a bottom sheet.",
          preview: (
            <Modal>
              <Modal.Trigger asChild>
                <Button variant="outline">Open modal</Button>
              </Modal.Trigger>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Responsive modal</Modal.Title>
                  <Modal.Description>
                    Dialog on desktop · Drawer on mobile. No extra code
                    required.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Modal.Close>
                  <Button>Confirm</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          ),
          code: `<Modal>
  <Modal.Trigger asChild>
    <Button variant="outline">Open modal</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Responsive modal</Modal.Title>
      <Modal.Description>
        Dialog on desktop · Drawer on mobile.
      </Modal.Description>
    </Modal.Header>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Modal.Close>
      <Button>Confirm</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>`,
        },
        {
          title: "Edit profile",
          description: "Form inside a modal with input fields.",
          preview: (
            <Modal>
              <Modal.Trigger asChild>
                <Button variant="outline">Edit profile</Button>
              </Modal.Trigger>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Edit profile</Modal.Title>
                  <Modal.Description>
                    Make changes to your profile. Click save when done.
                  </Modal.Description>
                </Modal.Header>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-name">Display name</Label>
                    <Input id="modal-name" defaultValue="Alice Johnson" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-email">Email</Label>
                    <Input
                      id="modal-email"
                      type="email"
                      defaultValue="alice@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="modal-bio">Bio</Label>
                    <Textarea
                      id="modal-bio"
                      rows={3}
                      defaultValue="Product designer at Acme."
                    />
                  </div>
                </div>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Modal.Close>
                  <Button>Save changes</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          ),
          code: `<Modal>
  <Modal.Trigger asChild>
    <Button variant="outline">Edit profile</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Edit profile</Modal.Title>
      <Modal.Description>
        Make changes to your profile. Click save when done.
      </Modal.Description>
    </Modal.Header>
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
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Modal.Close>
      <Button>Save changes</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>`,
        },
        {
          title: "Destructive action",
          description:
            "Confirm an irreversible action with a destructive button.",
          preview: (
            <Modal>
              <Modal.Trigger asChild>
                <Button variant="destructive">Delete account</Button>
              </Modal.Trigger>
              <Modal.Content>
                <Modal.Header>
                  <Modal.Title>Delete account</Modal.Title>
                  <Modal.Description>
                    This action cannot be undone. All your data — projects,
                    settings, and history — will be permanently deleted.
                  </Modal.Description>
                </Modal.Header>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Cancel</Button>
                  </Modal.Close>
                  <Button variant="destructive">Delete account</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          ),
          code: `<Modal>
  <Modal.Trigger asChild>
    <Button variant="destructive">Delete account</Button>
  </Modal.Trigger>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Delete account</Modal.Title>
      <Modal.Description>
        This action cannot be undone. All your data will be permanently deleted.
      </Modal.Description>
    </Modal.Header>
    <Modal.Footer>
      <Modal.Close asChild>
        <Button variant="outline">Cancel</Button>
      </Modal.Close>
      <Button variant="destructive">Delete account</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>`,
        },
        {
          title: "Controlled state",
          description:
            "Manage open state externally with open and onOpenChange.",
          preview: <ControlledModal />,
          code: `const [open, setOpen] = React.useState(false);

<Button onClick={() => setOpen(true)}>Open modal</Button>

<Modal open={open} onOpenChange={setOpen}>
  <Modal.Content>
    <Modal.Header>
      <Modal.Title>Controlled modal</Modal.Title>
      <Modal.Description>
        Driven by external state via open and onOpenChange.
      </Modal.Description>
    </Modal.Header>
    <Modal.Footer>
      <Button onClick={() => setOpen(false)}>Close</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>`,
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
          description: "Callback fired when the modal opens or closes.",
        },
        {
          name: "Modal.Trigger",
          type: "ModalTriggerProps",
          description:
            "Element that opens the modal. Use asChild to forward props to a Button.",
        },
        {
          name: "Modal.Content",
          type: "ModalContentProps",
          description:
            "The panel. Renders as a centered dialog ≥768 px, bottom sheet below.",
        },
        {
          name: "Modal.Header",
          type: "HTMLDivElement",
          description: "Container for Title and Description.",
        },
        {
          name: "Modal.Footer",
          type: "HTMLDivElement",
          description:
            "Action area. Stacks vertically on mobile, aligns right on desktop.",
        },
        {
          name: "Modal.Title",
          type: "HTMLHeadingElement",
          description: "Accessible title announced to screen readers.",
        },
        {
          name: "Modal.Description",
          type: "HTMLParagraphElement",
          description: "Supporting text below the title.",
        },
        {
          name: "Modal.Close",
          type: "ModalCloseProps",
          description:
            "Closes the modal on click. Use asChild to wrap a Button.",
        },
      ]}
    />
  );
}

function ControlledModal() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open modal
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>Controlled modal</Modal.Title>
            <Modal.Description>
              Driven by external state via open and onOpenChange.
            </Modal.Description>
          </Modal.Header>
          <Modal.Footer>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </>
  );
}
