"use client";

import { cn } from "@almach/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";
import { buttonVariants } from "./button.js";

/* ── Context ──────────────────────────────────────────────────────────────── */
interface CarouselCtx {
  viewportRef: React.RefObject<HTMLDivElement | null>;
  index: number;
  count: number;
  scrollTo: (i: number) => void;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  syncIndex: () => void;
}

const CarouselContext = React.createContext<CarouselCtx | null>(null);

const useCarousel = () => {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("Must be used inside <Carousel>");
  return ctx;
};

/* ── Root ─────────────────────────────────────────────────────────────────── */
interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  loop?: boolean;
}

function CarouselRoot({
  className,
  children,
  loop = false,
  ...props
}: CarouselProps) {
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [index, setIndex] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const update = () =>
      setCount(el.querySelectorAll("[data-carousel-item]").length);
    update();
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true, subtree: false });
    return () => mo.disconnect();
  }, []);

  const syncIndex = React.useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setIndex(closest);
  }, []);

  const scrollTo = React.useCallback((i: number) => {
    const el = viewportRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    if (!items[i]) return;
    el.scrollTo({ left: items[i].offsetLeft, behavior: "smooth" });
    setIndex(i);
  }, []);

  const scrollPrev = React.useCallback(() => {
    scrollTo(index === 0 ? (loop ? count - 1 : 0) : index - 1);
  }, [index, count, loop, scrollTo]);

  const scrollNext = React.useCallback(() => {
    scrollTo(index === count - 1 ? (loop ? 0 : count - 1) : index + 1);
  }, [index, count, loop, scrollTo]);

  return (
    <CarouselContext.Provider
      value={{
        viewportRef,
        index,
        count,
        scrollTo,
        scrollPrev,
        scrollNext,
        canScrollPrev: loop || index > 0,
        canScrollNext: loop || index < count - 1,
        syncIndex,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        className={cn("relative", className)}
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

/* ── Content ──────────────────────────────────────────────────────────────── */
function CarouselContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { viewportRef, scrollTo, syncIndex } = useCarousel();
  const drag = React.useRef({ active: false, startX: 0, scrollLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle mouse (not touch — touch is handled natively)
    if (e.pointerType === "touch") return;
    const el = viewportRef.current;
    if (!el) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      scrollLeft: el.scrollLeft,
    };
    el.setPointerCapture(e.pointerId);
    el.style.scrollBehavior = "auto";
    el.style.cursor = "grabbing";
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const el = viewportRef.current;
    if (!el) return;
    el.scrollLeft = drag.current.scrollLeft - (e.clientX - drag.current.startX);
  };

  const onPointerUp = (_e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    const el = viewportRef.current;
    if (!el) return;
    el.style.scrollBehavior = "";
    el.style.cursor = "";
    // snap to nearest slide
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    let closest = 0;
    let minDist = Infinity;
    items.forEach((item, i) => {
      const dist = Math.abs(item.offsetLeft - el.scrollLeft);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    scrollTo(closest);
  };

  return (
    <div className="overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          "flex snap-x snap-mandatory overflow-x-auto scroll-smooth",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
          "cursor-grab select-none",
          "-ml-4",
          className,
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onScroll={syncIndex}
        {...props}
      />
    </div>
  );
}

/* ── Item ─────────────────────────────────────────────────────────────────── */
function CarouselItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-carousel-item
      role="group"
      aria-roledescription="slide"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full snap-start pl-4",
        className,
      )}
      {...props}
    />
  );
}

/* ── Previous ─────────────────────────────────────────────────────────────── */
function CarouselPrevious({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      className={cn(
        buttonVariants({ variant: "outline", size: "icon-sm" }),
        "absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-sm",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-4 w-4" />
    </button>
  );
}

/* ── Next ─────────────────────────────────────────────────────────────────── */
function CarouselNext({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      className={cn(
        buttonVariants({ variant: "outline", size: "icon-sm" }),
        "absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full shadow-sm",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-4 w-4" />
    </button>
  );
}

/* ── Dots ─────────────────────────────────────────────────────────────────── */
function CarouselDots({ className }: { className?: string }) {
  const { index, count, scrollTo } = useCarousel();
  return (
    <div className={cn("flex justify-center gap-1.5 pt-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          onClick={() => scrollTo(i)}
          aria-label={`Go to slide ${i + 1}`}
          aria-current={i === index}
          className={cn(
            "h-1.5 rounded-full transition-all duration-300",
            i === index
              ? "w-4 bg-foreground"
              : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60",
          )}
        />
      ))}
    </div>
  );
}

/* ── Compound export ──────────────────────────────────────────────────────── */
export const Carousel = Object.assign(CarouselRoot, {
  Content: CarouselContent,
  Item: CarouselItem,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Dots: CarouselDots,
});
