import { Avatar } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function AvatarPage() {
  return (
    <ComponentDoc
      name="Avatar"
      description="User avatar with image support, automatic fallback initials, and four size variants."
      examples={[
        {
          title: "With image",
          description:
            "Image loads first; fallback renders if it fails or is missing.",
          preview: (
            <div className="flex items-end gap-4">
              {(["sm", "default", "lg", "xl"] as const).map((size) => (
                <div key={size} className="flex flex-col items-center gap-2">
                  <Avatar size={size}>
                    <Avatar.Image
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&h=128&fit=crop&crop=face"
                      alt="User avatar"
                    />
                    <Avatar.Fallback>AB</Avatar.Fallback>
                  </Avatar>
                  <span className="text-[11px] text-muted-foreground">
                    {size}
                  </span>
                </div>
              ))}
            </div>
          ),
          code: `{/* sm · default · lg · xl */}
<Avatar size="sm">
  <Avatar.Image src="…" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>

<Avatar>
  <Avatar.Image src="…" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>

<Avatar size="lg">
  <Avatar.Image src="…" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>

<Avatar size="xl">
  <Avatar.Image src="…" alt="User avatar" />
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>`,
        },
        {
          title: "Fallback initials",
          description:
            "When no image is available the fallback shows initials on a muted background.",
          preview: (
            <div className="flex items-center gap-3">
              {[
                { initials: "AB", size: "sm" as const },
                { initials: "CD", size: "default" as const },
                { initials: "EF", size: "lg" as const },
                { initials: "GH", size: "xl" as const },
              ].map(({ initials, size }) => (
                <Avatar key={initials} size={size}>
                  <Avatar.Fallback>{initials}</Avatar.Fallback>
                </Avatar>
              ))}
            </div>
          ),
          code: `<Avatar size="sm">
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar>

<Avatar>
  <Avatar.Fallback>CD</Avatar.Fallback>
</Avatar>

<Avatar size="lg">
  <Avatar.Fallback>EF</Avatar.Fallback>
</Avatar>`,
        },
        {
          title: "Avatar group",
          description:
            "Overlap multiple avatars using negative margin and a ring to separate them.",
          preview: (
            <div className="flex -space-x-2">
              {[
                {
                  src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
                  initials: "AB",
                },
                {
                  src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
                  initials: "CD",
                },
                {
                  src: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop&crop=face",
                  initials: "EF",
                },
                { initials: "+4" },
              ].map(({ src, initials }) => (
                <Avatar key={initials} className="ring-2 ring-background">
                  {src && <Avatar.Image src={src} alt={initials} />}
                  <Avatar.Fallback className="text-[11px]">
                    {initials}
                  </Avatar.Fallback>
                </Avatar>
              ))}
            </div>
          ),
          code: `<div className="flex -space-x-2">
  <Avatar className="ring-2 ring-background">
    <Avatar.Image src="…" alt="Alice" />
    <Avatar.Fallback>AB</Avatar.Fallback>
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <Avatar.Image src="…" alt="Bob" />
    <Avatar.Fallback>CD</Avatar.Fallback>
  </Avatar>
  <Avatar className="ring-2 ring-background">
    <Avatar.Fallback>+4</Avatar.Fallback>
  </Avatar>
</div>`,
        },
      ]}
      props={[
        {
          name: "size",
          type: '"sm" | "default" | "lg" | "xl"',
          default: '"default"',
          description:
            "Diameter of the avatar (sm=24 px, default=36 px, lg=48 px, xl=64 px).",
        },
        {
          name: "Avatar.Image src",
          type: "string",
          required: true,
          description: "URL of the avatar image.",
        },
        {
          name: "Avatar.Image alt",
          type: "string",
          required: true,
          description: "Accessible description of the image.",
        },
        {
          name: "Avatar.Fallback",
          type: "ReactNode",
          description:
            "Content shown when the image is missing or fails to load.",
        },
      ]}
    />
  );
}
