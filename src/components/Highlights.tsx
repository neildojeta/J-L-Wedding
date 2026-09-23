import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { MediaCarousel } from "./MediaCarousel";
import {
  FloralCorner,
  FloralDivider,
  ROSE_BOUQUET,
  ROSE_STEM,
} from "./decor/FloralAccents";
import { wedding } from "../content/weddingContent";

const { story } = wedding;

/* One reveal for the verse and one for the line it builds to, rather than a
   fade on every stanza: the poem is one thought, and animating it a stanza
   at a time turns reading it into waiting for it. */
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: "easeOut" },
} as const;

export function Highlights() {
  return (
    <section
      id="highlights"
      className="relative scroll-mt-24 overflow-hidden px-5 py-20 sm:px-8 sm:py-28"
    >
      <FloralCorner
        corner="tr"
        src={ROSE_STEM}
        size="w-28 sm:w-36"
        opacity="opacity-55"
        className="hidden sm:block"
      />
      {/* The section runs long now that it carries the story, so it is
          bracketed top and bottom rather than weighted to one corner. */}
      <FloralCorner
        corner="bl"
        src={ROSE_BOUQUET}
        size="w-28 sm:w-40"
        opacity="opacity-45"
        className="hidden sm:block"
      />

      <div className="relative mx-auto max-w-5xl">
        <SectionHeading script={story.script} title={story.title} />

        {/* The poem, set as verse.

            One element per line the author wrote, so two of his lines are
            never re-flowed into one. Where a line outruns a phone,
            text-balance halves it evenly instead of stranding a word, and
            the leading inside a line is kept tighter than the gap between
            lines — without that difference a runover is indistinguishable
            from a break he actually made, which is the usual way verse on
            the web stops reading as verse. */}
        <motion.div
          {...reveal}
          viewport={{ once: true, amount: 0.15 }}
          className="verse-ground mx-auto mt-14 max-w-3xl px-2 py-12 text-center sm:px-10 sm:py-16"
        >
          {story.poem.map((stanza, index) => (
            <p
              key={stanza[0]}
              className={`flex flex-col gap-3 font-body text-[clamp(1.0625rem,4.4vw,1.375rem)] leading-[1.35] text-ink ${
                index > 0 ? "mt-10 sm:mt-12" : ""
              }`}
            >
              {stanza.map((line) => (
                <span key={line} className="text-balance">
                  {line}
                </span>
              ))}
            </p>
          ))}
        </motion.div>

        <motion.div
          {...reveal}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto mt-6 max-w-3xl text-center"
        >
          <span
            aria-hidden="true"
            className="mx-auto block h-px w-24 bg-gradient-to-r from-transparent via-gold-deep/70 to-transparent sm:w-32"
          />

          {/* The one line in Great Vibes on this whole section. Given room
              below it because the face's descenders are long, and left free
              to wrap — it is far too wide for a phone on one line. */}
          <p className="foil mx-auto mt-10 max-w-2xl text-balance font-script text-[clamp(1.85rem,8vw,3rem)] leading-[1.5]">
            {story.refrain}
          </p>

          <p className="mx-auto mt-7 max-w-xl text-balance font-body text-lg italic leading-relaxed text-ink/85 sm:text-xl">
            {story.coda}
          </p>
        </motion.div>

        {/* The rule the author drew between his verse and his account of it. */}
        <FloralDivider className="mt-16 sm:mt-20" />

        <motion.p
          {...reveal}
          viewport={{ once: true, amount: 0.3 }}
          className="mx-auto mt-14 max-w-2xl text-center text-lg leading-relaxed text-ink/90 sm:text-xl"
        >
          {story.prose}
        </motion.p>

        <div className="mt-20 sm:mt-24">
          <h3 className="brush-underline text-center font-display text-2xl uppercase tracking-[0.2em] text-maroon-900 sm:text-3xl">
            {story.galleryTitle}
          </h3>
          <p className="mx-auto mt-8 max-w-2xl text-center text-lg leading-relaxed text-ink/90 sm:text-xl">
            A few of our favourite moments on the way to {wedding.dateLabel}.
          </p>

          {/* The carousel's arrows sit outside the track, so this keeps a
              little room for them at the wide sizes. */}
          <div className="mt-12 sm:px-6 lg:px-8">
            <MediaCarousel
              category="highlight"
              label="Highlights"
              bundled={wedding.assets.highlights}
              emptyLabel="Our favourite photos and videos are on their way."
            />
          </div>
        </div>
      </div>
    </section>
  );
}
