import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { MediaGrid } from "./MediaGrid";
import { FloralCorner, ROSE_BOUQUET, ROSE_SPRAY } from "./decor/FloralAccents";

const { dressCode } = wedding;

export function DressCode() {
  return (
    <section
      id="dress-code"
      // A washed band rather than a solid fill, so the sheet's grain carries
      // through it and neither edge lands as a line across the paper.
      className="paper-band relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <div className="canvas-grain absolute inset-0 opacity-60" aria-hidden="true" />

      <FloralCorner
        corner="tr"
        src={ROSE_SPRAY}
        size="w-28 sm:w-36"
        opacity="opacity-60"
        className="hidden sm:block"
      />
      <FloralCorner
        corner="bl"
        src={ROSE_BOUQUET}
        size="w-28 sm:w-40"
        opacity="opacity-50"
        className="hidden sm:block"
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          script="What to wear"
          title="Dress Code"
          intro={dressCode.title}
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {[
            { heading: "For the Ladies", body: dressCode.ladies },
            { heading: "For the Gentlemen", body: dressCode.gentlemen },
          ].map((card, index) => (
            <motion.div
              key={card.heading}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.75, delay: index * 0.1 }}
              className="painted-panel px-8 py-8 text-center"
            >
              <h3 className="font-display text-base uppercase tracking-[0.22em] text-gold-deep sm:text-lg">
                {card.heading}
              </h3>
              <p className="mt-4 text-lg leading-relaxed text-ink/90 sm:text-xl">
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* The wedding palette, offered to guests as colour guidance. */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="mt-14 text-center"
        >
          <h3 className="font-display text-base uppercase tracking-[0.24em] text-maroon-900 sm:text-lg">
            Our Colour Palette
          </h3>
          <ul className="mt-8 flex flex-wrap items-start justify-center gap-6 sm:gap-9">
            {dressCode.palette.map((swatch) => (
              <li key={swatch.hex} className="w-20 sm:w-24">
                <span
                  className="mx-auto block aspect-square w-full rounded-full shadow-[0_10px_26px_-14px_rgba(63,10,10,0.7)] ring-1 ring-inset ring-maroon-950/25"
                  style={{ backgroundColor: swatch.hex }}
                  aria-hidden="true"
                />
                <span className="mt-3 block font-body text-base font-medium uppercase tracking-[0.06em] text-ink/85">
                  {swatch.name}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-14">
          <MediaGrid category="dress_code" columns="three" hideWhenEmpty />
        </div>
      </div>
    </section>
  );
}
