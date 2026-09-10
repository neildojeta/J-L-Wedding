import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useGalleryItems, type BundledPhoto } from "../hooks/useGalleryItems";
import { Lightbox } from "./Lightbox";
import { GalleryEmpty } from "./GalleryEmpty";
import type { MediaCategory } from "../lib/supabase";

interface Props {
  category: MediaCategory;
  emptyLabel?: string;
  tone?: "dark" | "light";
  bundled?: readonly BundledPhoto[];
  /** Named for screen readers, e.g. "Highlights". */
  label: string;
}

/**
 * A gallery that slides sideways instead of stacking into a grid.
 *
 * The sliding is done by the browser: a scroll-snapping overflow container,
 * so a phone swipe and a trackpad flick both feel native and cost no
 * JavaScript. The arrows and dots below drive the same container, and the
 * current slide is read back off its scroll position rather than being held
 * in state — that way dragging, arrows and dots can never disagree.
 *
 * Slides are deliberately narrower than the track, so the next photo peeks
 * in at the edge. That peek is the thing that tells a guest it slides.
 */
export function MediaCarousel({
  category,
  emptyLabel = "Photos coming soon.",
  tone = "dark",
  bundled,
  label,
}: Props) {
  const { items, loading, error } = useGalleryItems(category, bundled);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Where the track can actually come to rest, and which photo starts each
  // of those positions. Not one per photo: slides snap to the left edge but
  // the track stops once its right edge is reached, so the last few slides
  // all share one final position. A dot per photo would leave the trailing
  // dots unreachable — clicking them would light up a different one.
  const [stops, setStops] = useState<{ left: number; photo: number }[]>([
    { left: 0, photo: 0 },
  ]);
  const [current, setCurrent] = useState(0);

  // Read the position back off the track. Runs on scroll and on resize,
  // coalesced into an animation frame so a fast swipe doesn't thrash.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let frame = 0;
    const measure = () => {
      frame = 0;
      const { scrollLeft, clientWidth, scrollWidth } = track;
      const maxScroll = Math.max(0, scrollWidth - clientWidth);

      const next: { left: number; photo: number }[] = [];
      Array.from(track.children).forEach((child, photo) => {
        const left = Math.min((child as HTMLElement).offsetLeft, maxScroll);
        // A couple of pixels of slack: offsets are fractional on zoom and
        // on high-DPI screens, so exact comparisons never coincide.
        if (!next.some((stop) => Math.abs(stop.left - left) < 2)) {
          next.push({ left, photo });
        }
      });

      setStops((previous) =>
        previous.length === next.length &&
        previous.every((stop, i) => Math.abs(stop.left - next[i].left) < 2)
          ? previous
          : next,
      );

      let nearest = 0;
      let shortest = Infinity;
      next.forEach((stop, index) => {
        const distance = Math.abs(stop.left - scrollLeft);
        if (distance < shortest) {
          shortest = distance;
          nearest = index;
        }
      });
      setCurrent(nearest);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    track.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items.length]);

  const slideTo = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const stop = stops[index];
      if (!track || !stop) return;
      track.scrollTo({ left: stop.left, behavior: reduceMotion ? "auto" : "smooth" });
    },
    [reduceMotion, stops],
  );

  const step = useCallback(
    (direction: -1 | 1) => {
      slideTo(Math.min(Math.max(current + direction, 0), stops.length - 1));
    },
    [slideTo, current, stops.length],
  );

  if (loading && items.length === 0) {
    return (
      <div className="flex gap-5" aria-busy="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="painted-edge aspect-[4/3] flex-1 animate-pulse bg-gold-soft/25"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <GalleryEmpty message={emptyLabel} error={error} tone={tone} />;
  }

  const many = items.length > 1;

  return (
    <>
      <div className="relative">
        {/* The track. tabIndex makes it focusable, which is what gives a
            keyboard user the browser's own arrow-key scrolling. */}
        <div
          ref={trackRef}
          role="group"
          aria-roledescription="carousel"
          aria-label={label}
          tabIndex={0}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 sm:gap-7"
        >
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: Math.min(index, 4) * 0.06 }}
              whileHover={{ y: -4 }}
              aria-label={item.caption ?? `Open ${item.media_type}`}
              className="photo-frame group aspect-[4/3] w-[84%] shrink-0 cursor-zoom-in snap-start sm:w-[58%] lg:w-[44%]"
            >
              {item.media_type === "video" ? (
                <>
                  <video src={item.url} muted playsInline preload="metadata" />
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cream/70 bg-maroon/70 text-cream backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"
                  >
                    &#9654;
                  </span>
                </>
              ) : (
                <img
                  src={item.url}
                  alt={item.caption ?? ""}
                  loading={index < 2 ? "eager" : "lazy"}
                  className="transition-transform duration-[1200ms] group-hover:scale-[1.06]"
                />
              )}
              {item.caption && (
                // Always legible here, rather than on hover as in the grid:
                // a carousel is as much a touch control as a mouse one, and
                // a caption that needs a pointer never appears on a phone.
                <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-maroon-950/92 to-transparent px-4 pb-4 pt-10 text-left font-body text-base text-cream sm:text-lg">
                  {item.caption}
                </span>
              )}
            </motion.button>
          ))}
        </div>

        {many && (
          <>
            <TrackArrow side="left" onClick={() => step(-1)} disabled={current === 0} />
            <TrackArrow
              side="right"
              onClick={() => step(1)}
              disabled={current === stops.length - 1}
            />
          </>
        )}
      </div>

      {stops.length > 1 && (
        <div className="mt-7 flex items-center justify-center gap-2.5">
          {stops.map((stop, index) => (
            <button
              key={stop.photo}
              type="button"
              onClick={() => slideTo(index)}
              aria-label={`Go to photo ${stop.photo + 1} of ${items.length}`}
              aria-current={index === current}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === current
                  ? "w-7 bg-maroon"
                  : "w-2.5 bg-gold-deep/40 hover:bg-gold-deep/70"
              }`}
            />
          ))}
        </div>
      )}

      <Lightbox
        item={activeIndex === null ? null : (items[activeIndex] ?? null)}
        onClose={() => setActiveIndex(null)}
        onPrev={
          many
            ? () =>
                setActiveIndex((i) =>
                  i === null ? i : (i - 1 + items.length) % items.length,
                )
            : undefined
        }
        onNext={
          many
            ? () => setActiveIndex((i) => (i === null ? i : (i + 1) % items.length))
            : undefined
        }
      />
    </>
  );
}

function TrackArrow({
  side,
  onClick,
  disabled,
}: {
  side: "left" | "right";
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={side === "left" ? "Previous photos" : "Next photos"}
      className={`absolute top-1/2 z-20 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold bg-cream/95 font-display text-2xl leading-none text-maroon-900 shadow-[0_14px_32px_-16px_rgba(63,10,10,0.8)] transition-all duration-300 hover:bg-maroon hover:text-cream disabled:pointer-events-none disabled:opacity-0 sm:flex ${
        side === "left" ? "-left-4 lg:-left-6" : "-right-4 lg:-right-6"
      }`}
    >
      <span aria-hidden="true" className="-mt-1">
        {side === "left" ? "‹" : "›"}
      </span>
    </button>
  );
}
