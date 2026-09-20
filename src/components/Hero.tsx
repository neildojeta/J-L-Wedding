import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { Countdown } from "./Countdown";
import {
  FloralCorner,
  MonogramMark,
  Ornament,
  ROSE_COLUMN,
  ROSE_SWAG,
} from "./decor/FloralAccents";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="invitation"
      // The paper and its grain belong to the sheet in App, not to each
      // section — repeated per section they band down the page.
      className="relative scroll-mt-24 overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24"
    >
      {/* Hidden on phones, where they would sit on top of the names. */}
      <FloralCorner
        corner="tl"
        src={ROSE_COLUMN}
        size="w-32 lg:w-44"
        opacity="opacity-70"
        className="hidden sm:block"
      />
      <FloralCorner
        corner="tr"
        src={ROSE_COLUMN}
        size="w-32 lg:w-44"
        opacity="opacity-70"
        className="hidden sm:block"
      />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div {...fadeUp} transition={{ duration: 0.8 }}>
          <MonogramMark className="mb-5" />
        </motion.div>

        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body text-base font-medium uppercase tracking-[0.3em] text-maroon sm:text-lg sm:tracking-[0.36em]"
        >
          {wedding.intro.eyebrow}
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.2 }}
          // Laid out rather than left to wrap. As plain text the pair could
          // not break at all — JSX drops the whitespace between an expression
          // and an element on the next line, so it rendered as one
          // unbreakable "Jonmark&Linneth" and a phone clipped it against the
          // section's overflow. Given it has to break somewhere, stacking is
          // the better break: letting it flow put the ampersand at the head
          // of the second line, orphaned against the other name.
          // Spelled out for screen readers: the three spans carry no spaces
          // between them, so the computed name would otherwise run together
          // and the ampersand be read as "ampersand".
          aria-label={`${wedding.partnerOne.first} and ${wedding.partnerTwo.first}`}
          className="mt-6 flex flex-col items-center gap-y-1 font-script text-[clamp(2.6rem,12.5vw,7rem)] leading-[1.05] text-maroon-900 sm:flex-row sm:flex-wrap sm:justify-center sm:gap-x-4 sm:gap-y-0"
        >
          <span>{wedding.partnerOne.first}</span>
          <span className="foil">&amp;</span>
          <span>{wedding.partnerTwo.first}</span>
        </motion.h1>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-7 flex flex-col items-center gap-4"
        >
          <Ornament />
          <p className="font-display text-base uppercase tracking-[0.26em] text-maroon-900 sm:text-xl sm:tracking-[0.3em]">
            {wedding.dayLabel} &middot; {wedding.dateLabel}
          </p>
          <p className="font-body text-lg italic text-ink/85 sm:text-xl">
            {wedding.timeLabel} &middot; {wedding.venue.name}
          </p>
        </motion.div>

        {/* --- The photograph ------------------------------------- */}
        {/* The centrepiece of the page: gold mat, red hairline, engraved
            monogram plate. The frame's halo sits behind the figure, so the
            animated wrapper — not the figure — carries the transform.

            main_picture.webp is a crop of assets-source/main_picture.png,
            box (421, 61, 1611, 805) — 16:10 around the couple. The full
            frame gives half its height to out-of-focus grass. Phones get
            4:3, which trims the sides but still holds both of them. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="relative mx-auto mt-14 mb-10 w-full max-w-3xl sm:mt-16 sm:mb-12"
        >
          <img
            src={ROSE_SWAG}
            alt=""
            aria-hidden="true"
            className="floral relative z-10 mx-auto mb-3 w-40 sm:w-56"
          />

          <figure className="frame-gold">
            <div className="frame-gold-inner aspect-[4/3] sm:aspect-[16/10]">
              <img
                src={wedding.assets.mainPicture}
                alt={`${wedding.partnerOne.full} and ${wedding.partnerTwo.full}`}
                className="h-full w-full object-cover"
                fetchPriority="high"
              />
            </div>
            <figcaption className="absolute -bottom-4 left-1/2 -translate-x-1/2">
              <span className="painted-edge inline-block whitespace-nowrap border border-gold bg-maroon-950 px-6 py-2 font-display text-sm uppercase tracking-[0.32em] text-gold-soft shadow-[0_12px_28px_-16px_rgba(63,10,10,0.9)] sm:px-8 sm:text-base">
                {wedding.monogram}
              </span>
            </figcaption>
          </figure>
        </motion.div>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <p className="font-body text-xl italic leading-relaxed text-ink sm:text-2xl">
            &ldquo;{wedding.invitation.quote}&rdquo;
          </p>
          <footer className="mt-4 font-display text-base uppercase tracking-[0.24em] text-gold-deep">
            {wedding.invitation.quoteSource}
          </footer>
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink/90 sm:text-xl"
        >
          {wedding.invitation.message}
        </motion.p>

        <div className="mt-14">
          <Countdown />
        </div>
      </div>
    </section>
  );
}
