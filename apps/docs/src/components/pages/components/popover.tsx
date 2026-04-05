import * as React from "react";
import { Button, Input, Label, Popover } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function PopoverPage() {
	return (
		<ComponentDoc
			name="Popover"
			description="Floating panel anchored to a trigger element with smooth open/close animations and portal rendering."
			examples={[
				{
					title: "Basic popover",
					description: "Click the trigger to open a floating content panel.",
					preview: (
						<Popover>
							<Popover.Trigger asChild>
								<Button variant="outline">Open popover</Button>
							</Popover.Trigger>
							<Popover.Content className="w-80">
								<div className="space-y-2">
									<h4 className="text-sm font-semibold">Dimensions</h4>
									<p className="text-sm text-muted-foreground">
										Set the dimensions for the layer.
									</p>
								</div>
							</Popover.Content>
						</Popover>
					),
					code: `<Popover>
  <Popover.Trigger asChild>
    <Button variant="outline">Open popover</Button>
  </Popover.Trigger>
  <Popover.Content className="w-80">
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">Dimensions</h4>
      <p className="text-sm text-muted-foreground">
        Set the dimensions for the layer.
      </p>
    </div>
  </Popover.Content>
</Popover>`,
				},
				{
					title: "With form",
					description: "Popover can contain any content including form fields.",
					preview: (
						<Popover>
							<Popover.Trigger asChild>
								<Button variant="outline">Edit profile</Button>
							</Popover.Trigger>
							<Popover.Content className="w-80">
								<div className="space-y-4">
									<div className="space-y-1">
										<h4 className="text-sm font-semibold">Profile</h4>
										<p className="text-xs text-muted-foreground">
											Update your display name.
										</p>
									</div>
									<div className="space-y-1.5">
										<Label htmlFor="pop-name">Name</Label>
										<Input id="pop-name" defaultValue="Alice Johnson" />
									</div>
									<div className="flex justify-end">
										<Button size="sm">Save</Button>
									</div>
								</div>
							</Popover.Content>
						</Popover>
					),
					code: `<Popover>
  <Popover.Trigger asChild>
    <Button variant="outline">Edit profile</Button>
  </Popover.Trigger>
  <Popover.Content className="w-80">
    <div className="space-y-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold">Profile</h4>
        <p className="text-xs text-muted-foreground">
          Update your display name.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" defaultValue="Alice Johnson" />
      </div>
      <div className="flex justify-end">
        <Button size="sm">Save</Button>
      </div>
    </div>
  </Popover.Content>
</Popover>`,
				},
				{
					title: "Alignment",
					description:
						"Control how the popover aligns relative to the trigger with the align prop.",
					preview: (
						<div className="flex items-center gap-3">
							{(["start", "center", "end"] as const).map((align) => (
								<Popover key={align}>
									<Popover.Trigger asChild>
										<Button variant="outline" size="sm">
											{align}
										</Button>
									</Popover.Trigger>
									<Popover.Content align={align} className="w-40">
										<p className="text-xs text-muted-foreground">
											Aligned to {align}
										</p>
									</Popover.Content>
								</Popover>
							))}
						</div>
					),
					code: `<Popover>
  <Popover.Trigger asChild>
    <Button variant="outline">start</Button>
  </Popover.Trigger>
  <Popover.Content align="start">
    <p className="text-xs text-muted-foreground">Aligned to start</p>
  </Popover.Content>
</Popover>`,
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
					description: "Callback when the popover opens or closes.",
				},
				{
					name: "defaultOpen",
					type: "boolean",
					description: "Whether the popover is open by default (uncontrolled).",
				},
				{
					name: "Popover.Trigger",
					type: "PopoverTriggerProps",
					description:
						"Element that opens the popover. Use asChild to forward props to a custom element.",
				},
				{
					name: "Popover.Content",
					type: "PopoverContentProps",
					description: "The floating panel content.",
				},
				{
					name: "align",
					type: '"start" | "center" | "end"',
					default: '"center"',
					description: "Alignment of the popover relative to the trigger.",
				},
				{
					name: "sideOffset",
					type: "number",
					default: "4",
					description: "Distance in pixels from the trigger.",
				},
				{
					name: "side",
					type: '"top" | "right" | "bottom" | "left"',
					default: '"bottom"',
					description: "Preferred side of the trigger to render the popover.",
				},
			]}
		/>
	);
}
