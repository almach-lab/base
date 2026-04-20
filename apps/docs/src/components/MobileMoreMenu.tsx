"use client";

import { ExternalLink, MoreVertical, Palette } from "lucide-react";
import * as React from "react";
import { ThemeModeToggle } from "./ThemeModeToggle";

export function MobileMoreMenu() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const closeOnSwap = () => setIsOpen(false);
    document.addEventListener("astro:before-swap", closeOnSwap);

    return () => {
      document.removeEventListener("astro:before-swap", closeOnSwap);
    };
  }, []);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const onClickOutside = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      const wrapper = document.getElementById("mobile-more-menu");
      if (!wrapper?.contains(target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [isOpen]);

  return (
    <div id="mobile-more-menu" className="relative lg:hidden">
      <button
        onClick={() => setIsOpen((open) => !open)}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label="More options"
        aria-expanded={isOpen}
      >
        <MoreVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-border bg-background p-2 shadow-xl">
          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent("almach-customizer-toggle"));
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <Palette className="h-4 w-4" aria-hidden="true" />
            Theme Editor
          </button>

          <ThemeModeToggle compact={false} onToggled={() => setIsOpen(false)} />

          <div className="my-1 h-px bg-border" />

          <a
            href="/llms"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            For LLMs
          </a>

          <div className="my-1 h-px bg-border" />

          <a
            href="https://github.com/almach-lab/base"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            onClick={() => setIsOpen(false)}
          >
            GitHub
            <ExternalLink
              className="ml-auto h-3.5 w-3.5 opacity-60"
              aria-hidden="true"
            />
          </a>
        </div>
      )}
    </div>
  );
}
