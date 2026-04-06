import { Alert } from "@almach/ui";
import { AlertCircle, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { ComponentDoc } from "../../component-doc";

export function AlertPage() {
  return (
    <ComponentDoc
      name="Alert"
      description="Inline feedback messages for information, success, warning, and error states. Composed from Icon, Body, Title, and Description sub-components."
      examples={[
        {
          title: "Variants",
          description:
            "Four semantic variants for different feedback contexts.",
          preview: (
            <div className="w-full max-w-lg space-y-3">
              <Alert>
                <Alert.Icon>
                  <Info className="h-4 w-4" />
                </Alert.Icon>
                <Alert.Body>
                  <Alert.Title>Information</Alert.Title>
                  <Alert.Description>
                    Your session expires in 30 minutes.
                  </Alert.Description>
                </Alert.Body>
              </Alert>

              <Alert variant="success">
                <Alert.Icon>
                  <CheckCircle className="h-4 w-4" />
                </Alert.Icon>
                <Alert.Body>
                  <Alert.Title>Changes saved</Alert.Title>
                  <Alert.Description>
                    Your profile has been updated successfully.
                  </Alert.Description>
                </Alert.Body>
              </Alert>

              <Alert variant="warning">
                <Alert.Icon>
                  <AlertTriangle className="h-4 w-4" />
                </Alert.Icon>
                <Alert.Body>
                  <Alert.Title>Approaching limit</Alert.Title>
                  <Alert.Description>
                    You've used 90% of your storage quota.
                  </Alert.Description>
                </Alert.Body>
              </Alert>

              <Alert variant="destructive">
                <Alert.Icon>
                  <AlertCircle className="h-4 w-4" />
                </Alert.Icon>
                <Alert.Body>
                  <Alert.Title>Payment failed</Alert.Title>
                  <Alert.Description>
                    Please update your billing information.
                  </Alert.Description>
                </Alert.Body>
              </Alert>
            </div>
          ),
          code: `<Alert>
  <Alert.Icon><Info className="h-4 w-4" /></Alert.Icon>
  <Alert.Body>
    <Alert.Title>Information</Alert.Title>
    <Alert.Description>Your session expires in 30 minutes.</Alert.Description>
  </Alert.Body>
</Alert>

<Alert variant="success">
  <Alert.Icon><CheckCircle className="h-4 w-4" /></Alert.Icon>
  <Alert.Body>
    <Alert.Title>Changes saved</Alert.Title>
    <Alert.Description>Your profile has been updated successfully.</Alert.Description>
  </Alert.Body>
</Alert>

<Alert variant="warning">
  <Alert.Icon><AlertTriangle className="h-4 w-4" /></Alert.Icon>
  <Alert.Body>
    <Alert.Title>Approaching limit</Alert.Title>
    <Alert.Description>You've used 90% of your storage quota.</Alert.Description>
  </Alert.Body>
</Alert>

<Alert variant="destructive">
  <Alert.Icon><AlertCircle className="h-4 w-4" /></Alert.Icon>
  <Alert.Body>
    <Alert.Title>Payment failed</Alert.Title>
    <Alert.Description>Please update your billing information.</Alert.Description>
  </Alert.Body>
</Alert>`,
          centered: false,
        },
        {
          title: "Without icon",
          description:
            "Alert.Icon is optional — the body fills the full width.",
          preview: (
            <div className="w-full max-w-lg space-y-3">
              <Alert variant="warning">
                <Alert.Body>
                  <Alert.Title>Scheduled maintenance</Alert.Title>
                  <Alert.Description>
                    The platform will be unavailable on Sunday from 2:00–4:00 AM
                    UTC.
                  </Alert.Description>
                </Alert.Body>
              </Alert>
              <Alert variant="destructive">
                <Alert.Body>
                  <Alert.Title>Account suspended</Alert.Title>
                  <Alert.Description>
                    Contact support to restore access to your account.
                  </Alert.Description>
                </Alert.Body>
              </Alert>
            </div>
          ),
          code: `<Alert variant="warning">
  <Alert.Body>
    <Alert.Title>Scheduled maintenance</Alert.Title>
    <Alert.Description>
      The platform will be unavailable on Sunday from 2:00–4:00 AM UTC.
    </Alert.Description>
  </Alert.Body>
</Alert>`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"default" | "success" | "warning" | "destructive"',
          default: '"default"',
          description: "Controls the color scheme and semantic meaning.",
        },
        {
          name: "Alert.Icon",
          type: "React.HTMLAttributes<HTMLDivElement>",
          description:
            "Optional icon slot. Icons are sized to 16×16 px automatically.",
        },
        {
          name: "Alert.Title",
          type: "React.HTMLAttributes<HTMLHeadingElement>",
          description: "Short, bold label for the alert.",
        },
        {
          name: "Alert.Description",
          type: "React.HTMLAttributes<HTMLParagraphElement>",
          description: "Longer supporting text at 90% opacity.",
        },
      ]}
    />
  );
}
