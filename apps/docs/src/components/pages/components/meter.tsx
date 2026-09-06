import { Meter } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

export function MeterPage() {
  return (
    <ComponentDoc
      name="Meter"
      description="Shows a value inside a known range — disk usage, quota, capacity. Unlike Progress, a Meter is a measurement rather than a task in flight."
      examples={[
        {
          title: "Default",
          preview: (
            <Meter
              className="max-w-sm"
              label="Storage used"
              value={64}
              formatOptions={{ style: "percent" }}
            />
          ),
          code: `<Meter label="Storage used" value={64} formatOptions={{ style: "percent" }} />`,
        },
        {
          title: "Thresholds",
          description:
            "Switch the variant as the value crosses your own warning levels.",
          preview: (
            <DemoStack className="gap-5">
              <Meter label="Healthy" value={32} variant="success" />
              <Meter label="Filling up" value={78} variant="warning" />
              <Meter label="Critical" value={96} variant="destructive" />
            </DemoStack>
          ),
          code: `<Meter label="Healthy" value={32} variant="success" />
<Meter label="Filling up" value={78} variant="warning" />
<Meter label="Critical" value={96} variant="destructive" />`,
          centered: false,
        },
        {
          title: "Custom range",
          description: "Any numeric range works, not just 0–100.",
          preview: (
            <Meter
              className="max-w-sm"
              label="Seats"
              value={18}
              minValue={0}
              maxValue={25}
              size="lg"
              formatOptions={{ style: "decimal" }}
            />
          ),
          code: `<Meter label="Seats" value={18} minValue={0} maxValue={25} size="lg" />`,
        },
      ]}
      props={[
        {
          name: "value",
          type: "number",
          required: true,
          description: "Current measurement.",
        },
        {
          name: "minValue / maxValue",
          type: "number",
          default: "0 / 100",
          description: "Range bounds.",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          description: "How the value text is formatted.",
        },
        {
          name: "label",
          type: "React.ReactNode",
          description: "Visible label above the bar.",
        },
        {
          name: "showValue",
          type: "boolean",
          default: "true",
          description: "Render the formatted value opposite the label.",
        },
        {
          name: "variant",
          type: '"default" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "Fill colour.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Bar thickness.",
        },
      ]}
    />
  );
}
