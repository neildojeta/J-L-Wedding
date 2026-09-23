import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { MonogramMark } from "./decor/FloralAccents";

const { gifts } = wedding;

export function GiftNote() {
  return (
    <section
      id="gifts"
      aria-labelledby="gifts-heading"
      // Shorter than the sections on either side, and with no floral
      // corners. A full section's worth of air around something this small
      // reads as a section that came up empty; this is meant to read as an
      // interlude in the letter.
      className="relative scroll-mt-24 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        // The one idea here: the small enclosure card that comes tucked
        // inside a wedding invitation. Everything else on this page is a
        // full-width section or a framed photograph, so at half their width,
        // carrying the couple's monogram and laid down a fraction off
        // square, it reads as a separate piece of paper rather than another
        // panel. The tilt is kept under a degree — enough to be felt,
        // little enough that nothing looks misaligned.
        className="painted-panel mx-auto max-w-lg rotate-[-0.7deg] px-7 py-10 text-center sm:px-12 sm:py-12"
      >
        <MonogramMark size="w-12 sm:w-14" />

        <h2
          id="gifts-heading"
          className="foil mt-5 font-script text-3xl leading-[1.4] sm:text-4xl"
        >
          {gifts.script}
        </h2>

        <p className="mt-7 text-lg leading-relaxed text-ink/90 sm:text-xl">
          {gifts.message}
        </p>

        {/* The warm close, set apart from the ask above it: this is the
            sentence the couple would rather a guest left with. */}
        <p className="mt-6 text-balance font-body text-xl italic leading-relaxed text-maroon-900 sm:text-2xl">
          {gifts.closing}
        </p>
      </motion.div>
    </section>
  );
}
