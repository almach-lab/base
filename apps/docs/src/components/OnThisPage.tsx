"use client";

import { cn } from "@almach/utils";
import * as React from "react";

interface HeadingItem {
  id: string;
  title: string;
  level: 2 | 3;
}

const HEADING_SELECTOR = "#main-content h2, #main-content h3";

function collectHeadings(): HeadingItem[] {
  const headingNodes = Array.from(
    document.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
  );

  const seenIds = new Set<string>();
  const headings: HeadingItem[] = [];

  for (const heading of headingNodes) {
    const closestAnchor =
      heading.id.length > 0 ? heading : heading.closest<HTMLElement>("[id]");
    const id = closestAnchor?.id?.trim();
    const title = heading.textContent?.trim();

    if (!id || !title || seenIds.has(id)) {
      continue;
    }

    seenIds.add(id);

    headings.push({
      id,
      title,
      level: heading.tagName === "H3" ? 3 : 2,
    });
  }

  return headings;
}

export function OnThisPage() {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");

  React.useEffect(() => {
    const refreshHeadings = () => {
      const nextHeadings = collectHeadings();
      setHeadings(nextHeadings);
      setActiveId(nextHeadings[0]?.id ?? "");
    };

    refreshHeadings();

    document.addEventListener("astro:after-swap", refreshHeadings);
    window.addEventListener("hashchange", refreshHeadings);

    return () => {
      document.removeEventListener("astro:after-swap", refreshHeadings);
      window.removeEventListener("hashchange", refreshHeadings);
    };
  }, []);

  React.useEffect(() => {
    const firstHeading = headings[0];

    if (!firstHeading) {
      return;
    }

    const updateActiveHeading = () => {
      let nextActive = firstHeading.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);

        if (!element) {
          continue;
        }

        if (element.getBoundingClientRect().top <= 160) {
          nextActive = heading.id;
        } else {
          break;
        }
      }

      setActiveId(nextActive);
    };

    let rafId = 0;
    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        updateActiveHeading();
      });
    };

    updateActiveHeading();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveHeading);
    document.addEventListener("astro:after-swap", updateActiveHeading);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveHeading);
      document.removeEventListener("astro:after-swap", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-20">
      <p className="mb-4 px-1 text-xs font-semibold uppercase tracking-[0.12em] text-sidebar-foreground/50">
        On this page
      </p>

      <nav
        className="border-l border-sidebar-border/60 pl-2.5"
        aria-label="On this page"
      >
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              className={cn(
                "mb-0.5 block rounded-md py-1.5 pr-2 text-[13px] leading-relaxed transition-colors",
                heading.level === 3 ? "pl-3" : "pl-1.5",
                isActive
                  ? "bg-sidebar-accent text-sidebar-foreground shadow-[inset_0_0_0_1px_hsl(var(--sidebar-border)/0.55)]"
                  : "text-sidebar-foreground/68 hover:bg-sidebar-accent/55 hover:text-sidebar-foreground",
              )}
            >
              {heading.title}
            </a>
          );
        })}
      </nav>
    </div>
  );
}
