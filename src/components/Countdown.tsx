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
      className="mx-auto flex max-w-xl items-stretch justify-center gap-2 sm:gap-4"
      aria-label="Countdown to the wedding day"
    >
      {cells.map((cell) => (
        <div
          key={cell.label}
          className="painted-edge flex-1 border border-gold-deep/45 bg-cream/80 px-2 py-4 text-center shadow-[0_14px_34px_-24px_rgba(63,10,10,0.8)] sm:px-4 sm:py-5"
        >
          <div className="font-display text-3xl text-maroon-900 tabular-nums sm:text-5xl">
            {String(cell.value).padStart(2, "0")}
          </div>
          <div className="mt-1.5 font-body text-xs font-medium uppercase tracking-[0.14em] text-ink/85 sm:text-base sm:tracking-[0.2em]">
            {cell.label}
          </div>
        </div>
      ))}
    </motion.div>
  );
}
