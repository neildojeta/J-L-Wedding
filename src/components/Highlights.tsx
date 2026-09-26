import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { MediaCarousel } from "./MediaCarousel";
import { Lightbox } from "./Lightbox";
import { AerialFilm } from "./AerialFilm";
import {
  FloralCorner,
  FloralDivider,
  ROSE_BOUQUET,
  ROSE_STEM,
} from "./decor/FloralAccents";
import { wedding } from "../content/weddingContent";
import type { MediaItem } from "../lib/supabase";

const { story } = wedding;

/* What the picture says, for anyone who cannot see it. Kept as one string
   with the author's line breaks intact: a screen reader is the only way a
   blind guest gets this poem at all, so it is worth giving them his lines
   rather than a paragraph. */
const TRANSCRIPT = story.poem.map((stanza) => stanza.join("\n")).join("\n\n");

/* The viewer takes a media row, and this is a bundled picture rather than an
   uploaded one, so it is shaped like a row to borrow the same viewer the
   gallery and the attire cards use. */
const STORY_ITEM: MediaItem = {
  id: "bundled-story",
  category: "highlight",
  media_type: "image",
  url: story.image,
  caption: "Our story",
  sort_order: 0,
};

export function Highlights() {
  const [zoomed, setZoomed] = useState(false);

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

        {/* The poem, as the couple drew it.

            Mounted in the gold mat the attire cards and the hero photograph
            use, for the same reason: the collage is a brown rectangle and
            the letter is cream, so without a mat between them it reads as
            something spilled on the page rather than laid on it.

            Wider than the prose below it because the artwork is landscape
            and its lines run nearly its full width — every pixel of column
            is a pixel of legibility. */}
        <motion.figure
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto mt-14 max-w-4xl"
        >
          <button
            type="button"
            onClick={() => setZoomed(true)}
            className="frame-gold block w-full cursor-zoom-in"
            aria-label="Our story, written out — open it full screen"
          >
            <span className="frame-gold-inner block">
              <img
                src={story.image}
                alt={TRANSCRIPT}
                loading="lazy"
                width={1800}
                height={1272}
                className="block w-full"
              />
            </span>
          </button>

          {/* The artwork is landscape and densely set. On a phone it lands
              near 300px wide, which puts the typewriting under 7px — far
              past squinting. Say so plainly and hand them the viewer, the
              way the attire cards already do. */}
          <figcaption className="mt-4 text-center font-body text-base italic text-ink/70 sm:hidden">
            Tap to read it full screen
          </figcaption>
        </motion.figure>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto mt-12 max-w-xl text-balance text-center font-body text-xl italic leading-relaxed text-maroon-900 sm:mt-14 sm:text-2xl"
        >
          {story.coda}
        </motion.p>

        {/* The rule the author drew between his verse and his account of it. */}
        <FloralDivider className="mt-16 sm:mt-20" />

        {/* Six paragraphs, each set on its own and given a gap wider than
            its own line spacing. Centred, like everything else on this
            sheet, which a long unbroken run of text would not survive — but
            these are two and three sentences each, so every one reads as its
            own short block rather than as a slab with no left edge to find.

            One reveal for the whole account, not one per paragraph: a fade
            on each would turn reading it into waiting for it. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="mx-auto mt-14 max-w-2xl space-y-6 text-center sm:space-y-7"
        >
          {story.prose.map((paragraph, index) =>
            index === story.prose.length - 1 ? (
              // The landing. Taken up a step and into the maroon rather than
              // given a device of its own: it is the last thing said before
              // the photographs, and it should read as an ending.
              <p
                key={paragraph}
                className="text-balance font-body text-xl leading-relaxed text-maroon-900 sm:text-2xl"
              >
                {paragraph}
              </p>
            ) : (
              <p
                key={paragraph}
                className="text-lg leading-relaxed text-ink/90 sm:text-xl"
              >
                {paragraph}
              </p>
            ),
          )}
        </motion.div>

        {/* The story's last line says they stand hand in hand; this is that,
            seen from a few hundred feet up. It closes the account rather than
            opening the gallery, so it sits above the Highlights heading.

            Drawn at the full width of the section — wider than the poem, the
            prose and the photographs. The couple are perhaps ten pixels tall
            in it, and that is the shot: two people alone in a very large
            green place. Shrink it into a column and there is nothing to see.

            The cream mat rather than the gold one the poem wears: this is a
            photograph, and the section already spent its gold on artwork. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="photo-frame mt-16 aspect-video w-full sm:mt-20"
        >
          <AerialFilm />
        </motion.div>

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

      <Lightbox item={zoomed ? STORY_ITEM : null} onClose={() => setZoomed(false)} />
    </section>
  );
}
