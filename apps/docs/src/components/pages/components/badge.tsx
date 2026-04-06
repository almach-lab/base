import { Badge } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function BadgePage() {
  return (
    <ComponentDoc
      name="Badge"
      description="A small inline label for statuses, categories, or counts. Supports seven semantic variants."
      examples={[
        {
          title: "Variants",
          description: "All available visual styles.",
          preview: (
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="ghost">Ghost</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
          ),
          code: `<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="ghost">Ghost</Badge>
<Badge variant="destructive">Destructive</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>`,
        },
        {
          title: "In context",
          description: "Common usage patterns alongside other elements.",
          preview: (
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">API status</span>
                <Badge variant="success">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Build</span>
                <Badge variant="warning">Degraded</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Payments</span>
                <Badge variant="destructive">Outage</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Feature flag</span>
                <Badge variant="secondary">Beta</Badge>
              </div>
            </div>
          ),
          code: `<div className="flex items-center justify-between">
  <span>API status</span>
  <Badge variant="success">Operational</Badge>
</div>
<div className="flex items-center justify-between">
  <span>Build</span>
  <Badge variant="warning">Degraded</Badge>
</div>`,
          centered: false,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"default" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "warning"',
          default: '"default"',
          description: "Visual style of the badge.",
        },
      ]}
    />
  );
}
