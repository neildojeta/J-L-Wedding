import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { FloralDivider } from "./decor/FloralAccents";

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
              className="painted-edge border border-gold/35 bg-cream/[0.06] px-7 py-9 text-center backdrop-blur-sm sm:px-9"
            >
              <h3 className="font-display text-lg uppercase tracking-[0.28em] text-gold-soft">
                {event.name}
              </h3>
              <p className="mt-5 font-script text-5xl text-cream">{event.time}</p>
              <p className="mt-5 font-display text-sm uppercase tracking-[0.16em] text-cream/90">
                {event.venue}
              </p>
              <p className="mt-2 text-cream/70">{event.address}</p>
              {event.note && (
                <p className="mt-6 border-t border-gold/25 pt-5 text-sm italic text-gold-soft/85">
                  {event.note}
                </p>
              )}
            </motion.article>
          ))}
        </div>

        <FloralDivider className="mt-16 opacity-90" />
      </div>
    </section>
  );
}
