import { useState } from "react";
import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { SectionHeading } from "./SectionHeading";
import { Lightbox } from "./Lightbox";
import { useMedia } from "../hooks/useMedia";
import type { MediaItem } from "../lib/supabase";
import { FloralCorner, ROSE_BOUQUET, ROSE_SPRAY } from "./decor/FloralAccents";

const { dressCode } = wedding;

/** The cards that ship with the site, shaped like uploaded rows. */
const BUNDLED_CARDS: MediaItem[] = wedding.assets.attireCards.map(
  (card, index) => ({
    id: `bundled-attire-${index}`,
    category: "dress_code",
    media_type: "image",
    url: card.src,
    caption: card.caption,
    sort_order: index,
  }),
);

export function DressCode() {
  // Uploaded cards stand in for the bundled pair rather than queueing up
  // behind them: they are the same two cards re-exported, and showing both
  // sets would print the dress code twice. Re-exporting from Canva and
  // running `npm run upload-media` therefore needs no redeploy, while the
  // bundled copies keep the section filled if Supabase is unreachable.
  const { items: uploaded } = useMedia("dress_code");
  const cards = uploaded.length > 0 ? uploaded : BUNDLED_CARDS;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

        <p className="mx-auto mt-4 max-w-xl text-center font-body text-lg italic text-maroon-900 sm:text-xl">
          {dressCode.note}
        </p>

        {/* Each card is mounted the way the hero photograph is — poured gold
            mat, maroon nameplate — rather than laid on the paper as a bare
            rectangle. The artwork is white stock and the sheet is cream, so
            without a mat between them the cards read as something pasted on.

            One per row: side by side they would be half this wide, and the
            small print — the shades, the "no jeans" line — stops being
            readable well before that. */}
        <div className="mt-16 space-y-16 sm:space-y-20">
          {cards.map((card, index) => {
            // Taken by position, so an uploaded card inherits the heading of
            // the bundled one it stands in for.
            const heading = wedding.assets.attireCards[index]?.heading;

            return (
              <motion.figure
                key={card.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8 }}
              >
                {/* Kept quiet on purpose. The cards are busy artwork in
                    their own right, so the label borrows the same brush
                    underline the section titles use rather than competing
                    with them from a plate of its own. */}
                {heading && (
                  <figcaption className="brush-underline mx-auto mb-9 max-w-md text-center font-display text-sm uppercase leading-relaxed tracking-[0.2em] text-gold-deep sm:mb-10 sm:max-w-2xl sm:text-base sm:tracking-[0.26em]">
                    {heading}
                  </figcaption>
                )}

                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="frame-gold block w-full cursor-zoom-in"
                  aria-label={`${heading ?? card.caption ?? "Dress code card"} — open full screen`}
                >
                  <span className="frame-gold-inner block">
                    <img
                      src={card.url}
                      alt={card.caption ?? ""}
                      loading="lazy"
                      className="block w-full"
                    />
                  </span>
                </button>

                {/* On a phone the card is about 290px wide, which puts its
                    smallest line near 5px. Say so plainly rather than leave
                    a guest squinting at it. */}
                <p className="mt-4 text-center font-body text-base italic text-ink/70 sm:hidden">
                  Tap to open it full screen
                </p>
              </motion.figure>
            );
          })}
        </div>
      </div>

      <Lightbox
        item={activeIndex === null ? null : (cards[activeIndex] ?? null)}
        onClose={() => setActiveIndex(null)}
      />
    </section>
  );
}
