import React from "react";

function Bone({ className = "" }: { className?: string }) {
  return <div className={`rounded-md bg-muted animate-pulse ${className}`} />;
}

/** Skeleton that matches the ComponentDoc layout */
export function ComponentDocSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:px-8 space-y-10">
      {/* Header */}
      <div className="border-b pb-8 space-y-3">
        <Bone className="h-5 w-28" />
        <Bone className="h-9 w-48" />
        <Bone className="h-4 w-80 bg-muted/60" />
      </div>

      {/* Main viewer */}
      <div className="rounded-xl border overflow-hidden">
        <div className="flex gap-2 border-b bg-muted/20 px-3 h-10 items-center">
          <Bone className="h-5 w-16 bg-muted/60" />
          <Bone className="h-5 w-14 bg-muted/40" />
        </div>
        <div className="min-h-48 p-8 flex items-center justify-center bg-muted/5">
          <div className="space-y-3 w-full max-w-xs">
            <Bone className="h-9 w-full" />
            <Bone className="h-4 w-2/3 bg-muted/60" />
          </div>
        </div>
      </div>

      {/* Variant grid */}
      <div className="space-y-3">
        <Bone className="h-4 w-24 bg-muted/60" />
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border overflow-hidden">
              <div className="h-[200px] bg-muted/20 animate-pulse" />
              <div className="p-3 border-t bg-muted/10 flex justify-center">
                <Bone className="h-3 w-20 bg-muted/50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Skeleton for the home page hero */
export function HomeSkeleton() {
  return (
    <div>
      <section className="border-b">
        <div className="mx-auto max-w-screen-xl px-4 py-28 md:px-6 lg:py-36">
          <div className="mx-auto max-w-2xl space-y-6 animate-pulse">
            <Bone className="h-6 w-52 rounded-full bg-muted/50" />
            <Bone className="h-16 w-64" />
            <Bone className="h-4 w-full bg-muted/60" />
            <Bone className="h-4 w-4/5 bg-muted/50" />
            <div className="flex gap-3 pt-2">
              <Bone className="h-10 w-32 rounded-lg" />
              <Bone className="h-10 w-40 rounded-lg bg-muted/50" />
            </div>
            <Bone className="h-10 w-80 rounded-lg bg-muted/40" />
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-screen-xl px-4 py-20 md:px-6">
        <div className="mb-10 space-y-2 animate-pulse">
          <Bone className="h-3 w-32 bg-muted/50" />
          <Bone className="h-7 w-56" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border p-5 space-y-3">
              <Bone className="h-5 w-24" />
              <Bone className="h-4 w-full bg-muted/60" />
              <Bone className="h-4 w-3/4 bg-muted/50" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Skeleton for forms / query / components-index pages */
export function GenericPageSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8 animate-pulse space-y-12">
      <div className="space-y-4">
        <Bone className="h-10 w-64" />
        <Bone className="h-5 w-96 bg-muted/70" />
        <Bone className="h-4 w-80 bg-muted/50" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-xl border p-6 space-y-3">
            <Bone className="h-5 w-28" />
            <Bone className="h-4 w-full bg-muted/60" />
            <Bone className="h-4 w-3/4 bg-muted/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
