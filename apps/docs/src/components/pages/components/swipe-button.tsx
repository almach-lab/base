import { SwipeButton } from "@almach/ui";
import { ChevronRight } from "lucide-react";
import type * as React from "react";
import { ComponentDoc } from "../../component-doc";

const DEMO_WRAP = "w-full max-w-xs";

function SwipeDemo({
  label,
  successLabel = "Confirmed",
  variant,
  ...props
}: React.ComponentProps<typeof SwipeButton> & {
  label: string;
  successLabel?: string;
  variant?: React.ComponentProps<typeof SwipeButton.Thumb>["variant"];
}) {
  return (
    <SwipeButton className={DEMO_WRAP} {...props}>
      <SwipeButton.Fill />
      <SwipeButton.Track>{label}</SwipeButton.Track>
      <SwipeButton.Overlay>{successLabel}</SwipeButton.Overlay>
      <SwipeButton.Thumb {...(variant ? { variant } : {})}>
        <ChevronRight className="size-5" aria-hidden="true" />
      </SwipeButton.Thumb>
    </SwipeButton>
  );
}

export function SwipeButtonPage() {
  return (
    <ComponentDoc
      name="Swipe Button"
      description="Confirm-by-swiping control with spring motion. Drag the thumb across the track to trigger an action — pointer, touch, and keyboard (arrows, Space, Enter) supported."
      examples={[
        {
          title: "Default",
          description:
            "Swipe the thumb to the right to trigger the success callback.",
          preview: <SwipeDemo label="Swipe to confirm" onSuccess={() => {}} />,
          code: `import { SwipeButton } from "@almach/ui";
import { ChevronRight } from "lucide-react";

<SwipeButton onSuccess={() => console.log("confirmed!")} className="w-72">
  <SwipeButton.Fill />
  <SwipeButton.Track>Swipe to confirm</SwipeButton.Track>
  <SwipeButton.Overlay>Confirmed</SwipeButton.Overlay>
  <SwipeButton.Thumb>
    <ChevronRight className="size-5" />
  </SwipeButton.Thumb>
</SwipeButton>`,
        },
        {
          title: "Variants",
          description:
            "Four semantic thumb colors: default, success, destructive, warning.",
          preview: <VariantsDemo />,
          centered: false,
          code: `<SwipeButton onSuccess={onDelete} className="w-72">
  <SwipeButton.Fill />
  <SwipeButton.Track>Swipe to delete</SwipeButton.Track>
  <SwipeButton.Overlay>Deleted</SwipeButton.Overlay>
  <SwipeButton.Thumb variant="destructive">
    <ChevronRight className="size-5" />
  </SwipeButton.Thumb>
</SwipeButton>`,
        },
        {
          title: "Hold to confirm",
          description:
            "Set hold={1000} to require the thumb to stay at the threshold for 1 second.",
          preview: (
            <SwipeDemo
              label="Swipe + hold to confirm"
              successLabel="Deleted"
              variant="destructive"
              hold={1000}
              onSuccess={() => {}}
            />
          ),
          code: `<SwipeButton hold={1000} onSuccess={handleDelete}>
  ...
</SwipeButton>`,
        },
        {
          title: "Persist on success",
          description:
            "Set resetOnSuccess={false} to keep the thumb at the end after confirmation.",
          preview: (
            <SwipeDemo
              label="Swipe to confirm"
              variant="success"
              resetOnSuccess={false}
              onSuccess={() => {}}
            />
          ),
          code: `<SwipeButton resetOnSuccess={false} onSuccess={onConfirm}>
  ...
</SwipeButton>`,
        },
        {
          title: "Disabled",
          description: "Prevents interaction while preserving the layout.",
          preview: (
            <SwipeDemo label="Swipe to confirm" disabled onSuccess={() => {}} />
          ),
          code: `<SwipeButton disabled>...</SwipeButton>`,
        },
      ]}
      props={[
        {
          name: "onSuccess",
          type: "() => void",
          description:
            "Fired when swipe (and optional hold) completes successfully.",
        },
        {
          name: "onFail",
          type: "() => void",
          description:
            "Fired when the thumb is released without reaching the threshold.",
        },
        {
          name: "threshold",
          type: "number",
          default: "0.85",
          description:
            "Fraction (0–1) of track width the thumb must reach to trigger success.",
        },
        {
          name: "hold",
          type: "number",
          default: "0",
          description:
            "Milliseconds the thumb must be held at the threshold before success fires. 0 = instant.",
        },
        {
          name: "resetOnSuccess",
          type: "boolean",
          default: "true",
          description:
            "If true, the thumb springs back to the start after success (default). Set false to keep the completed state.",
        },
        {
          name: "resetDelay",
          type: "number",
          default: "800",
          description:
            "Milliseconds to show the success state before resetting when resetOnSuccess is true.",
        },
        {
          name: "reverseSwipe",
          type: "boolean",
          default: "false",
          description: "Swipe right-to-left instead of left-to-right.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Prevents interaction.",
        },
        {
          name: "SwipeButton.Thumb variant",
          type: '"default" | "destructive" | "success" | "warning"',
          default: '"default"',
          description: "Color variant of the draggable thumb.",
        },
      ]}
    />
  );
}

function VariantsDemo() {
  return (
    <div className="flex w-full flex-col gap-4">
      <SwipeDemo label="Swipe to confirm" variant="default" onSuccess={() => {}} />
      <SwipeDemo
        label="Swipe to delete"
        successLabel="Deleted"
        variant="destructive"
        onSuccess={() => {}}
      />
      <SwipeDemo
        label="Swipe to approve"
        successLabel="Approved"
        variant="success"
        onSuccess={() => {}}
      />
      <SwipeDemo
        label="Swipe with caution"
        successLabel="Done"
        variant="warning"
        onSuccess={() => {}}
      />
    </div>
  );
}
