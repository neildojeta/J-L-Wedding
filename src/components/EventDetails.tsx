import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import {
  FloralCorner,
  FloralDivider,
  MonogramMark,
  ROSE_COLUMN,
  ROSE_CREST,
} from "./decor/FloralAccents";

export function EventDetails() {
  return (
    <section
      id="details"
      className="letter-panel relative mx-4 my-2 scroll-mt-24 overflow-hidden bg-maroon-950 px-5 py-16 text-cream sm:mx-8 sm:my-4 sm:px-8 sm:py-20"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_0%,rgba(122,16,16,0.75),transparent_70%)]"
      />
      <div className="canvas-grain absolute inset-0 opacity-40" aria-hidden="true" />

      <FloralCorner
        corner="tl"
        src={ROSE_COLUMN}
        size="w-24 lg:w-32"
        opacity="opacity-55"
        onDark
        className="hidden sm:block"
      />
      <FloralCorner
        corner="tr"
        src={ROSE_COLUMN}
        size="w-24 lg:w-32"
        opacity="opacity-55"
        onDark
        className="hidden sm:block"
      />

      <div className="relative mx-auto max-w-5xl">
        <MonogramMark className="mb-5" onDark />
        <SectionHeading
          script="The Wedding Celebration"
          title="Order of the Day"
          intro={`${wedding.dayLabel}, ${wedding.dateLabel}`}
          tone="light"
        />

        {/* Two-up when there are two, but a lone card is centred at its own
            width instead of sitting in the left half of an empty row.
            Both class strings are static so Tailwind can still see them. */}
        <div
          className={`mt-16 grid gap-8 sm:gap-10 ${
            wedding.events.length > 1 ? "sm:grid-cols-2" : "mx-auto max-w-xl"
          }`}
        >
          {wedding.events.map((event, index) => (
            <motion.article
              key={event.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.8, delay: index * 0.12 }}
              className="painted-edge border border-gold/60 bg-cream/[0.08] px-7 py-9 text-center backdrop-blur-sm sm:px-9"
            >
              <h3 className="font-display text-lg uppercase tracking-[0.26em] text-gold-soft sm:text-xl">
                {event.name}
              </h3>
              <p className="foil-light mt-5 font-script text-6xl leading-none sm:text-7xl">
                {event.time}
              </p>
              <p className="mt-6 font-display text-base uppercase tracking-[0.14em] text-cream sm:text-lg">
                {event.venue}
              </p>
              <p className="mt-2 text-lg text-cream/85">{event.address}</p>
            </motion.article>
          ))}
        </div>

        {/* The crest is the one red-and-gold rose with enough gold leaf to
            hold its shape against the maroon. */}
        <FloralDivider className="mt-16" src={ROSE_CREST} onDark />
      </div>
    </section>
  );
}
