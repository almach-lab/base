import { Skeleton } from "@almach/ui";
import { ComponentDoc } from "../../component-doc";

export function SkeletonPage() {
  return (
    <ComponentDoc
      name="Skeleton"
      description="A shimmer placeholder shown while content is loading. Size and shape it entirely via className."
      examples={[
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
          name: "className",
          type: "string",
          description:
            "Tailwind classes to set the dimensions and border-radius of the skeleton. Width, height, and shape are entirely controlled here.",
        },
      ]}
    />
  );
}
