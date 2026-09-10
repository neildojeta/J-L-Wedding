import { useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { IntroGate } from "./components/IntroGate";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EventDetails } from "./components/EventDetails";
import { Venue } from "./components/Venue";
import { DressCode } from "./components/DressCode";
import { Highlights } from "./components/Highlights";
import { RsvpForm } from "./components/RsvpForm";
import { Footer } from "./components/Footer";
import { DUST_SCATTER, GoldDust } from "./components/decor/FloralAccents";

/** `?open=1` jumps straight to the invitation, skipping the envelope. */
function shouldSkipIntro() {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("open");
}

export default function App() {
  const [opened, setOpened] = useState(shouldSkipIntro);

  // The page must not scroll behind the envelope screen.
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!opened && <IntroGate key="intro" onOpen={() => setOpened(true)} />}
      </AnimatePresence>

      {/* Everything the envelope contained is one sheet of paper lying on a
          dark desk. Note what must NOT move: the navbar stays outside the
          sheet, because the sheet is clipped with overflow-hidden to hold
          its torn edge, and `position: sticky` does not survive a clipping
          ancestor. */}
      <motion.main
        className="letter-desk relative min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: opened ? 0.25 : 0 }}
        aria-hidden={!opened}
        // visibility keeps the hidden page out of the tab order while the
        // envelope is still on screen; opacity still handles the fade.
        style={{ visibility: opened ? "visible" : "hidden" }}
      >
        <GoldDust
          src={DUST_SCATTER}
          className="inset-x-0 top-0 h-72 w-full object-cover"
          opacity="opacity-40"
        />

        <Navbar />

        <div className="relative px-3 pb-8 pt-2 sm:px-6 sm:pb-14 sm:pt-4">
          {/* canvas-grain is deliberately gone: the sheet now carries a
              photographed paper texture, and the procedural noise on top of
              it only muddied the fibre. */}
          <div className="letter-sheet paper relative mx-auto max-w-5xl overflow-hidden">
            <Hero />
            <EventDetails />
            <Venue />
            <DressCode />
            <Highlights />
            <RsvpForm />
            <Footer />
          </div>
        </div>
      </motion.main>
    </MotionConfig>
  );
}
