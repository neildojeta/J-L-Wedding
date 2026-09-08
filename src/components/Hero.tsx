import { motion } from "framer-motion";
import { wedding } from "../content/weddingContent";
import { Countdown } from "./Countdown";
import { FloralCorner, Ornament, ROSE_1, ROSE_3 } from "./decor/FloralAccents";

const fadeUp = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section
      id="invitation"
      className="paper canvas-grain relative overflow-hidden px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-24"
    >
      {/* Hidden on phones, where they would sit on top of the names. */}
      <FloralCorner corner="tl" src={ROSE_3} opacity="opacity-60" className="hidden sm:block" />
      <FloralCorner corner="tr" src={ROSE_1} opacity="opacity-55" className="hidden sm:block" />

      <div className="relative mx-auto max-w-4xl text-center">
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-body text-[0.7rem] uppercase tracking-[0.4em] text-maroon/75 sm:text-xs"
        >
          {wedding.intro.eyebrow}
        </motion.p>

        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="mt-6 font-script text-6xl leading-[1.05] text-maroon-900 sm:text-8xl"
        >
          {wedding.bride.first}
          <span className="mx-3 text-gold sm:mx-5">&amp;</span>
          {wedding.groom.first}
        </motion.h1>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="mt-7 flex flex-col items-center gap-4"
        >
          <Ornament />
          <p className="font-display text-sm uppercase tracking-[0.3em] text-ink/80 sm:text-base">
            {wedding.dayLabel} &middot; {wedding.dateLabel}
          </p>
          <p className="font-body text-base italic text-ink/70">
            {wedding.timeLabel} &middot; {wedding.venue.name}
          </p>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="photo-frame mx-auto mt-12 aspect-[16/10] w-full max-w-3xl sm:mt-14"
        >
          <img
            src={wedding.assets.mainPicture}
            alt={`${wedding.bride.full} and ${wedding.groom.full}`}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.figure>

        <motion.blockquote
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9 }}
          className="mx-auto mt-14 max-w-2xl"
        >
          <p className="font-body text-xl italic leading-relaxed text-ink/85 sm:text-2xl">
            &ldquo;{wedding.invitation.quote}&rdquo;
          </p>
          <footer className="mt-3 font-display text-xs uppercase tracking-[0.28em] text-gold">
            {wedding.invitation.quoteSource}
          </footer>
        </motion.blockquote>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-ink/80"
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
