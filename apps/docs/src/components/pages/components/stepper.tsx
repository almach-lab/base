import { Button, Stepper } from "@almach/ui";
import { useState } from "react";
import { ComponentDoc } from "../../component-doc";

const STEPS = [
  { title: "Account", description: "Email and password" },
  { title: "Profile", description: "Name and avatar" },
  { title: "Billing", description: "Card details" },
  { title: "Done", description: "Review and finish" },
];

function StepperDemo() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex w-full flex-col gap-6">
      <Stepper activeStep={step}>
        {STEPS.map((item) => (
          <Stepper.Item
            key={item.title}
            title={item.title}
            description={item.description}
          />
        ))}
      </Stepper>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onPress={() => setStep((value) => Math.max(value - 1, 0))}
          isDisabled={step === 0}
        >
          Back
        </Button>
        <Button
          size="sm"
          onPress={() =>
            setStep((value) => Math.min(value + 1, STEPS.length - 1))
          }
          isDisabled={step === STEPS.length - 1}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function StepperPage() {
  return (
    <ComponentDoc
      name="Stepper"
      description="Progress through a multi-step flow. Status is derived from activeStep, so you only track one number."
      examples={[
        {
          title: "Horizontal",
          description:
            "Completed steps show a check; the current step is ringed.",
          preview: <StepperDemo />,
          code: `const [step, setStep] = useState(1);

<Stepper activeStep={step}>
  <Stepper.Item title="Account" description="Email and password" />
  <Stepper.Item title="Profile" description="Name and avatar" />
  <Stepper.Item title="Billing" description="Card details" />
  <Stepper.Item title="Done" description="Review and finish" />
</Stepper>`,
          centered: false,
        },
        {
          title: "Vertical",
          description: "Better for long flows and narrow columns.",
          preview: (
            <Stepper activeStep={2} orientation="vertical" className="max-w-xs">
              {STEPS.map((item) => (
                <Stepper.Item
                  key={item.title}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </Stepper>
          ),
          code: `<Stepper activeStep={2} orientation="vertical">
  <Stepper.Item title="Account" description="Email and password" />
</Stepper>`,
        },
      ]}
      props={[
        {
          name: "activeStep",
          type: "number",
          required: true,
          description: "Index of the current step, 0-indexed.",
        },
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Layout direction.",
        },
        {
          name: "Stepper.Item title",
          type: "React.ReactNode",
          required: true,
          description: "Step label.",
        },
        {
          name: "Stepper.Item description",
          type: "React.ReactNode",
          description: "Supporting line under the label.",
        },
        {
          name: "Stepper.Item status",
          type: '"complete" | "current" | "upcoming"',
          description:
            "Override the status derived from activeStep — useful for error states.",
        },
        {
          name: "Stepper.Item icon",
          type: "React.ReactNode",
          description: "Replace the number or check indicator.",
        },
      ]}
    />
  );
}
