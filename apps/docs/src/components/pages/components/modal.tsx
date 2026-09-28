import {
  Button,
  Input,
  Label,
  Modal,
  Switch,
  Textarea,
  ToggleGroup,
} from "@almach/ui";
import { Check } from "lucide-react";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";
import { DemoRow } from "../../docs/demo";

const PLANS = [
  {
    name: "Starter",
    price: "$0",
    blurb: "For side projects and trying things out.",
    features: ["3 projects", "1 GB storage", "Community support"],
  },
  {
    name: "Team",
    price: "$24",
    blurb: "For small teams shipping every week.",
    features: ["Unlimited projects", "100 GB storage", "Email support"],
  },
  {
    name: "Business",
    price: "$79",
    blurb: "For organisations with compliance needs.",
    features: ["SAML single sign-on", "1 TB storage", "Priority support"],
  },
] as const;

const DPA_SECTIONS = [
  {
    title: "1. Scope",
    body: "This agreement applies to personal data we process on your behalf while providing the service, including account details, usage logs, and any content your members upload.",
  },
  {
    title: "2. Processing instructions",
    body: "We process personal data only on your documented instructions. Configuring the service, inviting members, and using the API count as instructions.",
  },
  {
    title: "3. Confidentiality",
    body: "Everyone with access to customer data is bound by confidentiality obligations and receives security training when they join and every year after.",
  },
  {
    title: "4. Sub-processors",
    body: "We keep a public list of sub-processors and notify workspace owners at least 30 days before adding a new one. You may object during that window.",
  },
  {
    title: "5. Security measures",
    body: "Data is encrypted in transit with TLS 1.2+ and at rest with AES-256. Production access requires hardware-backed MFA and is reviewed quarterly.",
  },
  {
    title: "6. Breach notification",
    body: "We notify workspace owners without undue delay, and within 48 hours, of becoming aware of a personal data breach affecting your workspace.",
  },
  {
    title: "7. Deletion",
    body: "When your subscription ends we delete customer data within 30 days, except where retention is required by law. Backups roll off within 90 days.",
  },
  {
    title: "8. Audits",
    body: "We share our latest SOC 2 Type II report on request. Business plans may run one on-site audit per year with 30 days' notice.",
  },
] as const;

