import { useState } from "react";
import { motion } from "framer-motion";
import { useGalleryItems, type BundledPhoto } from "../hooks/useGalleryItems";
import { Lightbox } from "./Lightbox";
import { GalleryEmpty } from "./GalleryEmpty";
import type { MediaCategory } from "../lib/supabase";

interface Props {
  category: MediaCategory;
  /** Message shown when the couple has not uploaded anything yet. */
  emptyLabel?: string;
  columns?: "two" | "three";
  tone?: "dark" | "light";
  /**
   * Photos that ship with the site, shown ahead of anything the couple
   * later adds through Supabase. Pass a stable array — one built inline
   * would rebuild the gallery on every render.
   */
  bundled?: readonly BundledPhoto[];
}

export function MediaGrid({
  category,
  emptyLabel = "Photos coming soon.",
  columns = "three",
  tone = "dark",
  bundled,
}: Props) {
  const { items, loading, error } = useGalleryItems(category, bundled);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const grid =
    columns === "two"
      ? "grid-cols-1 sm:grid-cols-2"
      : "grid-cols-2 sm:grid-cols-2 lg:grid-cols-3";

  // Bundled photos are already on hand, so they show at once — the skeleton
  // is only for a gallery that has nothing to draw yet.
  if (loading && items.length === 0) {
    return (
      <div className={`grid gap-4 ${grid}`} aria-busy="true">
        {Array.from({ length: columns === "two" ? 2 : 3 }).map((_, i) => (
          <div
            key={i}
            className="painted-edge aspect-[4/3] animate-pulse bg-gold-soft/25"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <GalleryEmpty message={emptyLabel} error={error} tone={tone} />;
  }

  return (
    <>
      <div className={`grid gap-4 sm:gap-6 ${grid}`}>
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(index)}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: Math.min(index, 6) * 0.06 }}
            whileHover={{ y: -4 }}
            className="photo-frame group aspect-[4/3] cursor-zoom-in"
            aria-label={item.caption ?? `Open ${item.media_type}`}
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
                loading="lazy"
                className="transition-transform duration-[1200ms] group-hover:scale-[1.06]"
              />
            )}
            {item.caption && (
              <span className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-maroon-950/90 to-transparent px-3 pb-3 pt-8 text-left font-body text-base text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                {item.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <Lightbox
        item={activeIndex === null ? null : (items[activeIndex] ?? null)}
        onClose={() => setActiveIndex(null)}
      />
    </>
  );
}
