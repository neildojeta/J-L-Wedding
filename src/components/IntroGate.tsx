import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { wedding } from "../content/weddingContent";
import { FloralCorner, ROSE_1, ROSE_3 } from "./decor/FloralAccents";

/**
 * Safari plays WebM but does not composite its alpha channel — a
 * transparent video comes out sitting on a black block. Those browsers get
 * the cream-background cut instead, which is blended into the paper the
 * old way. Everything else gets true transparency.
 */
function useEnvelopeSource() {
  return useMemo(() => {
    if (typeof navigator === "undefined") return { transparent: true };
    const ua = navigator.userAgent;
    const isWebKit = /Safari/.test(ua) && !/Chrome|Chromium|Edg|OPR|SamsungBrowser/.test(ua);
    return { transparent: !isWebKit };
  }, []);
}

/**
 * The envelope screen. The footage floats directly on the paper rather
 * than sitting in a video box. Lettering stays clear of it: title above,
 * invitation and call to action below.
 */
export function IntroGate({ onOpen }: { onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opening, setOpening] = useState(false);
  const { transparent } = useEnvelopeSource();

  // Mobile browsers only autoplay muted video, and some need an
  // explicit play() call.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    void video.play().catch(() => undefined);
  }, []);

  function handleOpen() {
    if (opening) return;
    setOpening(true);
    window.setTimeout(onOpen, 520);
  }

  return (
    <motion.section
      key="intro"
      className="paper canvas-grain fixed inset-0 z-50 flex flex-col items-center justify-between overflow-hidden px-5 py-8 text-center sm:py-12"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(8px)" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      aria-label="Wedding invitation"
    >
      <FloralCorner corner="tl" src={ROSE_3} size="w-20 sm:w-44 lg:w-56" opacity="opacity-80" />
      <FloralCorner corner="br" src={ROSE_1} size="w-20 sm:w-44 lg:w-56" opacity="opacity-75" />

      {/* --- Title ------------------------------------------------ */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.9 }}
        className="relative z-10 shrink-0"
      >
        <p className="font-body text-[0.6rem] uppercase tracking-[0.38em] text-maroon/70 sm:text-xs">
          {wedding.intro.eyebrow}
        </p>
        <h1 className="mt-3 font-display text-3xl uppercase leading-tight tracking-[0.18em] text-maroon-900 sm:text-5xl">
          {wedding.intro.title}
        </h1>
      </motion.div>

      {/* --- The envelope ----------------------------------------- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 1.4, ease: "easeOut" }}
        className="relative z-0 flex min-h-0 w-full flex-1 items-center justify-center"
      >
        <video
          ref={videoRef}
          // The envelope sits inside a 16:9 frame with room around it, so a
          // portrait screen renders it small. Scaling up on phones gives it
          // the presence it has on a wide screen.
          className={`h-full max-h-[52vh] w-full max-w-3xl scale-[1.35] object-contain sm:scale-100 ${
            transparent ? "" : "video-vignette"
          }`}
          src={
            transparent
              ? wedding.assets.envelopeVideo
              : wedding.assets.envelopeVideoFallback
          }
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      </motion.div>

      {/* --- Names and call to action ----------------------------- */}
      <div className="relative z-10 shrink-0">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.9 }}
          className="font-body text-sm italic text-ink/70 sm:text-base"
        >
          {wedding.intro.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 1 }}
          className="mt-1 font-script text-[clamp(2rem,12vw,3rem)] leading-tight text-maroon sm:text-7xl"
        >
          {wedding.partnerOne.first}
          <span className="mx-2 text-gold sm:mx-4">&amp;</span>
          {wedding.partnerTwo.first}
        </motion.p>

        <motion.button
          type="button"
          onClick={handleOpen}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="painted-edge group mt-7 border border-gold/60 bg-maroon px-8 py-3.5 font-display text-[0.68rem] uppercase tracking-[0.28em] text-cream shadow-[0_18px_40px_-22px_rgba(63,10,10,0.9)] transition-colors hover:bg-maroon-600 sm:px-10 sm:text-xs"
        >
          <span className="inline-flex items-center gap-3">
            {wedding.intro.cta}
            <span
              aria-hidden="true"
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              &#10148;
            </span>
          </span>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="mt-5 font-body text-[0.6rem] uppercase tracking-[0.3em] text-ink/50 sm:text-xs"
        >
          {wedding.dateLabel}
        </motion.p>
      </div>
    </motion.section>
  );
}