export function ModalPage() {
  return (
    <ComponentDoc
      name="Modal"
      description="Responsive overlay that renders as a centered Dialog on desktop and a bottom Drawer on mobile — same API, zero media query boilerplate."
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
                <Modal.Body className="space-y-4">
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
                </Modal.Body>
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
    <Modal.Body className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name">Display name</Label>
        <Input id="name" defaultValue="Alice Johnson" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue="alice@example.com" />
      </div>
    </Modal.Body>
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
          title: "Sizes",
          description:
            "size sets the desktop max width: sm, default, lg, xl, or 2xl. On mobile the drawer is always full width.",
          preview: (
            <DemoRow className="justify-center">
              <Modal>
                <Modal.Trigger asChild>
                  <Button variant="outline">Small</Button>
                </Modal.Trigger>
                <Modal.Content size="sm">
                  <Modal.Header>
                    <Modal.Title>Sign out everywhere?</Modal.Title>
                    <Modal.Description>
                      You will be signed out on 4 other devices, including the
                      mobile app.
                    </Modal.Description>
                  </Modal.Header>
                  <Modal.Footer>
                    <Modal.Close asChild>
                      <Button variant="outline">Cancel</Button>
                    </Modal.Close>
                    <Button>Sign out</Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
              <Modal>
                <Modal.Trigger asChild>
                  <Button variant="outline">Extra large</Button>
                </Modal.Trigger>
                <Modal.Content size="xl">
                  <Modal.Header>
                    <Modal.Title>Change plan</Modal.Title>
                    <Modal.Description>
                      Billed monthly per workspace. Switch or cancel any time.
                    </Modal.Description>
                  </Modal.Header>
                  <Modal.Body>
                    <div className="grid gap-3 sm:grid-cols-3">
                      {PLANS.map((plan) => (
                        <div
                          key={plan.name}
                          className="space-y-3 rounded-lg bg-muted p-4"
                        >
                          <div className="space-y-1">
                            <p className="font-medium">{plan.name}</p>
                            <p className="text-2xl font-semibold">
                              {plan.price}
                              <span className="text-sm font-normal text-muted-foreground">
                                /month
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {plan.blurb}
                            </p>
                          </div>
                          <ul className="space-y-1.5 text-xs">
                            {plan.features.map((feature) => (
                              <li
                                key={feature}
                                className="flex items-center gap-2"
                              >
                                <Check
                                  className="size-3.5 shrink-0 text-success"
                                  aria-hidden="true"
                                />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </Modal.Body>
                  <Modal.Footer>
                    <Modal.Close asChild>
                      <Button variant="outline">Keep current plan</Button>
                    </Modal.Close>
                    <Button>Continue to checkout</Button>
                  </Modal.Footer>
                </Modal.Content>
              </Modal>
            </DemoRow>
          ),
          code: `<Modal.Content size="sm">
  <Modal.Header>
    <Modal.Title>Sign out everywhere?</Modal.Title>
    <Modal.Description>
      You will be signed out on 4 other devices.
    </Modal.Description>
  </Modal.Header>
  <Modal.Footer>
    <Modal.Close asChild>
      <Button variant="outline">Cancel</Button>
    </Modal.Close>
    <Button>Sign out</Button>
  </Modal.Footer>
</Modal.Content>

<Modal.Content size="xl">
  <Modal.Header>
    <Modal.Title>Change plan</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <div className="grid gap-3 sm:grid-cols-3">{/* plan cards */}</div>
  </Modal.Body>
  <Modal.Footer>…</Modal.Footer>
</Modal.Content>`,
        },
        {
          title: "Smooth height",
          description:
            "Modal.Body animates its height whenever its content changes. Turn on Repeat to reveal the schedule fields. Opt out with animateHeight={false}.",
          preview: <RecurringPaymentModal />,
          code: `const [repeat, setRepeat] = React.useState(false);

<Modal.Content>
  <Modal.Header>
    <Modal.Title>Schedule payment</Modal.Title>
    <Modal.Description>
      Pay Northwind Supplies from the Operating account.
    </Modal.Description>
  </Modal.Header>
  <Modal.Body className="space-y-4">
    <div className="space-y-1.5">
      <Label htmlFor="amount">Amount (USD)</Label>
      <Input id="amount" inputMode="decimal" defaultValue="1,250.00" />
    </div>
    <Switch isSelected={repeat} onChange={setRepeat}>
      Repeat this payment
    </Switch>
    {repeat && (
      <div className="space-y-4">
        <ToggleGroup
          variant="soft"
          selectionMode="single"
          defaultSelectedKeys={["monthly"]}
          disallowEmptySelection
          aria-label="Frequency"
        >
          <ToggleGroup.Item id="weekly" size="sm">Weekly</ToggleGroup.Item>
          <ToggleGroup.Item id="monthly" size="sm">Monthly</ToggleGroup.Item>
          <ToggleGroup.Item id="quarterly" size="sm">Quarterly</ToggleGroup.Item>
        </ToggleGroup>
        <div className="space-y-1.5">
          <Label htmlFor="ends">Ends on</Label>
          <Input id="ends" type="date" />
        </div>
      </div>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Modal.Close asChild>
      <Button variant="outline">Cancel</Button>
    </Modal.Close>
    <Button>{repeat ? "Schedule payments" : "Schedule payment"}</Button>
  </Modal.Footer>
</Modal.Content>`,
        },
        {
          title: "Long content",
          description:
            "Content is capped at 88% of the viewport height. Header and Footer stay pinned while Modal.Body scrolls.",
          preview: (
            <Modal>
              <Modal.Trigger asChild>
                <Button variant="outline">Review agreement</Button>
              </Modal.Trigger>
              <Modal.Content size="lg">
                <Modal.Header>
                  <Modal.Title>Data processing agreement</Modal.Title>
                  <Modal.Description>
                    Version 3.2 · effective 1 October 2026
                  </Modal.Description>
                </Modal.Header>
                <Modal.Body className="space-y-5">
                  {DPA_SECTIONS.map((section) => (
                    <section key={section.title} className="space-y-1.5">
                      <h3 className="font-medium">{section.title}</h3>
                      <p className="text-muted-foreground">{section.body}</p>
                    </section>
                  ))}
                </Modal.Body>
                <Modal.Footer>
                  <Modal.Close asChild>
                    <Button variant="outline">Not now</Button>
                  </Modal.Close>
                  <Button>Accept agreement</Button>
                </Modal.Footer>
              </Modal.Content>
            </Modal>
          ),
          code: `<Modal.Content size="lg">
  <Modal.Header>
    <Modal.Title>Data processing agreement</Modal.Title>
    <Modal.Description>Version 3.2 · effective 1 October 2026</Modal.Description>
  </Modal.Header>
  <Modal.Body className="space-y-5">
    {sections.map((section) => (
      <section key={section.title} className="space-y-1.5">
        <h3 className="font-medium">{section.title}</h3>
        <p className="text-muted-foreground">{section.body}</p>
      </section>
    ))}
  </Modal.Body>
  <Modal.Footer>
    <Modal.Close asChild>
      <Button variant="outline">Not now</Button>
    </Modal.Close>
    <Button>Accept agreement</Button>
  </Modal.Footer>
</Modal.Content>`,
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
            "The panel. Renders as a centered dialog ≥768 px, bottom sheet below. Borderless flex column capped at min(88svh, 56rem).",
        },
        {
          name: "Modal.Content › size",
          type: '"sm" | "default" | "lg" | "xl" | "2xl"',
          default: '"default"',
          description:
            "Desktop max width: max-w-sm, lg, 2xl, 3xl, or 5xl. Ignored by the mobile drawer.",
        },
        {
          name: "Modal.Content › hideClose",
          type: "boolean",
          default: "false",
          description:
            "Hides the corner close button on desktop and drops the header's right padding reserve.",
        },
        {
          name: "Modal.Header",
          type: "HTMLDivElement",
          description:
            "Container for Title and Description. Stays fixed above the body.",
        },
        {
          name: "Modal.Body",
          type: "ModalBodyProps",
          description:
            "Scrollable section between Header and Footer. className applies to the inner content box.",
        },
        {
          name: "Modal.Body › animateHeight",
          type: "boolean",
          default: "true",
          description:
            "Animates height changes when the content grows or shrinks. Set to false for content that resizes continuously.",
        },
        {
          name: "Modal.Footer",
          type: "HTMLDivElement",
          description:
            "Action area. Stays fixed below the body. Stacks vertically on mobile, aligns right on desktop.",
        },
        {
          name: "Modal.Title",
          type: "HTMLHeadingElement",
          description:
            'Accessible title. Wires aria-labelledby on the content automatically. For a visually hidden title use className="sr-only".',
        },
        {
          name: "Modal.Description",
          type: "HTMLParagraphElement",
          description:
            "Supporting text below the title. Wires aria-describedby on the content when rendered.",
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

function RecurringPaymentModal() {
  const [repeat, setRepeat] = React.useState(false);
  return (
    <Modal>
      <Modal.Trigger asChild>
        <Button variant="outline">Schedule payment</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Schedule payment</Modal.Title>
          <Modal.Description>
            Pay Northwind Supplies from the Operating account.
          </Modal.Description>
        </Modal.Header>
        <Modal.Body className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="modal-amount">Amount (USD)</Label>
              <Input
                id="modal-amount"
                inputMode="decimal"
                defaultValue="1,250.00"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="modal-send-on">Send on</Label>
              <Input id="modal-send-on" type="date" defaultValue="2026-10-01" />
            </div>
          </div>
          <Switch isSelected={repeat} onChange={setRepeat}>
            Repeat this payment
          </Switch>
          {repeat && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-sm font-medium">Frequency</p>
                <ToggleGroup
                  variant="soft"
                  selectionMode="single"
                  defaultSelectedKeys={["monthly"]}
                  disallowEmptySelection
                  aria-label="Frequency"
                >
                  <ToggleGroup.Item id="weekly" size="sm">
                    Weekly
                  </ToggleGroup.Item>
                  <ToggleGroup.Item id="monthly" size="sm">
                    Monthly
                  </ToggleGroup.Item>
                  <ToggleGroup.Item id="quarterly" size="sm">
                    Quarterly
                  </ToggleGroup.Item>
                </ToggleGroup>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="modal-ends-on">Ends on</Label>
                <Input id="modal-ends-on" type="date" />
              </div>
              <p className="text-xs text-muted-foreground">
                Leave the end date empty to repeat until you cancel.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button variant="outline">Cancel</Button>
          </Modal.Close>
          <Button>{repeat ? "Schedule payments" : "Schedule payment"}</Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
