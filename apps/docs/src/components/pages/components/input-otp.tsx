import { InputOtp, Label } from "@almach/ui";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";

function OtpDemo() {
  const [value, setValue] = useState("");
  const [completed, setCompleted] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-3">
      <InputOtp
        value={value}
        onValueChange={setValue}
        onComplete={setCompleted}
      />
      <p className="text-xs text-muted-foreground">
        {completed ? `Submitted ${completed}` : "Enter the 6-digit code"}
      </p>
    </div>
  );
}

export function InputOtpPage() {
  return (
    <ComponentDoc
      name="Input OTP"
      description="One-time-code field. Handles paste, backspace, arrow keys and autofill, and fires onComplete once every slot is filled."
      examples={[
        {
          title: "Default",
          description:
            "Six numeric slots. Paste a whole code into any slot and it spills forward.",
          preview: <OtpDemo />,
          code: `const [value, setValue] = useState("");

<InputOtp value={value} onValueChange={setValue} onComplete={submit} />`,
        },
        {
          title: "Grouped",
          description: "A divider every N slots for longer codes.",
          preview: <InputOtp length={6} groupSize={3} defaultValue="12" />,
          code: `<InputOtp length={6} groupSize={3} />`,
        },
        {
          title: "Variations",
          preview: (
            <div className="flex flex-col items-start gap-5">
              <div className="flex flex-col gap-2">
                <Label>Alphanumeric, 4 slots</Label>
                <InputOtp length={4} pattern="alphanumeric" size="sm" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Masked</Label>
                <InputOtp length={4} mask defaultValue="1234" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>Invalid</Label>
                <InputOtp length={4} error defaultValue="99" />
              </div>
            </div>
          ),
          code: `<InputOtp length={4} pattern="alphanumeric" size="sm" />
<InputOtp length={4} mask />
<InputOtp length={4} error />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "length",
          type: "number",
          default: "6",
          description: "Number of slots.",
        },
        {
          name: "value / defaultValue",
          type: "string",
          description: "Controlled and uncontrolled value.",
        },
        {
          name: "onValueChange",
          type: "(value: string) => void",
          description: "Fired on every edit.",
        },
        {
          name: "onComplete",
          type: "(value: string) => void",
          description: "Fired once when all slots are filled.",
        },
        {
          name: "pattern",
          type: '"numeric" | "alphanumeric"',
          default: '"numeric"',
          description: "Which characters are accepted.",
        },
        {
          name: "mask",
          type: "boolean",
          default: "false",
          description: "Obscure filled slots.",
        },
        {
          name: "groupSize",
          type: "number",
          description: "Insert a visual divider every N slots.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Slot dimensions.",
        },
        {
          name: "error",
          type: "boolean",
          default: "false",
          description: "Mark every slot invalid.",
        },
        {
          name: "name",
          type: "string",
          description:
            "Renders a hidden input so the value posts with a plain form.",
        },
      ]}
    />
  );
}
