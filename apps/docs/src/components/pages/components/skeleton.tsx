import { Skeleton } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function SkeletonPage() {
  return (
    <ComponentDoc
      name="Skeleton"
      description="A shimmer placeholder shown while content is loading. Shape presets cover the common cases; className still controls exact dimensions."
      examples={[
        {
          title: "Presets",
          description:
            "Shape variants for the shapes you reach for most often.",
          preview: (
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton variant="avatar" />
              <Skeleton variant="circle" className="size-12" />
              <Skeleton variant="text" className="w-32" />
              <Skeleton variant="button" className="w-24" />
              <Skeleton variant="input" className="max-w-48" />
              <Skeleton className="size-12" />
            </div>
          ),
          code: `<Skeleton variant="avatar" />
<Skeleton variant="circle" className="size-12" />
<Skeleton variant="text" className="w-32" />
<Skeleton variant="button" className="w-24" />
<Skeleton variant="input" className="max-w-48" />
<Skeleton className="size-12" />`,
        },
        {
          title: "Paragraph",
          description:
            "Skeleton.Text renders a stack of lines with a shortened last line.",
          preview: (
            <div className="w-full max-w-sm">
              <Skeleton.Text lines={4} />
            </div>
          ),
          code: `<Skeleton.Text lines={4} />`,
          centered: false,
        },
        {
          title: "Profile card",
          description: "A realistic loading state for a user card.",
          preview: (
            <div className="w-full max-w-sm space-y-4 rounded-xl border p-5">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-36 w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-16 rounded-lg" />
              </div>
            </div>
          ),
          code: `<div className="space-y-4 rounded-xl border p-5">
  {/* Avatar + name */}
  <div className="flex items-center gap-3">
    <Skeleton className="h-10 w-10 rounded-full" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-3 w-20" />
    </div>
  </div>

  {/* Image */}
  <Skeleton className="h-36 w-full rounded-lg" />

  {/* Body text */}
  <div className="space-y-2">
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <Skeleton className="h-4 w-3/4" />
  </div>

  {/* Actions */}
  <div className="flex gap-2">
    <Skeleton className="h-8 w-20 rounded-lg" />
    <Skeleton className="h-8 w-16 rounded-lg" />
  </div>
</div>`,
          centered: false,
        },
        {
          title: "Table rows",
          description: "Skeleton rows for a loading data table.",
          preview: (
            <div className="w-full max-w-sm space-y-2">
              {/* Header */}
              <div className="flex items-center gap-3 pb-2 border-b">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded ml-auto" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5">
                  <Skeleton className="h-7 w-7 rounded-full shrink-0" />
                  <Skeleton
                    className="h-3 rounded flex-1"
                    style={{ width: `${50 + ((i * 11) % 40)}%` }}
                  />
                  <Skeleton className="h-5 w-14 rounded-full shrink-0" />
                </div>
              ))}
            </div>
          ),
          code: `{Array.from({ length: 5 }).map((_, i) => (
  <div key={i} className="flex items-center gap-3 py-1.5">
    <Skeleton className="h-7 w-7 rounded-full" />
    <Skeleton className="h-3 flex-1 rounded" />
    <Skeleton className="h-5 w-14 rounded-full" />
  </div>
))}`,
          centered: false,
        },
        {
          title: "Shapes",
          description:
            "Control shape entirely via className border-radius utilities.",
          preview: (
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-12 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-md" />
              <Skeleton className="h-12 w-12 rounded-none" />
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          ),
          code: `<Skeleton className="h-12 w-12 rounded-full" />
<Skeleton className="h-12 w-12 rounded-xl" />
<Skeleton className="h-12 w-12 rounded-md" />
<Skeleton className="h-12 w-12 rounded-none" />
<Skeleton className="h-4 w-32 rounded" />
<Skeleton className="h-6 w-20 rounded-full" />`,
        },
      ]}
      props={[
        {
          name: "variant",
          type: '"rect" | "text" | "circle" | "button" | "input" | "avatar"',
          default: '"rect"',
          description:
            "Shape preset. Each one sets a sensible radius, and some set a height too.",
        },
        {
          name: "className",
          type: "string",
          description:
            "Tailwind classes for exact dimensions. Always needed for width, and for height on the rect and circle variants.",
        },
        {
          name: "Skeleton.Text lines",
          type: "number",
          default: "3",
          description: "Number of placeholder lines to render.",
        },
        {
          name: "Skeleton.Text lastLineWidth",
          type: "string",
          default: '"60%"',
          description:
            "Width of the final line, shortened so the block reads as a paragraph.",
        },
      ]}
    />
  );
}
