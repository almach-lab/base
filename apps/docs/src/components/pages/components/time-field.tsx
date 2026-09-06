import { TimeField } from "@almach/ui";
import { Time } from "@internationalized/date";
import { ComponentDoc } from "../../component-doc";
import { DemoStack } from "../../docs/demo";

export function TimeFieldPage() {
  return (
    <ComponentDoc
      name="Time Field"
      description="Segmented time entry built on React Aria. Each segment is separately editable with arrow keys, and the format follows the user's locale."
      examples={[
        {
          title: "Default",
          description: "Hour and minute segments, locale-formatted.",
          preview: (
            <TimeField
              className="max-w-[12rem]"
              label="Start time"
              defaultValue={new Time(9, 30)}
            />
          ),
          code: `import { Time } from "@internationalized/date";

<TimeField label="Start time" defaultValue={new Time(9, 30)} />`,
        },
        {
          title: "Granularity",
          description: "Add seconds, or force a 24-hour cycle.",
          preview: (
            <DemoStack width="md">
              <TimeField
                label="With seconds"
                granularity="second"
                defaultValue={new Time(14, 5, 30)}
              />
              <TimeField
                label="24-hour"
                hourCycle={24}
                defaultValue={new Time(18, 45)}
              />
            </DemoStack>
          ),
          code: `<TimeField label="With seconds" granularity="second" defaultValue={new Time(14, 5, 30)} />
<TimeField label="24-hour" hourCycle={24} defaultValue={new Time(18, 45)} />`,
          centered: false,
        },
        {
          title: "States",
          preview: (
            <DemoStack width="md">
              <TimeField
                size="sm"
                label="Small"
                description="Opening hours"
                defaultValue={new Time(8, 0)}
              />
              <TimeField
                label="Invalid"
                defaultValue={new Time(3, 0)}
                errorMessage="Pick a time during business hours."
              />
              <TimeField
                label="Disabled"
                defaultValue={new Time(12, 0)}
                isDisabled
              />
            </DemoStack>
          ),
          code: `<TimeField size="sm" label="Small" description="Opening hours" />
<TimeField label="Invalid" errorMessage="Pick a time during business hours." />
<TimeField label="Disabled" isDisabled />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value / defaultValue",
          type: "TimeValue",
          description: "A Time or ZonedDateTime from @internationalized/date.",
        },
        {
          name: "onChange",
          type: "(value: TimeValue | null) => void",
          description: "Fired when a segment changes.",
        },
        {
          name: "granularity",
          type: '"hour" | "minute" | "second"',
          default: '"minute"',
          description: "Smallest editable segment.",
        },
        {
          name: "hourCycle",
          type: "12 | 24",
          description: "Override the locale's clock.",
        },
        {
          name: "minValue / maxValue",
          type: "TimeValue",
          description: "Allowed range.",
        },
        {
          name: "label / description / errorMessage",
          type: "React.ReactNode",
          description: "Field label and helper text.",
        },
        {
          name: "size",
          type: '"sm" | "default" | "lg"',
          default: '"default"',
          description: "Field height, padding and text scale.",
        },
        {
          name: "error",
          type: "boolean",
          default: "false",
          description:
            "Mark the field invalid. Implied when errorMessage is set.",
        },
      ]}
    />
  );
}
