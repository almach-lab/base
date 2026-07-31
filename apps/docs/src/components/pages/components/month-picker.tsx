import { MonthPicker } from "@almach/ui";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function MonthPickerPage() {
  return (
    <ComponentDoc
      name="Month Picker"
      description="Month + year dropdowns with prev/next arrows for when you need users to select an entire month, not a specific day. Fully responsive — shrinks to fit narrow containers."
      examples={[
        {
          title: "Default",
          description: "Uncontrolled — defaults to the current month.",
          preview: (
            <div className="w-full max-w-xs">
              <MonthPicker />
            </div>
          ),
          code: `<MonthPicker />`,
          centered: false,
        },
        {
          title: "Controlled",
          description: "Bind value and onChange to manage the month in state.",
          preview: <ControlledMonthPicker />,
          code: `const [month, setMonth] = React.useState(new Date());

<MonthPicker value={month} onChange={setMonth} />`,
          centered: false,
        },
        {
          title: "Bounded range",
          description: "Restrict selection with minDate / maxDate.",
          preview: <BoundedMonthPicker />,
          code: `<MonthPicker
  minDate={new Date(2024, 0, 1)}
  maxDate={new Date(2026, 11, 1)}
/>`,
          centered: false,
        },
        {
          title: "Narrow container",
          description:
            "Selects shrink and truncate instead of overflowing on small widths.",
          preview: (
            <div className="w-56">
              <MonthPicker />
            </div>
          ),
          code: `<div className="w-56">
  <MonthPicker />
</div>`,
          centered: false,
        },
        {
          title: "Disabled",
          preview: (
            <div className="w-full max-w-xs">
              <MonthPicker disabled />
            </div>
          ),
          code: `<MonthPicker disabled />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value",
          type: "Date",
          description:
            "Controlled month (any date within the target month; day is ignored).",
        },
        {
          name: "defaultValue",
          type: "Date",
          default: "new Date()",
          description: "Initial month when uncontrolled.",
        },
        {
          name: "onChange",
          type: "(date: Date) => void",
          description: "Fires with the 1st of the newly selected month.",
        },
        {
          name: "minDate",
          type: "Date",
          description: "Earliest selectable month.",
        },
        {
          name: "maxDate",
          type: "Date",
          description: "Latest selectable month.",
        },
        {
          name: "monthFormat",
          type: '"long" | "short"',
          default: '"long"',
          description: "Month name display style.",
        },
        {
          name: "disabled",
          type: "boolean",
          default: "false",
          description: "Disables the entire control.",
        },
      ]}
    />
  );
}

function ControlledMonthPicker() {
  const [month, setMonth] = React.useState(new Date(2026, 6, 1));
  return (
    <div className="w-full max-w-xs space-y-2">
      <MonthPicker value={month} onChange={setMonth} />
      <p className="text-sm text-muted-foreground">
        Selected:{" "}
        <span className="font-medium text-foreground">
          {month.toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          })}
        </span>
      </p>
    </div>
  );
}

function BoundedMonthPicker() {
  const [month, setMonth] = React.useState(new Date(2025, 0, 1));
  return (
    <div className="w-full max-w-xs">
      <MonthPicker
        value={month}
        onChange={setMonth}
        minDate={new Date(2024, 0, 1)}
        maxDate={new Date(2026, 11, 1)}
      />
    </div>
  );
}
