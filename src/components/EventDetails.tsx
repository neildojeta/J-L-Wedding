import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { FloralCorner, FloralDivider, ROSE_COLUMN } from "./decor/FloralAccents";

export function EventDetails() {
  return (
    <section
      id="details"
      className="relative overflow-hidden bg-maroon-950 px-5 py-20 text-cream sm:px-8 sm:py-28"
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
        <SectionHeading
          script="The Celebration"
          title="Order of the Day"
          intro={`${wedding.dayLabel}, ${wedding.dateLabel}`}
          tone="light"
        />

        <div className="mt-16 grid gap-8 sm:grid-cols-2 sm:gap-10">
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
              {event.note && (
                <p className="mt-6 border-t border-gold/40 pt-5 text-lg italic text-gold-soft sm:text-xl">
                  {event.note}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <FloralDivider className="mt-16" onDark />
      </div>
    </section>
  );
}
