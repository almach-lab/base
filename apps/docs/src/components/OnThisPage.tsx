"use client";

import { cn } from "@almach/utils";
import * as React from "react";

interface HeadingItem {
  id: string;
  title: string;
  level: 2 | 3;
}

const HEADING_SELECTOR = "#main-content h2, #main-content h3";

function getScrollOffset() {
  const main = document.getElementById("main-content");
  const header = document.querySelector("header");

  if (main && main.scrollHeight > main.clientHeight) {
    return main.getBoundingClientRect().top + 24;
  }

  return (header?.getBoundingClientRect().height ?? 56) + 24;
}

function collectHeadings(): HeadingItem[] {
  const headingNodes = Array.from(
    document.querySelectorAll<HTMLElement>(HEADING_SELECTOR),
  );

  const seenIds = new Set<string>();
  const headings: HeadingItem[] = [];

  for (const heading of headingNodes) {
    const anchor =
      heading.id.length > 0 ? heading : heading.closest<HTMLElement>("[id]");
    const id = anchor?.id?.trim();
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

function headingsEqual(a: HeadingItem[], b: HeadingItem[]) {
  return (
    a.length === b.length &&
    a.every((heading, index) => heading.id === b[index]?.id)
  );
}

function useDocHeadings() {
  const [headings, setHeadings] = React.useState<HeadingItem[]>([]);

  React.useEffect(() => {
    const main = document.getElementById("main-content");

    const refresh = () => {
      const next = collectHeadings();
      setHeadings((current) =>
        headingsEqual(current, next) ? current : next,
      );
    };

    refresh();
    const rafId = requestAnimationFrame(refresh);
    const retryIds = [100, 400, 1000].map((delay) =>
      window.setTimeout(refresh, delay),
    );

    const observer = new MutationObserver(refresh);
    if (main) {
      observer.observe(main, { childList: true, subtree: true });
    }

    document.addEventListener("astro:after-swap", refresh);
    window.addEventListener("hashchange", refresh);

    return () => {
      cancelAnimationFrame(rafId);
      for (const id of retryIds) window.clearTimeout(id);
      observer.disconnect();
      document.removeEventListener("astro:after-swap", refresh);
      window.removeEventListener("hashchange", refresh);
    };
  }, []);

  return headings;
}

export function OnThisPage() {
  const headings = useDocHeadings();
  const [activeId, setActiveId] = React.useState("");

  React.useEffect(() => {
    if (headings.length === 0) {
      setActiveId("");
      return;
    }

    setActiveId((current) => {
      if (current && headings.some((heading) => heading.id === current)) {
        return current;
      }

      const hash = window.location.hash.slice(1);
      if (hash && headings.some((heading) => heading.id === hash)) {
        return hash;
      }

      return headings[0]?.id ?? "";
    });
  }, [headings]);

  React.useEffect(() => {
    const firstHeading = headings[0];
    if (!firstHeading) return;

    const updateActiveHeading = () => {
      const scrollOffset = getScrollOffset();
      let nextActive = firstHeading.id;

      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;

        if (element.getBoundingClientRect().top <= scrollOffset) {
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

    const main = document.getElementById("main-content");
    main?.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveHeading);
    document.addEventListener("astro:after-swap", updateActiveHeading);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      main?.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveHeading);
      document.removeEventListener("astro:after-swap", updateActiveHeading);
    };
  }, [headings]);

  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="pb-2" aria-label="On this page">
      <p className="mb-2.5 text-xs font-medium text-muted-foreground/70">
        On this page
      </p>

      <div className="flex flex-col border-l border-border/40">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <a
              key={heading.id}
              href={`#${heading.id}`}
              aria-current={isActive ? "location" : undefined}
              onClick={() => setActiveId(heading.id)}
              className={cn(
                "relative block border-l-2 -ml-px py-1 text-[13px] leading-5 transition-[color,border-color] duration-150",
                heading.level === 3 ? "pl-5" : "pl-3",
                isActive
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground/80 hover:text-foreground",
              )}
            >
              {heading.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
