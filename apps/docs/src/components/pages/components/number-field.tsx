import { NumberField } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

export function NumberFieldPage() {
  return (
    <ComponentDoc
      name="Number Field"
      description="Numeric input with stepper buttons, locale-aware formatting and clamping. Built on React Aria NumberField."
      examples={[
        {
          title: "Default",
          description: "Steppers on both sides, centred value.",
          preview: (
            <NumberField
              className="max-w-[12rem]"
              label="Quantity"
              defaultValue={1}
              minValue={0}
            />
          ),
          code: `<NumberField label="Quantity" defaultValue={1} minValue={0} />`,
        },
        {
          title: "Formatted",
          description:
            "Pass Intl options for currency, percent or unit display.",
          preview: (
            <DemoStack width="md">
              <NumberField
                label="Budget"
                defaultValue={2500}
                minValue={0}
                step={50}
                formatOptions={{ style: "currency", currency: "USD" }}
              />
              <NumberField
                label="Discount"
                defaultValue={0.15}
                minValue={0}
                maxValue={1}
                step={0.05}
                formatOptions={{ style: "percent" }}
              />
            </DemoStack>
          ),
          code: `<NumberField
  label="Budget"
  defaultValue={2500}
  step={50}
  formatOptions={{ style: "currency", currency: "USD" }}
/>`,
          centered: false,
        },
        {
          title: "Sizes and states",
          preview: (
            <DemoStack width="md">
              <NumberField size="sm" label="Small" defaultValue={2} />
              <NumberField
                label="Without steppers"
                defaultValue={12}
                hideStepper
              />
              <NumberField
                label="Invalid"
                defaultValue={0}
                minValue={1}
                errorMessage="Pick at least one."
              />
              <NumberField label="Disabled" defaultValue={5} isDisabled />
            </DemoStack>
          ),
          code: `<NumberField size="sm" label="Small" defaultValue={2} />
<NumberField label="Without steppers" defaultValue={12} hideStepper />
<NumberField label="Invalid" defaultValue={0} minValue={1} errorMessage="Pick at least one." />
<NumberField label="Disabled" defaultValue={5} isDisabled />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value / defaultValue",
          type: "number",
          description: "Controlled and uncontrolled value.",
        },
        {
          name: "onChange",
          type: "(value: number) => void",
          description: "Fired when the committed value changes.",
        },
        {
          name: "minValue / maxValue / step",
          type: "number",
          description: "Bounds and stepper increment.",
        },
        {
          name: "formatOptions",
          type: "Intl.NumberFormatOptions",
          description: "Display and parsing format.",
        },
        {
          name: "label / description / errorMessage",
          type: "React.ReactNode",
          description: "Field label and helper text.",
        },
        {
          name: "error",
          type: "boolean",
          default: "false",
          description:
            "Mark the field invalid. Implied when errorMessage is set.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Field height, padding and text scale.",
        },
        {
          name: "hideStepper",
          type: "boolean",
          default: "false",
          description: "Hide the increment and decrement buttons.",
        },
      ]}
    />
  );
}
