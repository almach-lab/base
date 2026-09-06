import { ColorPicker, parseColor } from "@almach/ui";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";

const SWATCHES = [
  "#d39d2a",
  "#e11d48",
  "#0ea5e9",
  "#10b981",
  "#8b5cf6",
  "#f97316",
];

function ColorPickerDemo() {
  const [color, setColor] = useState(parseColor("hsl(43, 90%, 44%)"));

  return (
    <div className="w-full max-w-xs">
      <ColorPicker value={color} onChange={setColor}>
        <ColorPicker.Area
          colorSpace="hsb"
          xChannel="saturation"
          yChannel="brightness"
        />
        <ColorPicker.Slider channel="hue" colorSpace="hsb" label="Hue" />
        <ColorPicker.Slider channel="alpha" label="Alpha" />
        <div className="flex items-end gap-2">
          <ColorPicker.Swatch className="mb-px size-9" />
          <ColorPicker.Field label="Hex" className="flex-1" />
        </div>
      </ColorPicker>
    </div>
  );
}

export function ColorPickerPage() {
  return (
    <ComponentDoc
      name="Color Picker"
      description="Colour selection built on React Aria's colour primitives — a saturation/brightness area, channel sliders, a hex field and swatches. Every part is optional; compose what you need."
      examples={[
        {
          title: "Full picker",
          description:
            "Area, hue and alpha sliders, preview swatch and hex entry.",
          preview: <ColorPickerDemo />,
          code: `import { ColorPicker, parseColor } from "@almach/ui";

const [color, setColor] = useState(parseColor("hsl(43, 90%, 44%)"));

<ColorPicker value={color} onChange={setColor}>
  <ColorPicker.Area colorSpace="hsb" xChannel="saturation" yChannel="brightness" />
  <ColorPicker.Slider channel="hue" colorSpace="hsb" label="Hue" />
  <ColorPicker.Slider channel="alpha" label="Alpha" />
  <div className="flex items-end gap-2">
    <ColorPicker.Swatch className="size-9" />
    <ColorPicker.Field label="Hex" className="flex-1" />
  </div>
</ColorPicker>`,
        },
        {
          title: "Swatches only",
          description: "A preset palette, for constrained brand choices.",
          preview: (
            <ColorPicker defaultValue={SWATCHES[0]}>
              <ColorPicker.Swatches>
                {SWATCHES.map((value) => (
                  <ColorPicker.SwatchItem key={value} color={value} />
                ))}
              </ColorPicker.Swatches>
            </ColorPicker>
          ),
          code: `<ColorPicker defaultValue="#d39d2a">
  <ColorPicker.Swatches>
    <ColorPicker.SwatchItem color="#d39d2a" />
    <ColorPicker.SwatchItem color="#e11d48" />
  </ColorPicker.Swatches>
</ColorPicker>`,
        },
      ]}
      props={[
        {
          name: "value / defaultValue",
          type: "Color | string",
          description:
            "Current colour. Use the exported parseColor to build one.",
        },
        {
          name: "onChange",
          type: "(color: Color) => void",
          description: "Fired whenever any channel changes.",
        },
        {
          name: "ColorPicker.Area",
          type: "colorSpace, xChannel, yChannel",
          description: "Two-dimensional channel surface.",
        },
        {
          name: "ColorPicker.Slider",
          type: "channel, colorSpace, label",
          description:
            "Single-channel slider. Alpha renders over a checkerboard.",
        },
        {
          name: "ColorPicker.Field",
          type: "label, size",
          description: "Text entry for the colour value.",
        },
        {
          name: "ColorPicker.Swatch",
          type: "color?",
          description:
            "Read-only chip. Without a color it previews the current value.",
        },
        {
          name: "ColorPicker.Swatches / SwatchItem",
          type: "color",
          description: "Selectable preset palette.",
        },
        {
          name: "parseColor",
          type: "(value: string) => Color",
          description:
            "Re-exported from React Aria, for building colour values.",
        },
      ]}
    />
  );
}
