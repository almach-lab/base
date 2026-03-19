import * as React from "react";
import { Button, Tooltip } from "@almach/ui";
import { Copy, Info, Trash2 } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function TooltipPage() {
	return (
		<Tooltip.Provider delayDuration={300}>
			<ComponentDoc
				name="Tooltip"
				description="A contextual hint displayed on hover or keyboard focus. Built on Radix UI Tooltip with configurable delay and placement."
				examples={[
					{
						title: "Icon buttons",
						description:
							"Always add a Tooltip to icon-only buttons for accessibility.",
						preview: (
							<div className="flex flex-wrap gap-3">
								{[
									{ label: "Copy", tip: "Copy to clipboard", icon: <Copy className="h-4 w-4" /> },
									{ label: "Info", tip: "More information", icon: <Info className="h-4 w-4" /> },
									{ label: "Delete", tip: "Delete permanently", icon: <Trash2 className="h-4 w-4" /> },
								].map(({ label, tip, icon }) => (
									<Tooltip key={label}>
										<Tooltip.Trigger asChild>
											<Button variant="outline" size="icon" aria-label={label}>
												{icon}
											</Button>
										</Tooltip.Trigger>
										<Tooltip.Content>{tip}</Tooltip.Content>
									</Tooltip>
								))}
							</div>
						),
						code: `<Tooltip.Provider delayDuration={300}>
  <Tooltip>
    <Tooltip.Trigger asChild>
      <Button variant="outline" size="icon" aria-label="Copy">
        <Copy className="h-4 w-4" />
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Content>Copy to clipboard</Tooltip.Content>
  </Tooltip>
</Tooltip.Provider>`,
					},
					{
						title: "Placement",
						description: "Use the side prop to control the preferred position.",
						preview: (
							<div className="flex flex-wrap gap-3">
								{(["top", "right", "bottom", "left"] as const).map((side) => (
									<Tooltip key={side}>
										<Tooltip.Trigger asChild>
											<Button variant="outline" size="sm">
												{side.charAt(0).toUpperCase() + side.slice(1)}
											</Button>
										</Tooltip.Trigger>
										<Tooltip.Content side={side}>
											Tooltip on {side}
										</Tooltip.Content>
									</Tooltip>
								))}
							</div>
						),
						code: `<Tooltip>
  <Tooltip.Trigger asChild>
    <Button variant="outline" size="sm">Top</Button>
  </Tooltip.Trigger>
  <Tooltip.Content side="top">Tooltip on top</Tooltip.Content>
</Tooltip>

<Tooltip>
  <Tooltip.Trigger asChild>
    <Button variant="outline" size="sm">Right</Button>
  </Tooltip.Trigger>
  <Tooltip.Content side="right">Tooltip on right</Tooltip.Content>
</Tooltip>`,
					},
					{
						title: "On text",
						description:
							"Tooltips work on any focusable element, including inline text spans.",
						preview: (
							<p className="text-sm">
								Hover over the{" "}
								<Tooltip>
									<Tooltip.Trigger asChild>
										<span className="cursor-help underline decoration-dotted underline-offset-2">
											underlined term
										</span>
									</Tooltip.Trigger>
									<Tooltip.Content className="max-w-[200px] text-center">
										A tooltip that provides additional context for this term.
									</Tooltip.Content>
								</Tooltip>{" "}
								to see more information.
							</p>
						),
						code: `<p>
  Hover over the{" "}
  <Tooltip>
    <Tooltip.Trigger asChild>
      <span className="cursor-help underline decoration-dotted underline-offset-2">
        underlined term
      </span>
    </Tooltip.Trigger>
    <Tooltip.Content className="max-w-[200px] text-center">
      A tooltip that provides additional context.
    </Tooltip.Content>
  </Tooltip>{" "}
  to see more.
</p>`,
						centered: false,
					},
					{
						title: "Disabled element",
						description:
							"To show a tooltip on a disabled button, wrap it in a span (Radix requires a focusable trigger).",
						preview: (
							<Tooltip>
								<Tooltip.Trigger asChild>
									<span tabIndex={0} className="cursor-not-allowed inline-flex">
										<Button disabled style={{ pointerEvents: "none" }}>
											Publish
										</Button>
									</span>
								</Tooltip.Trigger>
								<Tooltip.Content>
									You need editor permissions to publish.
								</Tooltip.Content>
							</Tooltip>
						),
						code: `<Tooltip>
  <Tooltip.Trigger asChild>
    <span tabIndex={0} className="cursor-not-allowed inline-flex">
      <Button disabled style={{ pointerEvents: "none" }}>
        Publish
      </Button>
    </span>
  </Tooltip.Trigger>
  <Tooltip.Content>
    You need editor permissions to publish.
  </Tooltip.Content>
</Tooltip>`,
					},
				]}
				props={[
					{
						name: "Tooltip.Provider delayDuration",
						type: "number",
						default: "700",
						description:
							"Hover delay in ms before any tooltip opens. Set once on the Provider.",
					},
					{
						name: "Tooltip.Content side",
						type: '"top" | "right" | "bottom" | "left"',
						default: '"top"',
						description: "Preferred side for the tooltip. Will flip if insufficient space.",
					},
					{
						name: "Tooltip.Content sideOffset",
						type: "number",
						default: "6",
						description: "Distance in px between the tooltip and its trigger.",
					},
					{
						name: "Tooltip.Content align",
						type: '"start" | "center" | "end"',
						default: '"center"',
						description: "Alignment of the tooltip along its axis.",
					},
				]}
			/>
		</Tooltip.Provider>
	);
}
