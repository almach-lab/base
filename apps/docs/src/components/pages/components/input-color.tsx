import { Input, Label } from "@almach/ui";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

const BRAND_SWATCHES = [
  "#d39d2a",
  "#e11d48",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#f97316",
];

function ControlledDemo() {
  const [color, setColor] = useState("#d39d2a");

  return (
    <DemoStack>
      <Input.Color
        value={color}
        onChange={setColor}
        swatches={BRAND_SWATCHES}
        aria-label="Brand colour"
      />
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="size-9 rounded-lg border border-border"
          style={{ background: color }}
        />
        <code className="font-mono text-xs text-muted-foreground">{color}</code>
      </div>
    </DemoStack>
  );
}

function AlphaDemo() {
  const [value, setValue] = useState("#10b981");

  return (
    <DemoStack width="md">
      <div className="flex flex-col gap-2">
        <Label>format="hex" — widens to hexa when translucent</Label>
        <Input.Color format="hex" value={value} onChange={setValue} />
        <code className="font-mono text-xs text-muted-foreground">{value}</code>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Opaque only</Label>
        <Input.Color
          format="hex"
          showAlpha={false}
          defaultValue="#10b981"
          aria-label="Opaque only"
        />
      </div>
    </DemoStack>
  );
}

export function InputColorPage() {
  return (
    <ComponentDoc
      name="Color Input"
      description="A colour field with an inline swatch that opens the picker in a popover. The text stays editable, so a value can be typed or pasted — the field and the picker are two views of one colour."
      examples={[
        {
          title: "Default",
          description:
            "Click the swatch for the picker, or type straight into the field.",
          preview: (
            <Input.Color
              defaultValue="#3b82f6"
              aria-label="Colour"
              className="max-w-[14rem]"
            />
          ),
          code: `<Input.Color defaultValue="#3b82f6" aria-label="Colour" />`,
        },
        {
          title: "Controlled with presets",
          description:
            "Pass `swatches` to offer preset colours above the picker.",
          preview: <ControlledDemo />,
          code: `const [color, setColor] = useState("#d39d2a");

<Input.Color
  value={color}
  onChange={setColor}
  swatches={["#d39d2a", "#e11d48", "#0ea5e9", "#10b981"]}
  aria-label="Brand colour"
/>`,
          centered: false,
        },
        {
          title: "Formats",
          description:
            "`format` drives both the text and what `onChange` emits. Alpha works in every format — a translucent colour is serialised in the alpha-carrying equivalent, so `hex` becomes `hexa`.",
          preview: (
            <DemoStack width="md">
              <div className="flex flex-col gap-2">
                <Label>hex</Label>
                <Input.Color defaultValue="#3b82f6" aria-label="Hex" />
              </div>
              <div className="flex flex-col gap-2">
                <Label>hexa</Label>
                <Input.Color
                  format="hexa"
                  defaultValue="#3b82f6cc"
                  aria-label="Hex with alpha"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>rgb</Label>
                <Input.Color
                  format="rgb"
                  defaultValue="rgb(16, 185, 129)"
                  aria-label="RGB"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>hsl</Label>
                <Input.Color
                  format="hsl"
                  defaultValue="hsl(43, 90%, 44%)"
                  aria-label="HSL"
                />
              </div>
            </DemoStack>
          ),
          code: `<Input.Color format="hex" defaultValue="#3b82f6" />
<Input.Color format="hexa" defaultValue="#3b82f6cc" />
<Input.Color format="rgb" defaultValue="rgb(16, 185, 129)" />
<Input.Color format="hsl" defaultValue="hsl(43, 90%, 44%)" />`,
          centered: false,
        },
        {
          title: "Alpha",
          description:
            "The alpha slider is on for every format. Drop the opacity below 100% and the emitted value widens to carry it; pass showAlpha={false} for an opaque-only field.",
          preview: <AlphaDemo />,
          code: `// hex widens to hexa as soon as alpha drops below 1
<Input.Color format="hex" value={value} onChange={setValue} />

// opaque only — no alpha slider, alpha never emitted
<Input.Color format="hex" showAlpha={false} defaultValue="#10b981" />`,
          centered: false,
        },
        {
          title: "Sizes and states",
          preview: (
            <DemoStack width="md">
              <Input.Color
                size="sm"
                defaultValue="#8b5cf6"
                aria-label="Small"
              />
              <Input.Color defaultValue="#8b5cf6" aria-label="Default" />
              <Input.Color
                size="lg"
                defaultValue="#8b5cf6"
                aria-label="Large"
              />
              <Input.Color error defaultValue="#8b5cf6" aria-label="Invalid" />
              <Input.Color
                disabled
                defaultValue="#8b5cf6"
                aria-label="Disabled"
              />
            </DemoStack>
          ),
          code: `<Input.Color size="sm" defaultValue="#8b5cf6" />
<Input.Color defaultValue="#8b5cf6" />
<Input.Color size="lg" defaultValue="#8b5cf6" />
<Input.Color error defaultValue="#8b5cf6" />
<Input.Color disabled defaultValue="#8b5cf6" />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value",
          type: "string",
          description:
            "Controlled value in any CSS colour notation. Omit for uncontrolled use.",
        },
        {
          name: "defaultValue",
          type: "string",
          default: '"#000000"',
          description: "Uncontrolled initial value.",
        },
        {
          name: "onChange",
          type: "(value: string) => void",
          description: "Emits the colour re-serialised in `format`.",
        },
        {
          name: "format",
          type: '"hex" | "hexa" | "rgb" | "rgba" | "hsl" | "hsla" | "css"',
          default: '"hex"',
          description: "Notation used for the text field and for `onChange`.",
        },
        {
          name: "showAlpha",
          type: "boolean",
          default: "true",
          description:
            "Show the alpha slider. When alpha drops below 1 the value is emitted in the alpha-carrying equivalent of `format`, so the channel is never silently dropped. Set false for an opaque-only field.",
        },
        {
          name: "swatches",
          type: "string[]",
          description: "Preset colours offered above the picker.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Field height, swatch size and text scale.",
        },
        {
          name: "error",
          type: "boolean",
          default: "false",
          description:
            "Mark the field invalid. It is also set automatically while the typed text does not parse.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disable the field and its trigger.",
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
