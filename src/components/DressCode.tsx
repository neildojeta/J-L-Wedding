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

        {/* One card per row, uncropped and at the full width of the sheet.
            Side by side they would be about half this wide, and the small
            print on them — the shades, the "no jeans" line — stops being
            readable well before that. They are still tight on a phone, so
            each one opens full-screen to be pinched. */}
        <div className="mt-14 space-y-8 sm:space-y-10">
          {cards.map((card, index) => (
            <motion.button
              key={card.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, delay: Math.min(index, 4) * 0.08 }}
              className="painted-edge block w-full cursor-zoom-in overflow-hidden border border-gold-deep/35 shadow-[0_18px_44px_-26px_rgba(63,10,10,0.75)] transition-transform duration-500 hover:-translate-y-1"
              aria-label={`${card.caption ?? "Dress code card"} — tap to enlarge`}
            >
              <img
                src={card.url}
                alt={card.caption ?? ""}
                loading="lazy"
                className="block w-full"
              />
            </motion.button>
          ))}
        </div>
      </div>

      <Lightbox
        item={activeIndex === null ? null : (cards[activeIndex] ?? null)}
        onClose={() => setActiveIndex(null)}
      />
    </section>
  );
}
