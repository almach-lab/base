import { SwipeButton } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function SwipeButtonPage() {
  return (
    <ComponentDoc
      name="Swipe Button"
      description="A confirm-by-swiping interaction with spring physics. The user drags the thumb across the track to trigger an action, preventing accidental taps. Built with pointer, touch, and keyboard (Space/Enter) support."
      examples={[
        {
          title: "Default",
          description:
            "Swipe the thumb to the right to trigger the success callback.",
          preview: <DefaultDemo />,
          code: `import { SwipeButton } from "@almach/ui";

<SwipeButton onSuccess={() => console.log("confirmed!")} className="w-72">
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
    <SwipeButton.Thumb />
  </SwipeButton.Track>
</SwipeButton>`,
        },
        {
          title: "Variants",
          description:
            "Four semantic color variants: default, success, destructive, warning.",
          preview: <VariantsDemo />,
          code: `import { SwipeButton } from "@almach/ui";

<SwipeButton onSuccess={() => {}} className="w-72">
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
    <SwipeButton.Thumb variant="default" />
  </SwipeButton.Track>
</SwipeButton>

<SwipeButton onSuccess={() => {}} className="w-72">
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to delete</SwipeButton.Overlay>
    <SwipeButton.Thumb variant="destructive" />
  </SwipeButton.Track>
</SwipeButton>

<SwipeButton onSuccess={() => {}} className="w-72">
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to approve</SwipeButton.Overlay>
    <SwipeButton.Thumb variant="success" />
  </SwipeButton.Track>
</SwipeButton>`,
        },
        {
          title: "Hold to confirm",
          description:
            "Set hold={1000} to require the thumb to be held at the threshold for 1 second before success fires.",
          preview: <HoldDemo />,
          code: `import { SwipeButton } from "@almach/ui";

<SwipeButton
  onSuccess={() => console.log("held and confirmed!")}
  hold={1000}
  className="w-72"
>
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe + hold to confirm</SwipeButton.Overlay>
    <SwipeButton.Thumb variant="destructive" />
  </SwipeButton.Track>
</SwipeButton>`,
        },
        {
          title: "Reset on success",
          description:
            "The thumb snaps back after success — useful for repeated confirmations.",
          preview: <ResetDemo />,
          code: `import { SwipeButton } from "@almach/ui";

<SwipeButton
  onSuccess={() => console.log("done")}
  resetOnSuccess
  resetDelay={800}
  className="w-72"
>
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
    <SwipeButton.Thumb variant="success" />
  </SwipeButton.Track>
</SwipeButton>`,
        },
        {
          title: "Disabled",
          description: "Prevents interaction while preserving the layout.",
          preview: <DisabledDemo />,
          code: `import { SwipeButton } from "@almach/ui";

<SwipeButton disabled className="w-72">
  <SwipeButton.Track>
    <SwipeButton.Fill />
    <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
    <SwipeButton.Thumb />
  </SwipeButton.Track>
</SwipeButton>`,
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
          default: "false",
          description:
            "If true, the thumb springs back to the start after success.",
        },
        {
          name: "resetDelay",
          type: "number",
          default: "1200",
          description:
            "Milliseconds before the thumb resets when resetOnSuccess is true.",
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

function DefaultDemo() {
  return (
    <SwipeButton onSuccess={() => {}} className="w-72">
      <SwipeButton.Track>
        <SwipeButton.Fill />
        <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
        <SwipeButton.Thumb />
      </SwipeButton.Track>
    </SwipeButton>
  );
}

function VariantsDemo() {
  return (
    <div className="flex flex-col gap-4">
      <SwipeButton onSuccess={() => {}} resetOnSuccess className="w-72">
        <SwipeButton.Track>
          <SwipeButton.Fill />
          <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
          <SwipeButton.Thumb variant="default" />
        </SwipeButton.Track>
      </SwipeButton>
      <SwipeButton onSuccess={() => {}} resetOnSuccess className="w-72">
        <SwipeButton.Track>
          <SwipeButton.Fill />
          <SwipeButton.Overlay>Swipe to delete</SwipeButton.Overlay>
          <SwipeButton.Thumb variant="destructive" />
        </SwipeButton.Track>
      </SwipeButton>
      <SwipeButton onSuccess={() => {}} resetOnSuccess className="w-72">
        <SwipeButton.Track>
          <SwipeButton.Fill />
          <SwipeButton.Overlay>Swipe to approve</SwipeButton.Overlay>
          <SwipeButton.Thumb variant="success" />
        </SwipeButton.Track>
      </SwipeButton>
    </div>
  );
}

function HoldDemo() {
  return (
    <SwipeButton onSuccess={() => {}} hold={1000} className="w-72">
      <SwipeButton.Track>
        <SwipeButton.Fill />
        <SwipeButton.Overlay>Swipe + hold to confirm</SwipeButton.Overlay>
        <SwipeButton.Thumb variant="destructive" />
      </SwipeButton.Track>
    </SwipeButton>
  );
}

function ResetDemo() {
  return (
    <SwipeButton
      onSuccess={() => {}}
      resetOnSuccess
      resetDelay={800}
      className="w-72"
    >
      <SwipeButton.Track>
        <SwipeButton.Fill />
        <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
        <SwipeButton.Thumb variant="success" />
      </SwipeButton.Track>
    </SwipeButton>
  );
}

function DisabledDemo() {
  return (
    <SwipeButton disabled className="w-72">
      <SwipeButton.Track>
        <SwipeButton.Fill />
        <SwipeButton.Overlay>Swipe to confirm</SwipeButton.Overlay>
        <SwipeButton.Thumb />
      </SwipeButton.Track>
    </SwipeButton>
  );
}
