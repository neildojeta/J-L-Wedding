import { motion } from "framer-motion";

/**
 * Mute control for the theme song, parked in the bottom corner.
 *
 * The song starts on its own once the letter is opened, so a guest reading
 * this somewhere quiet needs a way to stop it that does not involve leaving
 * the page. Kept under the lightbox (z-[60]) and the envelope (z-50).
 */
export function MusicToggle({
  playing,
  onToggle,
}: {
  playing: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onToggle}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.4 }}
      whileTap={{ scale: 0.92 }}
      aria-label={playing ? "Pause the music" : "Play the music"}
      aria-pressed={playing}
      className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-maroon-950/85 text-gold-soft shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)] backdrop-blur-sm transition-colors hover:bg-maroon sm:bottom-6 sm:right-6 sm:h-12 sm:w-12"
    >
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-5 w-5 sm:h-[1.35rem] sm:w-[1.35rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* The speaker body is shared; only the waves/slash swap. */}
        <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4z" />
        {playing ? (
          <>
            <path d="M15.8 9.2a3.8 3.8 0 0 1 0 5.6" />
            <path d="M18.3 6.8a7.2 7.2 0 0 1 0 10.4" />
          </>
        ) : (
          <path d="M16 9.5l4.5 5m0-5l-4.5 5" />
        )}
      </svg>
    </motion.button>
  );
}
