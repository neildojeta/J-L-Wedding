import { useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { MediaItem } from "../lib/supabase";

/**
 * Full-screen viewer for one photo or video. Shared by the grid and the
 * carousel, so a guest gets the same viewer wherever they tap.
 *
 * `onPrev`/`onNext` are optional: pass them and the viewer grows arrows and
 * answers the left/right keys, which is what the carousel wants. The grid
 * omits them and gets a plain viewer.
 */
export function Lightbox({
  item,
  onClose,
  onPrev,
  onNext,
}: {
  item: MediaItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}) {
  const handleKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev?.();
      if (event.key === "ArrowRight") onNext?.();
    },
    [onClose, onPrev, onNext],
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
                // Keyed by id so switching items inside the viewer loads the
                // new source instead of leaving the old one playing.
                key={item.id}
                src={item.url}
                controls
                autoPlay
                playsInline
                className="max-h-[80vh] w-full rounded-sm bg-black object-contain"
              />
            ) : (
              <img
                key={item.id}
                src={item.url}
                alt={item.caption ?? ""}
                className="max-h-[80vh] w-full rounded-sm object-contain"
              />
            )}
            {item.caption && (
              <p className="mt-4 text-center font-body text-cream/85">{item.caption}</p>
            )}

            {onPrev && (
              <ViewerArrow side="left" onClick={onPrev} label="Previous" />
            )}
            {onNext && <ViewerArrow side="right" onClick={onNext} label="Next" />}

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

function ViewerArrow({
  side,
  onClick,
  label,
}: {
  side: "left" | "right";
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/50 bg-maroon/85 font-display text-cream transition-colors hover:bg-maroon-600 ${
        side === "left" ? "left-1 sm:-left-14" : "right-1 sm:-right-14"
      }`}
    >
      {side === "left" ? "‹" : "›"}
    </button>
  );
}
