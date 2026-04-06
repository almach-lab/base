import { Separator } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function SeparatorPage() {
  return (
    <ComponentDoc
      name="Separator"
      description="A 1 px divider line for separating content sections. Supports horizontal and vertical orientations."
      examples={[
        {
          title: "Horizontal",
          description: "Default orientation. Divides stacked sections.",
          preview: (
            <div className="w-full max-w-sm space-y-4">
              <div>
                <p className="text-sm font-medium">Personal information</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Your name, email, and profile photo.
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Security</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Password, 2FA, and active sessions.
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  Choose how and when you hear from us.
                </p>
              </div>
            </div>
          ),
          code: `<div>
  <p className="text-sm font-medium">Personal information</p>
  <p className="text-sm text-muted-foreground">Your name, email, and profile photo.</p>
</div>
<Separator />
<div>
  <p className="text-sm font-medium">Security</p>
  <p className="text-sm text-muted-foreground">Password, 2FA, and active sessions.</p>
</div>`,
          centered: false,
        },
        {
          title: "Vertical",
          description: 'Use orientation="vertical" for inline dividers.',
          preview: (
            <div className="flex h-6 items-center gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Blog
              </a>
              <Separator orientation="vertical" />
              <a href="#" className="hover:text-foreground transition-colors">
                Docs
              </a>
              <Separator orientation="vertical" />
              <a href="#" className="hover:text-foreground transition-colors">
                GitHub
              </a>
              <Separator orientation="vertical" />
              <a href="#" className="hover:text-foreground transition-colors">
                Changelog
              </a>
            </div>
          ),
          code: `<div className="flex h-6 items-center gap-4 text-sm">
  <a href="#">Blog</a>
  <Separator orientation="vertical" />
  <a href="#">Docs</a>
  <Separator orientation="vertical" />
  <a href="#">GitHub</a>
</div>`,
        },
        {
          title: "With label",
          description: "Decorative separator with centered label text.",
          preview: (
            <div className="w-full max-w-xs">
              <div className="relative flex items-center">
                <Separator className="flex-1" />
                <span className="mx-3 text-xs text-muted-foreground">
                  OR CONTINUE WITH
                </span>
                <Separator className="flex-1" />
              </div>
            </div>
          ),
          code: `<div className="relative flex items-center">
  <Separator className="flex-1" />
  <span className="mx-3 text-xs text-muted-foreground">OR CONTINUE WITH</span>
  <Separator className="flex-1" />
</div>`,
        },
      ]}
      props={[
        {
          name: "orientation",
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: "Direction of the separator line.",
        },
        {
          name: "decorative",
          type: "boolean",
          default: "true",
          description:
            "When true, the separator is hidden from assistive technology (role='none').",
        },
      ]}
    />
  );
}
