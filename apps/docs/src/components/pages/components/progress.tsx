import { Button, Progress } from "@almach/ui";
import * as React from "react";
import { ComponentDoc } from "../../component-doc";

export function ProgressPage() {
  return (
    <ComponentDoc
      name="Progress"
      description="A thin linear progress bar for showing task or upload completion."
      examples={[
        {
          title: "Default",
          description: "Pass a value between 0 and 100.",
          preview: (
            <div className="w-full max-w-sm space-y-5">
              {[
                { label: "Storage used", value: 72 },
                { label: "Bandwidth", value: 38 },
                { label: "Projects quota", value: 91 },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-sm">
                    <span className="font-medium">{label}</span>
                    <span className="text-muted-foreground">{value}%</span>
                  </div>
                  <Progress value={value} />
                </div>
              ))}
            </div>
          ),
          code: `<div className="mb-1.5 flex justify-between text-sm">
  <span>Storage used</span>
  <span className="text-muted-foreground">72%</span>
</div>
<Progress value={72} />`,
          centered: false,
        },
        {
          title: "Interactive",
          description: "Progress value can be updated dynamically.",
          preview: <InteractiveProgress />,
          code: `const [value, setValue] = React.useState(40);

<Progress value={value} />
<div className="flex gap-2 mt-3">
  <Button size="sm" variant="outline"
    onClick={() => setValue((v) => Math.max(0, v - 20))}>
    −20
  </Button>
  <Button size="sm"
    onClick={() => setValue((v) => Math.min(100, v + 20))}>
    +20
  </Button>
</div>`,
          centered: false,
        },
        {
          title: "Full and empty",
          description: "Edge cases: 0% and 100% values.",
          preview: (
            <div className="w-full max-w-sm space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">Not started</span>
                  <span className="text-muted-foreground">0%</span>
                </div>
                <Progress value={0} />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="font-medium">Complete</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <Progress value={100} />
              </div>
            </div>
          ),
          code: `<Progress value={0} />
<Progress value={100} />`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "value",
          type: "number | null",
          description: "Current progress (0–100). Defaults to 0 when omitted.",
        },
        {
          name: "max",
          type: "number",
          default: "100",
          description: "Maximum value of the progress bar.",
        },
      ]}
    />
  );
}

function InteractiveProgress() {
  const [value, setValue] = React.useState(40);
  return (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Upload progress</span>
        <span className="text-muted-foreground">{value}%</span>
      </div>
      <Progress value={value} />
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 20))}
          disabled={value === 0}
        >
          −20%
        </Button>
        <Button
          size="sm"
          onClick={() => setValue((v) => Math.min(100, v + 20))}
          disabled={value === 100}
        >
          +20%
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setValue(0)}>
          Reset
        </Button>
      </div>
    </div>
  );
}
