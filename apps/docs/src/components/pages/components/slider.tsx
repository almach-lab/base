import { Slider } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

export function SliderPage() {
  return (
    <ComponentDoc
      name="Slider"
      description="Single-value and range slider built on React Aria. Values are formatted with Intl, so currency and percentages come for free."
      examples={[
        {
          title: "Default",
          description: "A single thumb with a visible value.",
          preview: (
            <Slider
              className="max-w-sm"
              label="Volume"
              defaultValue={60}
              showValue
            />
          ),
          code: `<Slider label="Volume" defaultValue={60} showValue />`,
        },
        {
          title: "Range",
          description: "Pass an array of two values for a range.",
          preview: (
            <Slider
              className="max-w-sm"
              label="Price"
              defaultValue={[120, 480]}
              minValue={0}
              maxValue={1000}
              step={10}
              formatOptions={{ style: "currency", currency: "USD" }}
              showValue
            />
          ),
          code: `<Slider
  label="Price"
  defaultValue={[120, 480]}
  minValue={0}
  maxValue={1000}
  step={10}
  formatOptions={{ style: "currency", currency: "USD" }}
  showValue
/>`,
        },
        {
          title: "Sizes",
          description: "Three track and thumb sizes.",
          preview: (
            <DemoStack className="gap-6">
              <Slider size="sm" label="Small" defaultValue={30} showValue />
              <Slider label="Default" defaultValue={50} showValue />
              <Slider size="lg" label="Large" defaultValue={70} showValue />
            </DemoStack>
          ),
          code: `<Slider size="sm" label="Small" defaultValue={30} showValue />
<Slider label="Default" defaultValue={50} showValue />
<Slider size="lg" label="Large" defaultValue={70} showValue />`,
          centered: false,
        },
        {
          title: "Disabled",
          preview: (
            <Slider
              className="max-w-sm"
              label="Locked"
              defaultValue={45}
              isDisabled
              showValue
            />
          ),
          code: `<Slider label="Locked" defaultValue={45} isDisabled showValue />`,
        },
      ]}
      props={[
        {
          name: "value / defaultValue",
          type: "number | number[]",
          description: "One number for a single thumb, two for a range.",
        },
        {
          name: "onChange",
          type: "(value: number | number[]) => void",
          description: "Fired continuously while dragging.",
        },
        {
          name: "onChangeEnd",
          type: "(value: number | number[]) => void",
          description: "Fired once the interaction settles.",
        },
        {
          name: "minValue / maxValue / step",
          type: "number",
          default: "0 / 100 / 1",
          description: "Bounds and granularity.",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          description: "How the value label is formatted.",
        },
        {
          name: "label",
          type: "React.ReactNode",
          description: "Visible field label.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "false",
          description: "Render the formatted value opposite the label.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Track and thumb scale.",
        },
        {
          name: "isDisabled",
          type: "boolean",
          default: "false",
          description: "Disable interaction.",
        },
      ]}
    />
  );
}
