import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { MediaGrid } from "./MediaGrid";
import { FloralCorner, ROSE_STEM } from "./decor/FloralAccents";

const { venue } = wedding;

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
};

export function Venue() {
  return (
    <section
      id="venue"
      className="paper canvas-grain relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <FloralCorner corner="bl" src={ROSE_STEM} opacity="opacity-60" size="w-28 sm:w-40" />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading
          script="Where we'll be"
          title="The Venue"
          intro={venue.description}
        />

        {/* --- The place itself ----------------------------------- */}
        <motion.figure
          {...reveal}
          transition={{ duration: 0.8 }}
          className="photo-frame mx-auto mt-14 aspect-[3/2] max-w-3xl"
        >
          <img src={venue.photo.src} alt={venue.photo.alt} loading="lazy" />
        </motion.figure>

        {/* --- Address and directions ----------------------------- */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.8 }}
          className="painted-panel mx-auto mt-14 max-w-2xl px-8 py-9 text-center sm:px-12"
        >
          <h3 className="font-display text-xl uppercase tracking-[0.18em] text-maroon-900 sm:text-2xl">
            {venue.name}
          </h3>
          <p className="mt-4 text-lg text-ink/90">{venue.address}</p>
          <p className="mt-2 font-body text-base font-medium tracking-[0.1em] text-gold-deep">
            {venue.coordinates}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href={venue.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="painted-edge w-full border border-gold bg-maroon px-7 py-3.5 font-display text-sm font-medium uppercase tracking-[0.2em] text-cream shadow-[0_16px_36px_-22px_rgba(63,10,10,0.9)] transition-colors hover:bg-maroon-600 sm:w-auto sm:text-sm"
            >
              Get Directions
            </a>
            <a
              href={venue.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="painted-edge w-full border border-maroon/50 px-7 py-3.5 font-display text-sm font-medium uppercase tracking-[0.2em] text-maroon transition-colors hover:bg-maroon hover:text-cream sm:w-auto sm:text-sm"
            >
              Open in Google Maps
            </a>
          </div>
        </motion.div>

        {/* --- The map -------------------------------------------- */}
        {/* Google's embed endpoint needs no API key. The frame and the
            warm filter are in index.css, so the map sits on the paper
            without losing its street names. */}
        <motion.div
          {...reveal}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto mt-14 max-w-3xl"
        >
          <div className="map-frame aspect-[4/3] sm:aspect-[16/9]">
            <iframe
              src={venue.embedUrl}
              title={`Map showing ${venue.name}, ${venue.address}`}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-5 text-center font-body text-lg italic text-ink/85">
            Pinch or scroll to explore the map, or use Get Directions above for
            turn-by-turn from wherever you are starting.
          </p>
        </motion.div>

        <div className="mt-16">
          <MediaGrid
            category="venue"
            columns="three"
            emptyLabel="More photos of the garden will be added here soon."
          />
        </div>
      </div>
    </section>
  );
}
