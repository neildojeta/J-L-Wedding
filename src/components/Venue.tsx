import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { MediaGrid } from "./MediaGrid";
import { FloralCorner, ROSE_2 } from "./decor/FloralAccents";

export function Venue() {
  return (
    <section
      id="venue"
      className="paper canvas-grain relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <FloralCorner corner="bl" src={ROSE_2} opacity="opacity-45" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          script="Where we'll be"
          title="The Venue"
          intro={wedding.venue.description}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8 }}
          className="painted-panel mx-auto mt-12 max-w-2xl px-8 py-9 text-center sm:px-12"
        >
          <h3 className="font-display text-xl uppercase tracking-[0.2em] text-maroon-900">
            {wedding.venue.name}
          </h3>
          <p className="mt-3 text-ink/75">{wedding.venue.address}</p>
          <a
            href={wedding.venue.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="painted-edge mt-7 inline-block border border-maroon/40 bg-transparent px-7 py-3 font-display text-[0.68rem] uppercase tracking-[0.26em] text-maroon transition-colors hover:bg-maroon hover:text-cream"
          >
            Get Directions
          </a>
        </motion.div>

        <div className="mt-14">
          <MediaGrid
            category="venue"
            columns="three"
            emptyLabel="Photos of the venue will be added here soon."
          />
        </div>
      </div>
    </section>
  );
}
