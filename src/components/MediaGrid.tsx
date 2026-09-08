import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useMedia } from "../hooks/useMedia";
import { isSupabaseConfigured, type MediaCategory, type MediaItem } from "../lib/supabase";

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
  bundled?: readonly { src: string; caption: string }[];
}

export function MediaGrid({
  category,
  emptyLabel = "Photos coming soon.",
  columns = "three",
  tone = "dark",
  bundled,
}: Props) {
  const { items: uploaded, loading, error } = useMedia(category);
  const [active, setActive] = useState<MediaItem | null>(null);

  // Bundled photos wear the same shape as an uploaded row, so the grid and
  // the lightbox below need to know nothing about where a photo came from.
  const items = useMemo<MediaItem[]>(
    () => [
      ...(bundled ?? []).map(
        (photo, index): MediaItem => ({
          id: `bundled-${index}`,
          category,
          media_type: "image",
          url: photo.src,
          caption: photo.caption,
          sort_order: index,
        }),
      ),
      ...uploaded,
    ],
    [bundled, uploaded, category],
  );

  const muted = tone === "light" ? "text-cream/85" : "text-ink/85";
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
    const message = error
      ? "We couldn't load these just now — please check back soon."
      : emptyLabel;
    return (
      <div className="mx-auto max-w-md text-center">
        <div
          className={`painted-edge border border-dashed px-8 py-10 ${
            tone === "light"
              ? "border-gold/50 bg-cream/[0.06]"
              : "border-gold-deep/50 bg-cream/60"
          }`}
        >
          <svg
            viewBox="0 0 48 48"
            aria-hidden="true"
            className={`mx-auto h-9 w-9 ${tone === "light" ? "text-gold" : "text-gold-deep"}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
          >
            <rect x="5" y="10" width="38" height="28" rx="3" />
            <circle cx="16" cy="20" r="3.2" />
            <path d="M5 32l11-9 9 7 7-5 11 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className={`mt-4 font-body text-lg italic ${muted}`}>{message}</p>
          {!isSupabaseConfigured && !error && (
            <p className={`mt-2 font-body text-base not-italic ${muted}`}>
              Connect Supabase to publish media here.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`grid gap-4 sm:gap-6 ${grid}`}>
        {items.map((item, index) => (
          <motion.button
            key={item.id}
            type="button"
            onClick={() => setActive(item)}
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
                <video
                  src={item.url}
                  muted
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-cover"
                />
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
                className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-[1.06]"
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

      <Lightbox item={active} onClose={() => setActive(null)} />
    </>
  );
}

function Lightbox({
  item,
  onClose,
}: {
  item: MediaItem | null;
  onClose: () => void;
}) {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!item) return;
    document.addEventListener("keydown", handleKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previous;
    };
  }, [item, handleKey]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption ?? "Media viewer"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-maroon-950/92 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="relative max-h-[88vh] w-full max-w-4xl"
          >
            {item.media_type === "video" ? (
              <video
                src={item.url}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] w-full rounded-sm bg-black object-contain"
              />
            ) : (
              <img
                src={item.url}
                alt={item.caption ?? ""}
                className="max-h-[80vh] w-full rounded-sm object-contain"
              />
            )}
            {item.caption && (
              <p className="mt-4 text-center font-body text-cream/85">{item.caption}</p>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute -top-3 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 bg-maroon text-cream transition-colors hover:bg-maroon-600 sm:-right-3"
            >
              &#10005;
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
