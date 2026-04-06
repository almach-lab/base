"use client";

import { Toaster as SonnerToaster } from "sonner";
import "sonner/dist/styles.css";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      theme="system"
      toastOptions={{
        style: {
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))",
          color: "hsl(var(--foreground))",
        },
        classNames: {
          toast:
            "!bg-background !border !border-border !text-foreground !rounded-2xl !shadow-lg font-sans",
          title: "!text-sm !font-semibold",
          description: "!text-sm !text-muted-foreground",
          actionButton:
            "!text-xs !font-medium !bg-primary !text-primary-foreground",
          cancelButton:
            "!text-xs !font-medium !bg-muted !text-muted-foreground",
          closeButton:
            "!text-muted-foreground hover:!text-foreground !border-border !bg-background",
          error: "!border-destructive/35 !bg-background",
          success: "!border-success/35 !bg-background",
          warning: "!border-warning/35 !bg-background",
          info: "!border-border",
        },
      }}
    />
  );
}
