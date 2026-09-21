import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { useCountdown } from "../hooks/useCountdown";

export function Countdown() {
  const left = useCountdown(wedding.date);

  if (left.passed) {
    return (
      <p className="text-center font-script text-5xl text-maroon-900">
        Today we say &ldquo;I do&rdquo;.
      </p>
    );
  }

  const cells = [
    { value: left.days, label: "Days" },
    { value: left.hours, label: "Hours" },
    { value: left.minutes, label: "Minutes" },
    { value: left.seconds, label: "Seconds" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8 }}
      // A grid, not a flex row. As flex items the cells carried the default
      // min-width:auto, so "MINUTES" and "SECONDS" refused to shrink below
      // their labels and pushed the row wider than the sheet, which clips it.
      // Four equal 1fr tracks cannot be widened by their contents.
      className="mx-auto grid max-w-xl grid-cols-4 gap-1.5 sm:gap-4"
      aria-label="Countdown to the wedding day"
    >
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="painted-edge min-w-0 border border-gold-deep/45 bg-cream/80 px-1 py-4 text-center shadow-[0_14px_34px_-24px_rgba(63,10,10,0.8)] sm:px-4 sm:py-5"
        >
          <div className="font-display text-[clamp(1.6rem,7.5vw,1.875rem)] text-maroon-900 tabular-nums sm:text-5xl">
            {String(cell.value).padStart(2, "0")}
          </div>
          {/* Sized off the viewport rather than a fixed step: "SECONDS" is the
              widest label and a quarter of a phone-width sheet is all it gets. */}
          <div className="mt-1.5 font-body text-[clamp(0.5rem,2.6vw,0.75rem)] font-medium uppercase tracking-[0.06em] text-ink/85 sm:text-base sm:tracking-[0.2em]">
            {cell.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
